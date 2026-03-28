/**
 * API Contract Tests — Post-build validation
 *
 * Covers every route suffix driven by VITE_API_URL:
 *   GET  /api/items
 *   POST /api/items
 *   GET  /api/models
 *   POST /api/models
 *   POST /api/outfits/generate
 *   GET  /api/outfits
 *   GET  /healthcheck
 *   GET  /uploads/:filename  (via resolveImageUrl)
 *
 * Mock data is loaded from api-contract.test.json (single source of truth).
 *
 * Upload File objects use real bytes downloaded by scripts/download-test-images.mjs
 * into .test-images/ at postbuild time.  Invalid/oversized files are generated
 * synthetically (no download needed).  No file is deleted after tests —
 * .test-images/ acts as a persistent cache between runs.
 *
 * Image placement:
 *   .test-images/          <- mvp only  (upload inputs for POST tests)
 *   R2 / VPS disk          <- api only  (served by GET endpoints, seeded by
 *                                         backend/api/scripts/seed-test-images.mjs)
 *   repo                   <- NEVER
 */

import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

import type { IItem, IModel, IOutfit } from '../../types'



// ─── Load fixture data ────────────────────────────────────────────────────────

const FIXTURE_PATH = join(process.cwd(), 'api-contract.test.json')
const FIXTURES     = JSON.parse(readFileSync(FIXTURE_PATH, 'utf8'))

const { items: MOCK_ITEMS, models: MOCK_MODELS, outfits: MOCK_OUTFITS } =
  FIXTURES.mockData as {
    items  : IItem[]
    models : IModel[]
    outfits: IOutfit[]
  }

const MOCK_OUTFIT = MOCK_OUTFITS[0]
const { storageFixtures } = FIXTURES

const TEST_IMG_DIR = join(process.cwd(), '.test-images')

// ─── Mock the shared axios instance ──────────────────────────────────────────

vi.mock('../api', () => {
  const get  = vi.fn()
  const post = vi.fn()
  return {
    default: { get, post },
    API_BASE: 'http://localhost:3001',
    resolveImageUrl: (path: string): string => {
      if (!path) return ''
      if (path.startsWith('http')) return path
      return `http://localhost:3001${path}`
    },
  }
})

import api, { resolveImageUrl } from '../api'
import { getItems, uploadItem }       from '../itemService'
import { getModels, uploadModel }     from '../modelService'
import { generateOutfit, getOutfits } from '../outfitService'

const mockGet  = vi.mocked(api.get)
const mockPost = vi.mocked(api.post)

// ─── Real File factories (built from downloaded images) ───────────────────────

type FileFactory = () => File

let itemJpeg  : FileFactory
let itemPng   : FileFactory
let itemWebp  : FileFactory
let modelJpeg : FileFactory
let modelPng  : FileFactory
let modelWebp : FileFactory
let modelGif  : FileFactory

// Synthetic invalid files — always available from .test-images/
const invalidPdf    = () => new File([readFileSync(join(TEST_IMG_DIR, 'test-invalid.pdf'))],         'resume.pdf',     { type: 'application/pdf' })
const invalidCsv    = () => new File([readFileSync(join(TEST_IMG_DIR, 'test-invalid.csv'))],         'data.csv',       { type: 'text/csv' })
const invalidBmp    = () => new File([readFileSync(join(TEST_IMG_DIR, 'test-invalid.bmp'))],         'model.bmp',      { type: 'image/bmp' })
const oversizedItem = () => new File([readFileSync(join(TEST_IMG_DIR, 'test-oversized-item.jpg'))],  'huge-item.jpg',  { type: 'image/jpeg' })
const oversizedMdl  = () => new File([readFileSync(join(TEST_IMG_DIR, 'test-oversized-model.jpg'))], 'huge-model.jpg', { type: 'image/jpeg' })

