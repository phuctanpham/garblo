import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import path from 'path'
import multer from 'multer'
import axios from 'axios'
import { S3Client, HeadBucketCommand } from '@aws-sdk/client-s3'
import { connectDB } from './utils/db'
import itemRoutes from './routes/items'
import modelRoutes from './routes/models'
import outfitRoutes from './routes/outfits'
import healthcheckRouter from './routes/healthcheck'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors())
app.use(express.json())
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'public', 'uploads')),
)

app.use('/api/items', itemRoutes)
app.use('/api/models', modelRoutes)
app.use('/api/outfits', outfitRoutes)
app.use('/healthcheck', healthcheckRouter)

// Centralized error handler: maps Multer errors (incl. fileFilter rejections) to 400
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: err.message })
    return
  }
  res.status(500).json({ error: err.message })
})

// ── startup service checks ────────────────────────────────────────────────────

async function checkGenAI(): Promise<void> {
  const provider = process.env.IMAGE_GEN_PROVIDER ?? 'pollinations'

  if (provider === 'gemini') {
    const apiKey = process.env.GEMINI_API_KEY?.trim()
    if (!apiKey) {
      console.warn('⚠️ genAI Service Connected: GEMINI_API_KEY not set')
      return
    }
    try {
      const model = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash-exp-image-generation'
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=1`
      await axios.get(url, { timeout: 8_000 })
      console.log(`✅ genAI Service Connected: Gemini (model: ${model})`)
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? `HTTP ${err.response?.status ?? 'timeout'}: ${err.response?.data?.error?.message ?? err.message}`
        : (err as Error).message
      console.error(`❌ genAI Service Connected: Gemini — ${msg}`)
    }
    return
  }

  if (provider === 'huggingface') {
    const apiKey = process.env.HF_API_KEY?.trim()
    const model = process.env.HF_MODEL ?? 'stabilityai/stable-diffusion-2'
    if (!apiKey) {
      console.warn('⚠️ genAI Service Connected: HF_API_KEY not set')
      return
    }
    console.log(`✅ genAI Service Connected: HuggingFace (model: ${model})`)
    return
  }

  // pollinations — no key required
  console.log('✅ genAI Service Connected: Pollinations (no auth required)')
}

async function checkStorage(): Promise<void> {
  const storageType = process.env.STORAGE_TYPE ?? 'local'

  if (storageType === 'local') {
    console.log('✅ Storage Service Connected: Local filesystem')
    return
  }

  if (storageType === 's3') {
    const bucket = process.env.S3_BUCKET?.trim()
    const region = process.env.S3_REGION?.trim() || 'auto'
    const accessKeyId = process.env.S3_ACCESS_KEY?.trim()
    const secretAccessKey = process.env.S3_SECRET_KEY?.trim()
    const endpoint = process.env.S3_ENDPOINT?.trim() || undefined

    if (!bucket || !accessKeyId || !secretAccessKey) {
      console.warn('⚠️ Storage Service Connected: S3 credentials incomplete in .env')
      return
    }

    if (region === 'auto' && !endpoint) {
      console.warn(
        '⚠️ Storage Service Connected: S3_REGION=auto looks like Cloudflare R2 — set S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com',
      )
      return
    }

    try {
      const client = new S3Client({
        region,
        credentials: { accessKeyId, secretAccessKey },
        ...(endpoint && { endpoint, forcePathStyle: true }),
      })
      await client.send(new HeadBucketCommand({ Bucket: bucket }))
      const provider = endpoint?.includes('r2.cloudflarestorage') ? 'Cloudflare R2' : 'AWS S3'
      console.log(`✅ Storage Service Connected: ${provider} (bucket: ${bucket})`)
    } catch (err) {
      console.error(`❌ Storage Service Connected: S3 — ${(err as Error).message}`)
    }
    return
  }

  console.warn(`⚠️ Storage Service Connected: Unknown STORAGE_TYPE="${storageType}"`)
}

// ── boot ─────────────────────────────────────────────────────────────────────

connectDB()
  .then(async () => {
    await Promise.all([checkGenAI(), checkStorage()])
    app.listen(PORT, () =>
      console.log(`✅ API running on http://localhost:${PORT}`),
    )
  })
  .catch((err: Error) => {
    console.error('❌ Failed to connect to MongoDB:', err.message)
    process.exit(1)
  })