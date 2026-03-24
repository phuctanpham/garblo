import axios from 'axios'
import { HFAdapter } from '../../src/services/image-gen/HFAdapter'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('HFAdapter', () => {
  const adapter = new HFAdapter(
    'test-api-key',
    'stabilityai/stable-diffusion-2',
  )
  const fakeBuffer = Buffer.from('fake-image-data')

  beforeEach(() => {
    mockedAxios.post.mockResolvedValue({ data: fakeBuffer.buffer })
  })

  afterEach(() => jest.clearAllMocks())

  it('calls the HF Inference API with correct URL and auth header', async () => {
    await adapter.generate({ prompt: 'a white shirt' })

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2',
      { inputs: 'a white shirt' },
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-api-key',
        }),
        responseType: 'arraybuffer',
      }),
    )
  })

  it('returns a Buffer', async () => {
    const result = await adapter.generate({ prompt: 'black trousers' })
    expect(Buffer.isBuffer(result)).toBe(true)
  })

  it('propagates API errors', async () => {
    mockedAxios.post.mockRejectedValue(new Error('401 Unauthorized'))
    await expect(adapter.generate({ prompt: 'test' })).rejects.toThrow(
      '401 Unauthorized',
    )
  })
})
