import axios from 'axios'
import type { IImageGenerator, GenerateOptions } from './IImageGenerator'

export class HFAdapter implements IImageGenerator {
  private readonly apiKey: string
  private readonly model: string

  constructor(
    apiKey = process.env.HF_API_KEY ?? '',
    model = process.env.HF_MODEL ?? 'stabilityai/stable-diffusion-2',
  ) {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fd8b683 (feat(mvp): implement backend MVP with controllers, services, and tests)
    if (!apiKey || !apiKey.trim()) {
      throw new Error(
        'HFAdapter configuration error: HF_API_KEY (or provided apiKey) must be a non-empty string.',
      )
    }

    if (!model || !model.trim()) {
      throw new Error(
        'HFAdapter configuration error: HF_MODEL (or provided model) must be a non-empty string.',
      )
    }

=======
>>>>>>> aae9bf2 (feat(mvp): implement backend MVP with controllers, services, and tests)
<<<<<<< HEAD
=======
>>>>>>> aae9bf2 (feat(mvp): implement backend MVP with controllers, services, and tests)
=======
>>>>>>> fd8b683 (feat(mvp): implement backend MVP with controllers, services, and tests)
    this.apiKey = apiKey
    this.model = model
  }

  async generate({ prompt }: GenerateOptions): Promise<Buffer> {
    const url = `https://api-inference.huggingface.co/models/${this.model}`

    const response = await axios.post<ArrayBuffer>(
      url,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
        timeout: 120_000,
      },
    )

    return Buffer.from(response.data)
  }
}
