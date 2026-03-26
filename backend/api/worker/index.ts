import { MongoClient } from 'mongodb'

// Declare all vars/secrets you set in the Cloudflare dashboard
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/healthcheck') {
      return handleHealthcheck(env)
    }

    if (url.pathname.startsWith('/api/')) {
      return Response.json({ name: 'Garblo' })
    }

    return new Response(null, { status: 404 })
  },
} satisfies ExportedHandler<Env>

// ── helpers ───────────────────────────────────────────────────────────────────

async function checkMongoDB(env: Env): Promise<{ ok: boolean; message: string }> {
  const client = new MongoClient(env.MONGODB_URI)
  try {
    await client.connect()
    await client.db('admin').command({ ping: 1 })
    return { ok: true, message: 'connected' }
  } catch (err) {
    return { ok: false, message: (err as Error).message }
  } finally {
    await client.close() // must close — Workers don't persist connections
  }
}

async function checkGemini(env: Env): Promise<{ ok: boolean; message: string } | null> {
  const apiKey = env.GEMINI_API_KEY?.trim()
  if (!apiKey) return null

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=1`,
      { signal: AbortSignal.timeout(8_000) },
    )
    return res.ok
      ? { ok: true, message: 'reachable' }
      : { ok: false, message: `HTTP ${res.status}` }
  } catch (err) {
    return { ok: false, message: (err as Error).message }
  }
}

async function checkS3(env: Env): Promise<{ ok: boolean; message: string } | null> {
  if (env.STORAGE_TYPE !== 's3') return null

  const { S3Client, HeadBucketCommand } = await import('@aws-sdk/client-s3')
  const bucket = env.S3_BUCKET?.trim()
  const region = env.S3_REGION?.trim() || 'auto'
  const accessKeyId = env.S3_ACCESS_KEY?.trim()
  const secretAccessKey = env.S3_SECRET_KEY?.trim()
  const endpoint = env.S3_ENDPOINT?.trim() || undefined

  if (!bucket || !accessKeyId || !secretAccessKey) {
    return { ok: false, message: 'S3 credentials incomplete' }
  }

  try {
    const client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
      ...(endpoint && { endpoint, forcePathStyle: true }),
    })
    await client.send(new HeadBucketCommand({ Bucket: bucket }))
    const provider = endpoint?.includes('r2.cloudflarestorage') ? 'R2' : 'S3'
    return { ok: true, message: `${provider} bucket "${bucket}" accessible` }
  } catch (err) {
    return { ok: false, message: (err as Error).message }
  }
}

async function handleHealthcheck(env: Env): Promise<Response> {
  const [mongodb, gemini, s3] = await Promise.all([
    checkMongoDB(env),
    checkGemini(env),
    checkS3(env),
  ])

  const services: Record<string, { ok: boolean; message: string }> = { mongodb }
  if (gemini !== null) services.gemini = gemini
  if (s3 !== null) services.s3 = s3

  const allOk = Object.values(services).every((s) => s.ok)
  return Response.json(
    { status: allOk ? 'ok' : 'degraded', services },
    { status: allOk ? 200 : 503 },
  )
}