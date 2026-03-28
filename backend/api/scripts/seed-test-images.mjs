#!/usr/bin/env node
/**
 * backend/api/scripts/seed-test-images.mjs
 * ── What it does ──────────────────────────────────────────────────────────────
 *
 *   1. Resolves config from TWO sources (see "Config resolution" below).
 *   2. Reads storageFixtures[].downloadUrl from backend/api/api-contract.test.json.
 *   3. Downloads each fixture image into backend/api/.seed-images/ (persistent cache).
 *   4. Uploads/copies each image to the right storage destination:
 *        STORAGE_TYPE=local  →  backend/api/public/uploads/   (served by Express)
 *        STORAGE_TYPE=s3     →  R2 / S3 bucket
 *   5. Idempotent: skips anything already present in storage.
 *
 * ── Config resolution ─────────────────────────────────────────────────────────
 *
 *   This script is plain Node.js — wrangler.jsonc runtime vars are NOT injected
 *   automatically. Config is merged from two files in order (last wins):
 *
 *     [1] backend/api/wrangler.jsonc   → non-secret vars (STORAGE_TYPE, S3_BUCKET,
 *                                         S3_REGION, S3_ENDPOINT, IMAGE_GEN_PROVIDER)
 *     [2] backend/api/.env             → overrides + secrets (S3_ACCESS_KEY,
 *                                         S3_SECRET_KEY, MONGODB_URI, PORT, …)
 *
 *   So in your .env files:
 *
 *     VPS / local dev (.env):
 *       STORAGE_TYPE=local          ← overrides wrangler.jsonc STORAGE_TYPE=s3
 *
 *     Cloudflare / R2 dev (.env):
 *       STORAGE_TYPE=s3             ← matches wrangler.jsonc (or just omit, wrangler wins)
 *       S3_ACCESS_KEY=<r2-key>      ← secret — never in wrangler.jsonc
 *       S3_SECRET_KEY=<r2-secret>   ← secret — never in wrangler.jsonc
 *
 * ── Image download URLs ────────────────────────────────────────────────────────
 *
 *   Put your public image URLs in:
 *     backend/api/api-contract.test.json → storageFixtures.items[].downloadUrl
 *                                         → storageFixtures.models[].downloadUrl
 *                                         → storageFixtures.outfits[].downloadUrl
 *
 * ── File placement rule ────────────────────────────────────────────────────────
 *
 *   .seed-images/    ← temp download cache (api project only, .gitignored)
 *   public/uploads/  ← local storage destination (VPS mode, .gitignored)
 *   R2 bucket        ← Cloudflare storage destination
 *   repo             ← NEVER
 */

import {
  createWriteStream, existsSync, mkdirSync,
  readFileSync, writeFileSync,
} from 'fs'
import { readFile }    from 'fs/promises'
import { pipeline }    from 'stream/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname  = dirname(fileURLToPath(import.meta.url))
const API_ROOT   = join(__dirname, '..')
const REPO_ROOT  = join(API_ROOT, '..', '..')

// ── 1. Merge config: wrangler.jsonc vars → .env overrides ─────────────────────

function loadWranglerVars(wranglerPath) {
  if (!existsSync(wranglerPath)) return {}
  try {
    // Strip JS-style comments so JSON.parse can handle wrangler.jsonc
    const raw  = readFileSync(wranglerPath, 'utf8')
    const clean = raw
      .replace(/\/\*[\s\S]*?\*\//g, '')   // block comments
      .replace(/\/\/[^\n]*/g, '')          // line comments
      .replace(/,\s*([}\]])/g, '$1')       // trailing commas
    const parsed = JSON.parse(clean)
    return parsed.vars ?? {}
  } catch {
    return {}
  }
}

function loadDotEnv(envPath) {
  if (!existsSync(envPath)) return {}
  const out = {}
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq < 0) continue
    out[t.slice(0, eq).trim()] = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
  }
  return out
}

// Merge order: wrangler vars (lowest) → .env (highest, contains secrets)
const wranglerVars = loadWranglerVars(join(API_ROOT, 'wrangler.jsonc'))
const dotEnvVars   = loadDotEnv(join(API_ROOT, '.env'))
const cfg          = { ...wranglerVars, ...dotEnvVars }

// Inject merged config into process.env so storage helpers below can read it
for (const [k, v] of Object.entries(cfg)) {
  if (!(k in process.env)) process.env[k] = v
}

const STORAGE_TYPE = (process.env.STORAGE_TYPE ?? 'local').toLowerCase().trim()

// ── 2. Locate fixture file ─────────────────────────────────────────────────────

const FIXTURE_PATH = join(REPO_ROOT, 'backend', 'api', 'api-contract.test.json')

if (!existsSync(FIXTURE_PATH)) {
  console.error(`[seed] fixture not found: ${FIXTURE_PATH}`)
  console.error('  Make sure backend/api/api-contract.test.json exists.')
  process.exit(1)
}

const { storageFixtures } = JSON.parse(readFileSync(FIXTURE_PATH, 'utf8'))
const allFixtures = [
  ...storageFixtures.items,
  ...storageFixtures.models,
  ...storageFixtures.outfits,
]

