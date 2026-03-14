import axios from 'axios'
import type { IImageGenerator, GenerateOptions } from './IImageGenerator'

export class HFAdapter implements IImageGenerator {
  private readonly apiKey: string
  private readonly model: string

  constructor(
    apiKey = process.env.HF_API_KEY ?? '',
    model = process.env.HF_MODEL ?? 'stabilityai/stable-diffusion-2',
  ) {
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

    this.apiKey = apiKey
    this.model = model
  }

  async generate({ prompt }: GenerateOptions): Promise<Buffer> {
    if (!this.apiKey || this.apiKey.trim().length === 0) {
      throw new Error(
        'HFAdapter: Hugging Face API key is not configured. Set the HF_API_KEY environment variable or pass an apiKey to HFAdapter.',
      )
    }

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
