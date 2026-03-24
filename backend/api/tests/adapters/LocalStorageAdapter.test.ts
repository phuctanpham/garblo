import fs from 'fs'
import path from 'path'
import os from 'os'
import { LocalStorageAdapter } from '../../src/services/storage/LocalStorageAdapter'

describe('LocalStorageAdapter', () => {
  let tmpDir: string
  let adapter: LocalStorageAdapter

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'garblo-test-'))
    adapter = new LocalStorageAdapter(tmpDir)
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it('writes the buffer to disk and returns the correct URL path', async () => {
    const buffer = Buffer.from('test-image-content')
    const url = await adapter.save({
      buffer,
      filename: 'test.png',
      mimetype: 'image/png',
    })

    expect(url).toBe('/uploads/test.png')
    const written = fs.readFileSync(path.join(tmpDir, 'test.png'))
    expect(written.equals(buffer)).toBe(true)
  })

  it('creates the upload directory if it does not exist', () => {
    const nestedDir = path.join(tmpDir, 'a', 'b', 'c')
    const newAdapter = new LocalStorageAdapter(nestedDir)
    expect(fs.existsSync(nestedDir)).toBe(true)
    expect(newAdapter).toBeDefined()
  })

  it('overwrites an existing file with new buffer', async () => {
    const first = Buffer.from('first')
    const second = Buffer.from('second')
    await adapter.save({ buffer: first, filename: 'file.png' })
    await adapter.save({ buffer: second, filename: 'file.png' })

    const written = fs.readFileSync(path.join(tmpDir, 'file.png'))
    expect(written.equals(second)).toBe(true)
  })
})
