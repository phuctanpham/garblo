import { MongoClient } from 'mongodb'

interface Env {
  MONGODB_URI: string
  GEMINI_API_KEY?: string
  STORAGE_TYPE?: string
  S3_BUCKET?: string
  S3_REGION?: string
  S3_ACCESS_KEY?: string
  S3_SECRET_KEY?: string
  S3_ENDPOINT?: string
}

// ── CORS ──────────────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  'Access-Control-Allow-Origin' : '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

function corsJson(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: CORS_HEADERS })
}

// ── Router ────────────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    const url    = new URL(request.url)
    const path   = url.pathname
    const method = request.method

    if (path === '/healthcheck')                            return handleHealthcheck(env)
    if (path === '/api/items'   && method === 'GET')        return handleGetItems(env)
    if (path === '/api/items'   && method === 'POST')       return handlePostItems(request, env)
    if (path === '/api/models'  && method === 'GET')        return handleGetModels(env)
    if (path === '/api/models'  && method === 'POST')       return handlePostModels(request, env)
    if (path === '/api/outfits' && method === 'GET')        return handleGetOutfits(env)
    if (path === '/api/outfits/generate' && method === 'POST') return handleGenerateOutfit(request, env)

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  },
} satisfies ExportedHandler<Env>

// ── DB ────────────────────────────────────────────────────────────────────────

function getDb(env: Env) {
  const client = new MongoClient(env.MONGODB_URI)
  return client
}

// ── GET /api/items ────────────────────────────────────────────────────────────

async function handleGetItems(env: Env): Promise<Response> {
  const client = getDb(env)
  try {
    await client.connect()
    const items = await client.db().collection('items').find().sort({ createdAt: -1 }).toArray()
    return corsJson(items.map(serializeDoc))
  } catch (err) {
    return corsJson({ error: (err as Error).message }, 500)
  } finally { await client.close() }
}

// ── POST /api/items ───────────────────────────────────────────────────────────

async function handlePostItems(request: Request, env: Env): Promise<Response> {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File | null
    if (!file) return corsJson({ error: 'No file uploaded' }, 400)

    const allowedMimes: Record<string, string> = {
      'image/png': '.png', 'image/jpeg': '.jpg', 'image/jpg': '.jpg', 'image/webp': '.webp',
    }
    const ext = allowedMimes[file.type]
    if (!ext) return corsJson({ error: 'Unsupported file type' }, 400)

    // Size check (5 MB)
    if (file.size > 5 * 1024 * 1024) return corsJson({ error: 'File too large' }, 413)

    const buffer   = Buffer.from(await file.arrayBuffer())
    const filename = `item-${Date.now()}${ext}`
    const imageUrl = await saveToStorage(buffer, filename, file.type, env)

    const client = getDb(env)
    try {
      await client.connect()
      const result = await client.db().collection('items').insertOne({
        name     : (formData.get('name')     as string) || 'New Item',
        category : (formData.get('category') as string) || 'clothing',
        imageUrl,
        createdAt: new Date(),
      })
      const item = await client.db().collection('items').findOne({ _id: result.insertedId })
      return corsJson(serializeDoc(item!), 201)
    } finally { await client.close() }
  } catch (err) {
    return corsJson({ error: (err as Error).message }, 500)
  }
}

// ── GET /api/models ───────────────────────────────────────────────────────────

async function handleGetModels(env: Env): Promise<Response> {
  const client = getDb(env)
  try {
    await client.connect()
    const models = await client.db().collection('models').find().sort({ createdAt: -1 }).toArray()
    return corsJson(models.map(serializeDoc))
  } catch (err) {
    return corsJson({ error: (err as Error).message }, 500)
  } finally { await client.close() }
}

// ── POST /api/models ──────────────────────────────────────────────────────────

const ALLOWED_MODEL_MIMES = new Set(['image/jpeg','image/png','image/gif','image/webp'])
const ALLOWED_MODEL_EXTS  = new Set(['.jpg','.jpeg','.png','.webp','.gif'])

