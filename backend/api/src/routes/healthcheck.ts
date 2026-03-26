import { Router, Request, Response } from 'express'
import mongoose from 'mongoose'
import axios from 'axios'
import { S3Client, HeadBucketCommand } from '@aws-sdk/client-s3'

const router = Router()

// ── helpers ──────────────────────────────────────────────────────────────────

async function checkMongoDB(): Promise<{ ok: boolean; message: string }> {
  try {
    const state = mongoose.connection.readyState
    if (state === 1) {
      await mongoose.connection.db!.admin().ping()
      return { ok: true, message: 'connected' }
    }
    return { ok: false, message: `readyState=${state} (not connected)` }
  } catch (err) {
    return { ok: false, message: (err as Error).message }
  }
}

async function checkGemini(): Promise<{ ok: boolean; message: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim()
  if (!apiKey) return null

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=1`
    await axios.get(url, { timeout: 8_000 })
    return { ok: true, message: 'reachable' }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      const detail = err.response?.data?.error?.message ?? err.message
      return { ok: false, message: `HTTP ${status ?? 'timeout'}: ${detail}` }
    }
    return { ok: false, message: (err as Error).message }
  }
}

async function checkS3(): Promise<{ ok: boolean; message: string } | null> {
  const storageType = process.env.STORAGE_TYPE?.trim()
  if (storageType !== 's3') return null

  const bucket = process.env.S3_BUCKET?.trim()
  const region = process.env.S3_REGION?.trim() || 'auto'
  const accessKeyId = process.env.S3_ACCESS_KEY?.trim()
  const secretAccessKey = process.env.S3_SECRET_KEY?.trim()
  const endpoint = process.env.S3_ENDPOINT?.trim() || undefined

  if (!bucket || !accessKeyId || !secretAccessKey) {
    return { ok: false, message: 'S3 credentials incomplete in .env' }
  }

  // Remind if using R2 but forgot the endpoint
  if (region === 'auto' && !endpoint) {
    return {
      ok: false,
      message:
        'S3_REGION=auto looks like Cloudflare R2 — please set S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com',
    }
  }

  try {
    const client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
      ...(endpoint && {
        endpoint,
        forcePathStyle: true,
      }),
    })
    await client.send(new HeadBucketCommand({ Bucket: bucket }))
    const provider = endpoint?.includes('r2.cloudflarestorage') ? 'R2' : 'S3'
    return { ok: true, message: `${provider} bucket "${bucket}" accessible` }
  } catch (err) {
    return { ok: false, message: (err as Error).message }
  }
}

// ── route ─────────────────────────────────────────────────────────────────────

router.get('/', async (_req: Request, res: Response) => {
  const [mongodb, gemini, s3] = await Promise.all([
    checkMongoDB(),
    checkGemini(),
    checkS3(),
  ])

  const services: Record<string, { ok: boolean; message: string }> = {
    mongodb,
  }

  if (gemini !== null) services.gemini = gemini
  if (s3 !== null) services.s3 = s3

  const allOk = Object.values(services).every((s) => s.ok)

  res.status(allOk ? 200 : 503).json({
    status: allOk ? 'ok' : 'degraded',
    services,
  })
})

export default router