beforeAll(() => {
  if (!existsSync(TEST_IMG_DIR)) {
    throw new Error(
      `[api-contract] .test-images/ directory not found.\n` +
      `  Run:  pnpm --filter mvp build\n` +
      `  Or:   node scripts/download-test-images.mjs  (from frontend/mvp/)`
    )
  }

  function makeFactory(filename: string, mime: string): FileFactory {
    const path = join(TEST_IMG_DIR, filename)
    if (!existsSync(path)) {
      throw new Error(
        `[api-contract] Missing test image: ${filename}\n` +
        `  Delete .test-images/ and rerun:  pnpm --filter mvp build`
      )
    }
    const bytes = readFileSync(path)
    return () => new File([bytes], filename, { type: mime })
  }

  itemJpeg  = makeFactory('test-item-jpeg.jpg',  'image/jpeg')
  itemPng   = makeFactory('test-item-png.png',   'image/png')
  itemWebp  = makeFactory('test-item-webp.webp', 'image/webp')
  modelJpeg = makeFactory('test-model-jpeg.jpg', 'image/jpeg')
  modelPng  = makeFactory('test-model-png.png',  'image/png')
  modelWebp = makeFactory('test-model-webp.webp','image/webp')
  modelGif  = makeFactory('test-model-gif.gif',  'image/gif')
})

// ─── Runtime shape validators ─────────────────────────────────────────────────

function assertItem(obj: unknown, label = ''): void {
  const o = obj as Record<string, unknown>
  expect(typeof o._id,       `${label} _id`).toBe('string')
  expect(typeof o.name,      `${label} name`).toBe('string')
  expect(typeof o.category,  `${label} category`).toBe('string')
  expect(typeof o.imageUrl,  `${label} imageUrl`).toBe('string')
  expect(typeof o.createdAt, `${label} createdAt`).toBe('string')
  expect('password' in o, `${label} no password`).toBe(false)
  expect('__v' in o,      `${label} no __v`).toBe(false)
}

function assertModel(obj: unknown, label = ''): void {
  const o = obj as Record<string, unknown>
  expect(typeof o._id,       `${label} _id`).toBe('string')
  expect(typeof o.name,      `${label} name`).toBe('string')
  expect(typeof o.imageUrl,  `${label} imageUrl`).toBe('string')
  expect(typeof o.createdAt, `${label} createdAt`).toBe('string')
}

function assertOutfit(obj: unknown, label = ''): void {
  const o = obj as Record<string, unknown>
  expect(typeof o._id,             `${label} _id`).toBe('string')
  expect(typeof o.modelId,         `${label} modelId`).toBe('string')
  expect(Array.isArray(o.itemIds), `${label} itemIds is array`).toBe(true)
  expect(typeof o.resultImageUrl,  `${label} resultImageUrl`).toBe('string')
  expect(typeof o.provider,        `${label} provider`).toBe('string')
  expect(typeof o.createdAt,       `${label} createdAt`).toBe('string')
}

function assertErrorBody(obj: unknown, label = ''): void {
  const o = obj as Record<string, unknown>
  expect(typeof o.error,                  `${label} error message`).toBe('string')
  expect((o.error as string).length > 0,  `${label} error not empty`).toBe(true)
}

interface MockAxiosError extends Error {
  isAxiosError: boolean
  response: { status: number; data: unknown }
}

function axiosError(status: number, data: unknown): MockAxiosError {
  const err = new Error(`Request failed with status code ${status}`) as MockAxiosError
  err.isAxiosError = true
  err.response     = { status, data }
  return err
}

beforeEach(() => { vi.clearAllMocks() })

// ═════════════════════════════════════════════════════════════════════════════
// GET /api/items
// ═════════════════════════════════════════════════════════════════════════════

