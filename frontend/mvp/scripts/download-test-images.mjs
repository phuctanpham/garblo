#!/usr/bin/env node
/**
 * frontend/mvp/scripts/download-test-images.mjs
 *
 * Run automatically by the `postbuild` hook:
 *   pnpm --filter mvp build  →  tsc + vite build  →  this script  →  vitest run
 *
 * What it does
 * ─────────────
 *  1. Reads uploadFixtures from api-contract.test.json (single source of truth).
 *  2. Downloads each valid fixture image from its downloadUrl into .test-images/.
 *     Uses a cache-check first — skips the download when the file already exists.
 *     Falls back to minimal valid synthetic bytes on network failure (safe for CI).
 *  3. Generates synthetic invalid/oversized files (no network needed).
 *  4. All files land in  frontend/mvp/.test-images/  (.gitignored).
 *
 * Image placement rule
 * ─────────────────────
 *  ONLY in mvp/.test-images/  →  consumed as File inputs for POST upload tests.
 *  NOT in the repo, NOT in api's project.
 *  The api project seeds its own images (backend/api/scripts/seed-test-images.mjs).
 *
 * Cleanup
 * ────────
 *  Does NOT delete files after tests.  .test-images/ is a persistent cache.
 *  To force a full refresh: rm -rf frontend/mvp/.test-images/
 */

import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { pipeline } from 'stream/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname   = dirname(fileURLToPath(import.meta.url))
const ROOT        = join(__dirname, '..')
const OUT_DIR     = join(ROOT, '.test-images')
const FIXTURE_PATH = join(ROOT, 'api-contract.test.json')

// ── Load fixtures ─────────────────────────────────────────────────────────────

const { uploadFixtures } = JSON.parse(readFileSync(FIXTURE_PATH, 'utf8'))

// ── Ensure output directory ───────────────────────────────────────────────────

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

// ── Minimal synthetic image bytes (valid magic bytes per format) ───────────────
//
// Used as fallback when the network is unavailable (e.g. sandboxed CI).
// The tests are fully mocked — actual pixel content is irrelevant.

const SYNTHETIC_IMAGES = {
  // PNG: magic 8 bytes + minimal IHDR chunk (1x1 greyscale)
  'image/png': Buffer.from(
    '89504e470d0a1a0a0000000d4948445200000001000000010800000000' +
    '3a7e9b550000000a4944415478016360000000020001e221bc330000000049454e44ae426082',
    'hex'
  ),
  // JPEG: SOI + JFIF APP0 marker (no image data, but valid header)
  'image/jpeg': Buffer.from(
    'ffd8ffe000104a464946000101000001000100' +
    '00ffdb004300080606060705060707070608091409' +
    '0c0d0c0d0c1012130f131d1a1a1b1919191f27201d24' +
    '2b2b30303030191f333637332832312e303030' +
    'ffc0000b080001000101011100ffc4001f0000010501' +
    '010101010100000000000000000102030405060708090a0b' +
    'ffda00080101000003f001ffd9',
    'hex'
  ),
  // WebP: RIFF header + WEBP + minimal VP8L chunk (1x1 green pixel)
  'image/webp': Buffer.from(
    '52494646240000005745425056503820180000003001009d012a' +
    '01000100020034250a82320f00fef3ffc0',
    'hex'
  ),
  // GIF89a: 1×1 transparent pixel
  'image/gif': Buffer.from('R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', 'base64'),
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function download(url, destPath, mimeType) {
  if (existsSync(destPath)) {
    console.log(`  ✓ cached  ${destPath.replace(ROOT, '.')}`)
    return
  }
  try {
    console.log(`  ↓ fetch   ${url}`)
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    await pipeline(res.body, createWriteStream(destPath))
    console.log(`  ✓ saved   ${destPath.replace(ROOT, '.')}`)
  } catch (err) {
    // Network unavailable (sandboxed CI, offline dev) — use synthetic fallback
    const fallback = SYNTHETIC_IMAGES[mimeType] ?? SYNTHETIC_IMAGES['image/jpeg']
    writeFileSync(destPath, fallback)
    console.log(`  ⚠ offline — synthetic ${mimeType} fallback written (${fallback.length} bytes)`)
  }
}

// ── Download valid fixtures ───────────────────────────────────────────────────

console.log('\n[download-test-images] Valid upload fixtures:')

for (const fixture of uploadFixtures.valid) {
  const dest = join(OUT_DIR, fixture.localFilename)

  if (fixture.downloadUrl === null) {
    // GIF: always generate the minimal 1×1 transparent GIF (no download)
    if (!existsSync(dest)) {
      writeFileSync(dest, SYNTHETIC_IMAGES['image/gif'])
      console.log(`  ✓ gen 1×1 GIF  ${dest.replace(ROOT, '.')}`)
    } else {
      console.log(`  ✓ cached  ${dest.replace(ROOT, '.')}`)
    }
    continue
  }

  await download(fixture.downloadUrl, dest, fixture.mimeType)
}

// ── Generate synthetic invalid fixtures ──────────────────────────────────────

console.log('\n[download-test-images] Synthetic invalid fixtures:')

const synthetics = [
  { filename: 'test-invalid.pdf',          content: Buffer.from('%PDF-1.4 fake\n%%EOF\n') },
  { filename: 'test-oversized-item.jpg',   content: Buffer.alloc(6 * 1024 * 1024 + 1, 0xff) },
  { filename: 'test-invalid.csv',          content: Buffer.from('a,b\n1,2\n') },
  { filename: 'test-invalid.bmp',          content: Buffer.from('BM\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00') },
  { filename: 'test-oversized-model.jpg',  content: Buffer.alloc(6 * 1024 * 1024 + 1, 0xff) },
]

for (const { filename, content } of synthetics) {
  const dest = join(OUT_DIR, filename)
  if (!existsSync(dest)) {
    writeFileSync(dest, content)
    console.log(`  ✓ gen  ${filename}  (${content.length} bytes)`)
  } else {
    console.log(`  ✓ cached  ${filename}`)
  }
}

console.log('\n[download-test-images] All fixtures ready in .test-images/\n')