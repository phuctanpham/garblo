import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('resolveImageUrl', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns absolute URLs unchanged', async () => {
    const { resolveImageUrl } = await import('./api')
    expect(resolveImageUrl('https://cdn.example.com/img.png')).toBe('https://cdn.example.com/img.png')
  })

  it('returns empty string for empty input', async () => {
    const { resolveImageUrl } = await import('./api')
    expect(resolveImageUrl('')).toBe('')
  })

  it('prepends API_BASE to relative paths', async () => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:3001')
    const { resolveImageUrl } = await import('./api')
    expect(resolveImageUrl('/uploads/img.png')).toBe('http://localhost:3001/uploads/img.png')
  })
})
