import axios from 'axios'
import type { IImageGenerator, GenerateOptions } from './IImageGenerator'

// Uses Gemini image generation via generateContent API
// Model can be overridden via GEMINI_MODEL env var (default: gemini-2.0-flash-exp-image-generation)
export class GeminiAdapter implements IImageGenerator {
  private readonly apiKey: string
  private readonly model: string

  constructor(
    apiKey = process.env.GEMINI_API_KEY ?? '',
    model = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash-exp-image-generation',
  ) {
    this.apiKey = apiKey
    this.model = model

    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is required for GeminiAdapter but was not provided.')
    }
  }

  async generate({ prompt }: GenerateOptions): Promise<Buffer> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`

    const response = await axios.post<{
      candidates: Array<{
        content: { parts: Array<{ inlineData?: { data: string; mimeType: string }; text?: string }> }
      }>
    }>(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 120_000,
      },
    )

    if (
      !response.data ||
      !Array.isArray(response.data.candidates) ||
      response.data.candidates.length === 0
    ) {
      throw new Error('Gemini API returned no candidates or an unexpected response shape')
    }

    const parts = response.data.candidates?.[0]?.content?.parts ?? []
    const imagePart = parts.find((p) => p.inlineData)
    if (!imagePart?.inlineData) {
      throw new Error('Gemini returned no image in response')
    }

    return Buffer.from(imagePart.inlineData.data, 'base64')
  }
}