// ── 3. Temp download cache ─────────────────────────────────────────────────────

const SEED_DIR = join(API_ROOT, '.seed-images')
if (!existsSync(SEED_DIR)) mkdirSync(SEED_DIR, { recursive: true })

// ── 4. Download helper (with offline fallback) ────────────────────────────────

const FALLBACK_JPEG = Buffer.from(
  'ffd8ffe000104a46494600010100000100010000' +
  'ffd9',
  'hex'
)

async function downloadFile(url, destPath) {
  if (existsSync(destPath)) return false
  try {
    console.log(`  ↓ fetch   ${url}`)
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    await pipeline(res.body, createWriteStream(destPath))
    return true
  } catch {
    writeFileSync(destPath, FALLBACK_JPEG)
    console.warn(`  ⚠ offline — synthetic JPEG fallback written`)
    return true
  }
}

// ── 5. Storage adapters ───────────────────────────────────────────────────────
//
// Mirrors storageFactory.ts / LocalStorageAdapter.ts / S3StorageAdapter.ts
// in plain JS so no build step is needed.

// VPS mode: mirrors LocalStorageAdapter constructor default
//   process.cwd()/public/uploads/   when running from backend/api/
const LOCAL_UPLOAD_DIR = join(API_ROOT, 'public', 'uploads')

async function saveToLocal(buffer, filename) {
  if (!existsSync(LOCAL_UPLOAD_DIR)) mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true })
  const dest = join(LOCAL_UPLOAD_DIR, filename)
  if (existsSync(dest)) {
    console.log(`  ✓ exists  public/uploads/${filename}`)
    return `/uploads/${filename}`
  }
  writeFileSync(dest, buffer)
  console.log(`  ✓ saved   public/uploads/${filename}`)
  return `/uploads/${filename}`
}

async function saveToS3(buffer, filename, mimeType) {
  const { S3Client, PutObjectCommand, HeadObjectCommand } = await import('@aws-sdk/client-s3')

  const bucket          = process.env.S3_BUCKET?.trim()
  const region          = process.env.S3_REGION?.trim() || 'auto'
  const accessKeyId     = process.env.S3_ACCESS_KEY?.trim()
  const secretAccessKey = process.env.S3_SECRET_KEY?.trim()
  const endpoint        = process.env.S3_ENDPOINT?.trim() || undefined

  if (!bucket || !accessKeyId || !secretAccessKey) {
    console.error(
      '\n[seed] R2/S3 credentials incomplete.\n' +
      '  wrangler.jsonc already has: STORAGE_TYPE, S3_BUCKET, S3_REGION, S3_ENDPOINT\n' +
      '  Add these secrets to backend/api/.env:\n' +
      '    S3_ACCESS_KEY=<your-r2-access-key-id>\n' +
      '    S3_SECRET_KEY=<your-r2-secret-access-key>\n'
    )
    process.exit(1)
  }

  const client = new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
    ...(endpoint && { endpoint, forcePathStyle: true }),
  })

  const key = `uploads/${filename}`

  // Idempotency: skip if already in bucket
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    const provider = endpoint?.includes('r2.cloudflarestorage') ? 'R2' : 'S3'
    console.log(`  ✓ exists  ${provider}://${bucket}/${key}`)
    return `/uploads/${filename}`
  } catch { /* not found — upload below */ }

  await client.send(new PutObjectCommand({
    Bucket      : bucket,
    Key         : key,
    Body        : buffer,
    ContentType : mimeType,
  }))

  const provider = endpoint?.includes('r2.cloudflarestorage') ? 'R2' : 'S3'
  console.log(`  ✓ uploaded ${provider}://${bucket}/${key}`)
  return `/uploads/${filename}`
}

async function saveToStorage(buffer, filename, mimeType) {
  if (STORAGE_TYPE === 's3') return saveToS3(buffer, filename, mimeType)
  return saveToLocal(buffer, filename)
}

// ── 6. Main ───────────────────────────────────────────────────────────────────

console.log(`\n[seed-test-images] mode: STORAGE_TYPE=${STORAGE_TYPE}`)
if (STORAGE_TYPE === 's3') {
  const ep = process.env.S3_ENDPOINT ?? '(no endpoint)'
  const bk = process.env.S3_BUCKET   ?? '(no bucket)'
  console.log(`[seed-test-images] target: ${ep} / ${bk}`)
} else {
  console.log(`[seed-test-images] target: ${LOCAL_UPLOAD_DIR}`)
}
console.log(`[seed-test-images] seeding ${allFixtures.length} fixture(s)...\n`)

for (const fixture of allFixtures) {
  console.log(`→ ${fixture.seedFilename}`)
  const localPath = join(SEED_DIR, fixture.seedFilename)
  await downloadFile(fixture.downloadUrl, localPath)
  const buffer = await readFile(localPath)
  await saveToStorage(buffer, fixture.seedFilename, fixture.mimeType)
}

console.log('\n[seed-test-images] Done.\n')