async function handlePostModels(request: Request, env: Env): Promise<Response> {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File | null
    if (!file) return corsJson({ error: 'No file uploaded' }, 400)

    if (!ALLOWED_MODEL_MIMES.has(file.type))
      return corsJson({ error: 'Only image uploads are allowed' }, 400)

    const ext = ('.' + file.name.split('.').pop()).toLowerCase()
    if (!ALLOWED_MODEL_EXTS.has(ext))
      return corsJson({ error: 'Unsupported image file extension' }, 400)

    if (file.size > 5 * 1024 * 1024)
      return corsJson({ error: 'Uploaded file is too large' }, 413)

    const buffer   = Buffer.from(await file.arrayBuffer())
    const filename = `model-${Date.now()}${ext}`
    const imageUrl = await saveToStorage(buffer, filename, file.type, env)

    const client = getDb(env)
    try {
      await client.connect()
      const result = await client.db().collection('models').insertOne({
        name     : (formData.get('name') as string) || 'My Model',
        imageUrl,
        createdAt: new Date(),
      })
      const model = await client.db().collection('models').findOne({ _id: result.insertedId })
      return corsJson(serializeDoc(model!), 201)
    } finally { await client.close() }
  } catch (err) {
    return corsJson({ error: (err as Error).message }, 500)
  }
}

// ── GET /api/outfits ──────────────────────────────────────────────────────────

async function handleGetOutfits(env: Env): Promise<Response> {
  const client = getDb(env)
  try {
    await client.connect()
    const outfits = await client.db().collection('outfits').find().sort({ createdAt: -1 }).toArray()
    return corsJson(outfits.map(serializeDoc))
  } catch (err) {
    return corsJson({ error: (err as Error).message }, 500)
  } finally { await client.close() }
}

// ── POST /api/outfits/generate ────────────────────────────────────────────────

async function handleGenerateOutfit(request: Request, env: Env): Promise<Response> {
  try {
    const { modelId, itemIds } = await request.json() as { modelId: string; itemIds: string[] }

    if (!modelId || !Array.isArray(itemIds) || itemIds.length === 0)
      return corsJson({ error: 'modelId and itemIds[] are required' }, 400)

    if (!isValidObjectId(modelId))
      return corsJson({ error: 'Invalid modelId' }, 400)

    const badItem = itemIds.find(id => !isValidObjectId(id))
    if (badItem) return corsJson({ error: `Invalid itemId: ${badItem}` }, 400)

    const client = getDb(env)
    try {
      await client.connect()
      const db = client.db()

      const { ObjectId } = await import('mongodb')
      const model = await db.collection('models').findOne({ _id: new ObjectId(modelId) })
      if (!model) return corsJson({ error: 'Model not found' }, 404)

      const items = await db.collection('items')
        .find({ _id: { $in: itemIds.map(id => new ObjectId(id)) } }).toArray()
      if (items.length === 0)          return corsJson({ error: 'No items found' }, 404)
      if (items.length !== itemIds.length) return corsJson({ error: 'One or more items not found' }, 404)

      const itemNames = items.map(i => i.name).join(', ')
      const prompt    = `A fashion model wearing ${itemNames}. Professional fashion photography, clean white background, full body shot, high quality.`
      const provider  = (env.IMAGE_GEN_PROVIDER ?? 'pollinations') as string

      const imageBuffer = await generateImage(prompt, provider, env)
      const filename    = `outfit-${Date.now()}.png`
      const resultImageUrl = await saveToStorage(imageBuffer, filename, 'image/png', env)

      const result = await db.collection('outfits').insertOne({
        modelId : new ObjectId(modelId),
        itemIds : itemIds.map(id => new ObjectId(id)),
        resultImageUrl,
        provider,
        createdAt: new Date(),
      })
      const outfit = await db.collection('outfits').findOne({ _id: result.insertedId })
      return corsJson(serializeDoc(outfit!), 201)
    } finally { await client.close() }
  } catch (err) {
    return corsJson({ error: (err as Error).message }, 500)
  }
}

// ── GET /healthcheck ──────────────────────────────────────────────────────────

async function handleHealthcheck(env: Env): Promise<Response> {
  const [mongodb, gemini, s3] = await Promise.all([
    checkMongoDB(env), checkGemini(env), checkS3(env),
  ])
  const services: Record<string, { ok: boolean; message: string }> = { mongodb }
  if (gemini !== null) services.gemini = gemini
  if (s3     !== null) services.s3     = s3
  const allOk = Object.values(services).every(s => s.ok)
  return corsJson({ status: allOk ? 'ok' : 'degraded', services }, allOk ? 200 : 503)
}