describe('[GET /api/items]', () => {
  it('✅ expected: calls correct endpoint', async () => {
    mockGet.mockResolvedValueOnce({ data: MOCK_ITEMS })
    await getItems()
    expect(mockGet).toHaveBeenCalledOnce()
    expect(mockGet).toHaveBeenCalledWith('/api/items')
  })

  it('✅ expected: returns IItem[] — each element has correct shape', async () => {
    mockGet.mockResolvedValueOnce({ data: MOCK_ITEMS })
    const result = await getItems()
    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(MOCK_ITEMS.length)
    result.forEach((item, i) => assertItem(item, `items[${i}]`))
  })

  it('✅ expected: returns empty array when wardrobe has no items', async () => {
    mockGet.mockResolvedValueOnce({ data: [] })
    expect(await getItems()).toEqual([])
  })

  it('✅ expected: imageUrl paths are relative or absolute (routable via resolveImageUrl)', async () => {
    mockGet.mockResolvedValueOnce({ data: MOCK_ITEMS })
    const result = await getItems()
    result.forEach((item) => {
      const valid = item.imageUrl.startsWith('/') || item.imageUrl.startsWith('http')
      expect(valid, `imageUrl "${item.imageUrl}" is routable`).toBe(true)
    })
  })

  it('❌ unexpected: 500 internal error — rejects with AxiosError', async () => {
    const errData = { error: 'Internal server error' }
    mockGet.mockRejectedValueOnce(axiosError(500, errData))
    await expect(getItems()).rejects.toMatchObject({ response: { status: 500, data: errData } })
    assertErrorBody(errData)
  })

  it('❌ unexpected: non-array body does not satisfy IItem[]', async () => {
    mockGet.mockResolvedValueOnce({ data: { error: 'wrong shape' } })
    const result = await getItems()
    expect(Array.isArray(result)).toBe(false)
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// POST /api/items
// ═════════════════════════════════════════════════════════════════════════════

describe('[POST /api/items]', () => {
  it('✅ expected: calls correct endpoint with FormData', async () => {
    mockPost.mockResolvedValueOnce({ data: MOCK_ITEMS[0], status: 201 })
    await uploadItem(itemJpeg(), 'Blue Denim Jacket', 'outerwear')
    expect(mockPost).toHaveBeenCalledWith('/api/items', expect.any(FormData))
  })

  it('✅ expected: returns IItem (201) with correct shape', async () => {
    mockPost.mockResolvedValueOnce({ data: MOCK_ITEMS[0], status: 201 })
    const result = await uploadItem(itemJpeg(), 'Blue Denim Jacket', 'outerwear')
    assertItem(result)
    expect(result.name).toBe('Blue Denim Jacket')
    expect(result.category).toBe('outerwear')
  })

  it('✅ expected: name and category appended to FormData when provided', async () => {
    mockPost.mockResolvedValueOnce({ data: MOCK_ITEMS[0], status: 201 })
    await uploadItem(itemJpeg(), 'Jacket', 'outerwear')
    const [, formData] = mockPost.mock.calls[0] as [string, FormData]
    expect(formData.has('image')).toBe(true)
    expect(formData.has('name')).toBe(true)
    expect(formData.has('category')).toBe(true)
  })

  it('✅ expected: optional name/category NOT appended when omitted', async () => {
    mockPost.mockResolvedValueOnce({ data: MOCK_ITEMS[0], status: 201 })
    await uploadItem(itemJpeg())
    const [, formData] = mockPost.mock.calls[0] as [string, FormData]
    expect(formData.has('image')).toBe(true)
    expect(formData.has('name')).toBe(false)
    expect(formData.has('category')).toBe(false)
  })

  it('✅ expected: image/png accepted', async () => {
    mockPost.mockResolvedValueOnce({ data: MOCK_ITEMS[1], status: 201 })
    assertItem(await uploadItem(itemPng()))
  })

  it('✅ expected: image/webp accepted', async () => {
    mockPost.mockResolvedValueOnce({ data: MOCK_ITEMS[0], status: 201 })
    assertItem(await uploadItem(itemWebp()))
  })

  it('❌ unexpected: no file uploaded → 400 "No file uploaded"', async () => {
    const errData = { error: 'No file uploaded' }
    mockPost.mockRejectedValueOnce(axiosError(400, errData))
    await expect(uploadItem(itemJpeg())).rejects.toMatchObject({ response: { status: 400, data: errData } })
    assertErrorBody(errData, '[no file]')
  })

  it('❌ unexpected: unsupported mime type (PDF) → 400 "Unsupported file type"', async () => {
    const errData = { error: 'Unsupported file type' }
    mockPost.mockRejectedValueOnce(axiosError(400, errData))
    await expect(uploadItem(invalidPdf())).rejects.toMatchObject({ response: { status: 400, data: errData } })
    assertErrorBody(errData, '[bad mime]')
  })

  it('❌ unexpected: file exceeds 5 MB → 413 multer size limit', async () => {
    mockPost.mockRejectedValueOnce(axiosError(413, { error: 'File too large' }))
    await expect(uploadItem(oversizedItem())).rejects.toMatchObject({ response: { status: 413 } })
  })

  it('❌ unexpected: 500 storage failure — error propagates', async () => {
    mockPost.mockRejectedValueOnce(axiosError(500, { error: 'Storage write failed' }))
    await expect(uploadItem(itemJpeg())).rejects.toMatchObject({ response: { status: 500 } })
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// GET /api/models
// ═════════════════════════════════════════════════════════════════════════════

describe('[GET /api/models]', () => {
  it('✅ expected: calls correct endpoint', async () => {
    mockGet.mockResolvedValueOnce({ data: MOCK_MODELS })
    await getModels()
    expect(mockGet).toHaveBeenCalledWith('/api/models')
  })

  it('✅ expected: returns IModel[] — each element has correct shape', async () => {
    mockGet.mockResolvedValueOnce({ data: MOCK_MODELS })
    const result = await getModels()
    expect(Array.isArray(result)).toBe(true)
    result.forEach((m, i) => assertModel(m, `models[${i}]`))
  })

  it('✅ expected: returns empty array when no models exist', async () => {
    mockGet.mockResolvedValueOnce({ data: [] })
    expect(await getModels()).toEqual([])
  })

  it('❌ unexpected: 500 DB error — rejects', async () => {
    mockGet.mockRejectedValueOnce(axiosError(500, { error: 'DB timeout' }))
    await expect(getModels()).rejects.toMatchObject({ response: { status: 500 } })
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// POST /api/models
// ═════════════════════════════════════════════════════════════════════════════

describe('[POST /api/models]', () => {
  it('✅ expected: calls correct endpoint with FormData', async () => {
    mockPost.mockResolvedValueOnce({ data: MOCK_MODELS[0], status: 201 })
    await uploadModel(modelJpeg(), 'Summer Model')
    expect(mockPost).toHaveBeenCalledWith('/api/models', expect.any(FormData))
  })

  it('✅ expected: returns IModel (201) with correct shape', async () => {
    mockPost.mockResolvedValueOnce({ data: MOCK_MODELS[0], status: 201 })
    assertModel(await uploadModel(modelJpeg(), 'Summer Model'))
  })

  it('✅ expected: optional name NOT appended when omitted', async () => {
    mockPost.mockResolvedValueOnce({ data: MOCK_MODELS[0], status: 201 })
    await uploadModel(modelJpeg())
    const [, formData] = mockPost.mock.calls[0] as [string, FormData]
    expect(formData.has('image')).toBe(true)
    expect(formData.has('name')).toBe(false)
  })

  it('✅ expected: image/png accepted', async () => {
    mockPost.mockResolvedValueOnce({ data: MOCK_MODELS[1], status: 201 })
    assertModel(await uploadModel(modelPng()))
  })

  it('✅ expected: image/webp accepted', async () => {
    mockPost.mockResolvedValueOnce({ data: MOCK_MODELS[0], status: 201 })
    assertModel(await uploadModel(modelWebp()))
  })

  it('✅ expected: image/gif accepted', async () => {
    mockPost.mockResolvedValueOnce({ data: MOCK_MODELS[0], status: 201 })
    assertModel(await uploadModel(modelGif()))
  })

  it('❌ unexpected: no file → 400 "No file uploaded"', async () => {
    const errData = { error: 'No file uploaded' }
    mockPost.mockRejectedValueOnce(axiosError(400, errData))
    await expect(uploadModel(modelJpeg())).rejects.toMatchObject({ response: { status: 400, data: errData } })
    assertErrorBody(errData)
  })

  it('❌ unexpected: non-image mime type (text/csv) → 400 "Only image uploads are allowed"', async () => {
    const errData = { error: 'Only image uploads are allowed' }
    mockPost.mockRejectedValueOnce(axiosError(400, errData))
    await expect(uploadModel(invalidCsv())).rejects.toMatchObject({ response: { status: 400, data: errData } })
    assertErrorBody(errData)
  })

  it('❌ unexpected: image mime but disallowed extension (.bmp) → 400 "Unsupported image file extension"', async () => {
    const errData = { error: 'Unsupported image file extension' }
    mockPost.mockRejectedValueOnce(axiosError(400, errData))
    await expect(uploadModel(invalidBmp())).rejects.toMatchObject({ response: { status: 400, data: errData } })
    assertErrorBody(errData)
  })

  it('❌ unexpected: file > 5 MB → 413 "Uploaded file is too large"', async () => {
    const errData = { error: 'Uploaded file is too large' }
    mockPost.mockRejectedValueOnce(axiosError(413, errData))
    await expect(uploadModel(oversizedMdl())).rejects.toMatchObject({ response: { status: 413, data: errData } })
    assertErrorBody(errData)
  })

  it('❌ unexpected: 500 storage failure — propagates', async () => {
    mockPost.mockRejectedValueOnce(axiosError(500, { error: 'S3 write error' }))
    await expect(uploadModel(modelJpeg())).rejects.toMatchObject({ response: { status: 500 } })
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// POST /api/outfits/generate
// ═════════════════════════════════════════════════════════════════════════════

describe('[POST /api/outfits/generate]', () => {
  const validModelId = MOCK_OUTFIT.modelId
  const validItemIds = MOCK_OUTFIT.itemIds

  it('✅ expected: calls correct endpoint with JSON body', async () => {
    mockPost.mockResolvedValueOnce({ data: MOCK_OUTFIT, status: 201 })
    await generateOutfit(validModelId, validItemIds)
    expect(mockPost).toHaveBeenCalledWith('/api/outfits/generate', { modelId: validModelId, itemIds: validItemIds })
  })

  it('✅ expected: returns IOutfit (201) with correct shape', async () => {
    mockPost.mockResolvedValueOnce({ data: MOCK_OUTFIT, status: 201 })
    assertOutfit(await generateOutfit(validModelId, validItemIds))
  })

  it('✅ expected: resultImageUrl is a routable path', async () => {
    mockPost.mockResolvedValueOnce({ data: MOCK_OUTFIT, status: 201 })
    const result = await generateOutfit(validModelId, validItemIds)
    const valid = result.resultImageUrl.startsWith('/') || result.resultImageUrl.startsWith('http')
    expect(valid).toBe(true)
  })

  it('✅ expected: provider is one of the known values', async () => {
    mockPost.mockResolvedValueOnce({ data: MOCK_OUTFIT, status: 201 })
    const result = await generateOutfit(validModelId, validItemIds)
    expect(['pollinations', 'gemini', 'hf']).toContain(result.provider)
  })

  it('✅ expected: itemIds length matches submitted ids', async () => {
    mockPost.mockResolvedValueOnce({ data: MOCK_OUTFIT, status: 201 })
    const result = await generateOutfit(validModelId, validItemIds)
    expect(result.itemIds).toHaveLength(validItemIds.length)
  })

  it('❌ unexpected: missing modelId → 400 "modelId and itemIds[] are required"', async () => {
    const errData = { error: 'modelId and itemIds[] are required' }
    mockPost.mockRejectedValueOnce(axiosError(400, errData))
    await expect(generateOutfit('', validItemIds)).rejects.toMatchObject({ response: { status: 400, data: errData } })
    assertErrorBody(errData)
  })

  it('❌ unexpected: empty itemIds array → 400 "modelId and itemIds[] are required"', async () => {
    const errData = { error: 'modelId and itemIds[] are required' }
    mockPost.mockRejectedValueOnce(axiosError(400, errData))
    await expect(generateOutfit(validModelId, [])).rejects.toMatchObject({ response: { status: 400 } })
  })

  it('❌ unexpected: invalid modelId → 400 "Invalid modelId"', async () => {
    const errData = { error: 'Invalid modelId' }
    mockPost.mockRejectedValueOnce(axiosError(400, errData))
    await expect(generateOutfit('not-an-objectid', validItemIds)).rejects.toMatchObject({ response: { status: 400, data: errData } })
  })

  it('❌ unexpected: invalid itemId in array → 400 "Invalid itemId: bad-id"', async () => {
    const errData = { error: 'Invalid itemId: bad-id' }
    mockPost.mockRejectedValueOnce(axiosError(400, errData))
    await expect(generateOutfit(validModelId, ['bad-id'])).rejects.toMatchObject({ response: { status: 400, data: errData } })
  })

  it('❌ unexpected: model not found → 404 "Model not found"', async () => {
    const errData = { error: 'Model not found' }
    mockPost.mockRejectedValueOnce(axiosError(404, errData))
    await expect(generateOutfit('64b2f2b3e5c1d83e4g9b9999', validItemIds)).rejects.toMatchObject({ response: { status: 404, data: errData } })
  })

  it('❌ unexpected: no items found → 404 "No items found"', async () => {
    const errData = { error: 'No items found' }
    mockPost.mockRejectedValueOnce(axiosError(404, errData))
    await expect(generateOutfit(validModelId, ['64b1f1a2e4b0c72d3f8a9999'])).rejects.toMatchObject({ response: { status: 404, data: errData } })
  })

  it('❌ unexpected: partial items missing → 404 "One or more items not found"', async () => {
    const errData = { error: 'One or more items not found' }
    mockPost.mockRejectedValueOnce(axiosError(404, errData))
    await expect(generateOutfit(validModelId, [...validItemIds, '64b1f1a2e4b0c72d3f8a9999'])).rejects.toMatchObject({ response: { status: 404, data: errData } })
  })

  it('❌ unexpected: image generation failure → 500', async () => {
    mockPost.mockRejectedValueOnce(axiosError(500, { error: 'Image generation timed out' }))
    await expect(generateOutfit(validModelId, validItemIds)).rejects.toMatchObject({ response: { status: 500 } })
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// GET /api/outfits
// ═════════════════════════════════════════════════════════════════════════════

describe('[GET /api/outfits]', () => {
  it('✅ expected: calls correct endpoint', async () => {
    mockGet.mockResolvedValueOnce({ data: [MOCK_OUTFIT] })
    await getOutfits()
    expect(mockGet).toHaveBeenCalledWith('/api/outfits')
  })

  it('✅ expected: returns IOutfit[] — each element has correct shape', async () => {
    mockGet.mockResolvedValueOnce({ data: [MOCK_OUTFIT] })
    const result = await getOutfits()
    expect(Array.isArray(result)).toBe(true)
    result.forEach((o, i) => assertOutfit(o, `outfits[${i}]`))
  })

  it('✅ expected: returns empty array when no outfits exist', async () => {
    mockGet.mockResolvedValueOnce({ data: [] })
    expect(await getOutfits()).toEqual([])
  })

  it('✅ expected: populated modelId and itemIds are serialised strings', async () => {
    mockGet.mockResolvedValueOnce({ data: [MOCK_OUTFIT] })
    const [outfit] = await getOutfits()
    expect(typeof outfit.modelId).toBe('string')
    outfit.itemIds.forEach((id, i) => expect(typeof id, `itemIds[${i}]`).toBe('string'))
  })

  it('❌ unexpected: 500 DB populate failure — rejects', async () => {
    mockGet.mockRejectedValueOnce(axiosError(500, { error: 'Populate failed' }))
    await expect(getOutfits()).rejects.toMatchObject({ response: { status: 500 } })
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// GET /healthcheck
// ═════════════════════════════════════════════════════════════════════════════

const MOCK_HC_OK = {
  status  : 'ok' as const,
  services: { mongodb: { ok: true, message: 'connected' } },
}
const MOCK_HC_DEGRADED = {
  status  : 'degraded' as const,
  services: {
    mongodb: { ok: false, message: 'readyState=0 (not connected)' },
    gemini : { ok: false, message: 'HTTP 403: API key invalid' },
    s3     : { ok: false, message: 'S3 credentials incomplete in .env' },
  },
}

describe('[GET /healthcheck]', () => {
  it('✅ expected: calls correct endpoint', async () => {
    mockGet.mockResolvedValueOnce({ data: MOCK_HC_OK, status: 200 })
    await api.get('/healthcheck')
    expect(mockGet).toHaveBeenCalledWith('/healthcheck')
  })

  it('✅ expected: 200 with status "ok" and services map', async () => {
    mockGet.mockResolvedValueOnce({ data: MOCK_HC_OK, status: 200 })
    const { data } = await api.get('/healthcheck')
    expect(data.status).toBe('ok')
    expect(typeof data.services).toBe('object')
  })

  it('✅ expected: mongodb entry has { ok: true, message: string }', async () => {
    mockGet.mockResolvedValueOnce({ data: MOCK_HC_OK, status: 200 })
    const { data } = await api.get('/healthcheck')
    expect(data.services.mongodb.ok).toBe(true)
    expect(typeof data.services.mongodb.message).toBe('string')
  })

  it('✅ expected: mongodb is always present; gemini / s3 are conditional', async () => {
    mockGet.mockResolvedValueOnce({ data: MOCK_HC_OK, status: 200 })
    const { data } = await api.get('/healthcheck')
    expect('mongodb' in data.services).toBe(true)
  })

  it('❌ unexpected: 503 when any service is degraded', async () => {
    mockGet.mockRejectedValueOnce(axiosError(503, MOCK_HC_DEGRADED))
    await expect(api.get('/healthcheck')).rejects.toMatchObject({
      response: { status: 503, data: expect.objectContaining({ status: 'degraded' }) },
    })
  })

  it('❌ unexpected: degraded services each have ok:false + message', async () => {
    Object.entries(MOCK_HC_DEGRADED.services).forEach(([name, svc]) => {
      expect(typeof svc.ok,      `${name}.ok`).toBe('boolean')
      expect(typeof svc.message, `${name}.message`).toBe('string')
      expect(svc.ok,             `${name} is degraded`).toBe(false)
    })
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// GET /uploads/:filename  →  resolveImageUrl()
// Inputs driven from storageFixtures in api-contract.test.json
// ═════════════════════════════════════════════════════════════════════════════

describe('[GET /uploads/:filename] — resolveImageUrl', () => {
  it('✅ expected: /uploads/item path is prefixed with API_BASE', () => {
    const url = storageFixtures.items[0].expectedImageUrl
    expect(resolveImageUrl(url)).toBe(`http://localhost:3001${url}`)
  })

  it('✅ expected: /uploads/model path is prefixed with API_BASE', () => {
    const url = storageFixtures.models[0].expectedImageUrl
    expect(resolveImageUrl(url)).toBe(`http://localhost:3001${url}`)
  })

  it('✅ expected: /uploads/outfit path is prefixed with API_BASE', () => {
    const url = storageFixtures.outfits[0].expectedImageUrl
    expect(resolveImageUrl(url)).toBe(`http://localhost:3001${url}`)
  })

  it('✅ expected: absolute S3 URL returned unchanged', () => {
    const s3 = 'https://my-bucket.s3.amazonaws.com/uploads/item-abc.png'
    expect(resolveImageUrl(s3)).toBe(s3)
  })

  it('✅ expected: absolute Cloudflare R2 URL returned unchanged', () => {
    const r2 = 'https://pub-abc.r2.dev/item-123.jpg'
    expect(resolveImageUrl(r2)).toBe(r2)
  })

  it('✅ expected: empty string returns empty string (no-image case)', () => {
    expect(resolveImageUrl('')).toBe('')
  })

  it('❌ unexpected: non-/uploads relative path still gets API_BASE prefix', () => {
    expect(resolveImageUrl('/other/asset.jpg')).toBe('http://localhost:3001/other/asset.jpg')
  })

  it('❌ unexpected: http (non-https) absolute URL returned unchanged', () => {
    const insecure = 'http://legacy-cdn.example.com/img.jpg'
    expect(resolveImageUrl(insecure)).toBe(insecure)
  })
})