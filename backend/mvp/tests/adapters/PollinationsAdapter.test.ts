import axios from 'axios'
import { PollinationsAdapter } from '../../src/services/image-gen/PollinationsAdapter'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('PollinationsAdapter', () => {
  const adapter = new PollinationsAdapter()
  const fakeBuffer = Buffer.from('fake-image-data')

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: fakeBuffer.buffer })
  })

  afterEach(() => jest.clearAllMocks())

  it('calls the correct Pollinations URL with encoded prompt', async () => {
    await adapter.generate({ prompt: 'a red dress', width: 512, height: 768 })

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('image.pollinations.ai/prompt/'),
      expect.objectContaining({ responseType: 'arraybuffer' }),
    )

    const url: string = mockedAxios.get.mock.calls[0][0] as string
    expect(url).toContain(encodeURIComponent('a red dress'))
    expect(url).toContain('width=512')
    expect(url).toContain('height=768')
    expect(url).toContain('nologo=true')
  })

  it('returns a Buffer', async () => {
    const result = await adapter.generate({ prompt: 'blue jeans' })
    expect(Buffer.isBuffer(result)).toBe(true)
  })

  it('propagates axios errors', async () => {
    mockedAxios.get.mockRejectedValue(new Error('network error'))
    await expect(adapter.generate({ prompt: 'test' })).rejects.toThrow('network error')
  })
})