// ── Storage ───────────────────────────────────────────────────────────────────

async function saveToStorage(
  buffer: Buffer, filename: string, contentType: string, env: Env
): Promise<string> {
  const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3')
  const client = new S3Client({
    region     : env.S3_REGION ?? 'auto',
    credentials: { accessKeyId: env.S3_ACCESS_KEY!, secretAccessKey: env.S3_SECRET_KEY! },
    ...(env.S3_ENDPOINT && { endpoint: env.S3_ENDPOINT, forcePathStyle: true }),
  })
  const key = `uploads/${filename}`
  await client.send(new PutObjectCommand({ Bucket: env.S3_BUCKET!, Key: key, Body: buffer, ContentType: contentType }))
  return `/uploads/${filename}`
}

// ── Image generation ──────────────────────────────────────────────────────────

async function generateImage(prompt: string, provider: string, env: Env): Promise<Buffer> {
  if (provider === 'gemini' && env.GEMINI_API_KEY) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${env.GEMINI_API_KEY}`
    const res = await fetch(url, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseModalities: ['image'] } }),
    })
    const data = await res.json() as { candidates?: { content?: { parts?: { inlineData?: { data: string } }[] } }[] }
    const b64  = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data
    if (b64) return Buffer.from(b64, 'base64')
  }
  // Fallback: Pollinations
  const imageRes = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=768&nologo=true`)
  return Buffer.from(await imageRes.arrayBuffer())
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isValidObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id)
}

function serializeDoc(doc: Record<string, unknown>): Record<string, unknown> {
  const out = { ...doc }
  if (out._id) out._id = String(out._id)
  if (out.modelId) out.modelId = String(out.modelId)
  if (Array.isArray(out.itemIds)) out.itemIds = out.itemIds.map(String)
  if (out.createdAt instanceof Date) out.createdAt = out.createdAt.toISOString()
  return out
}

// ── Health check helpers ──────────────────────────────────────────────────────

async function checkMongoDB(env: Env): Promise<{ ok: boolean; message: string }> {
  const client = new MongoClient(env.MONGODB_URI)
  try {
    await client.connect()
    await client.db('admin').command({ ping: 1 })
    return { ok: true, message: 'connected' }
  } catch (err) {
    return { ok: false, message: (err as Error).message }
  } finally { await client.close() }
}

async function checkGemini(env: Env): Promise<{ ok: boolean; message: string } | null> {
  const apiKey = env.GEMINI_API_KEY?.trim()
  if (!apiKey) return null
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=1`, { signal: AbortSignal.timeout(8_000) })
    return res.ok ? { ok: true, message: 'reachable' } : { ok: false, message: `HTTP ${res.status}` }
  } catch (err) { return { ok: false, message: (err as Error).message } }
}

async function checkS3(env: Env): Promise<{ ok: boolean; message: string } | null> {
  if (env.STORAGE_TYPE !== 's3') return null
  const { S3Client, HeadBucketCommand } = await import('@aws-sdk/client-s3')
  const bucket = env.S3_BUCKET?.trim()
  const region = env.S3_REGION?.trim() || 'auto'
  const accessKeyId = env.S3_ACCESS_KEY?.trim()
  const secretAccessKey = env.S3_SECRET_KEY?.trim()
  const endpoint = env.S3_ENDPOINT?.trim() || undefined
  if (!bucket || !accessKeyId || !secretAccessKey) return { ok: false, message: 'S3 credentials incomplete' }
  try {
    const client = new S3Client({ region, credentials: { accessKeyId, secretAccessKey }, ...(endpoint && { endpoint, forcePathStyle: true }) })
    await client.send(new HeadBucketCommand({ Bucket: bucket }))
    const p = endpoint?.includes('r2.cloudflarestorage') ? 'R2' : 'S3'
    return { ok: true, message: `${p} bucket "${bucket}" accessible` }
  } catch (err) { return { ok: false, message: (err as Error).message } }
}
