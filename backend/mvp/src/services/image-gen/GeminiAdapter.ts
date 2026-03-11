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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fd8b683 (feat(mvp): implement backend MVP with controllers, services, and tests)
    const normalizedApiKey = apiKey.trim()
    if (!normalizedApiKey) {
      throw new Error('GEMINI_API_KEY is not configured')
    }

    const normalizedModel = model.trim()
    if (!normalizedModel) {
      throw new Error('GEMINI_MODEL is not configured')
    }

    this.apiKey = normalizedApiKey
    this.model = normalizedModel
=======
    this.apiKey = apiKey
    this.model = model
>>>>>>> aae9bf2 (feat(mvp): implement backend MVP with controllers, services, and tests)
<<<<<<< HEAD
=======
    this.apiKey = apiKey
    this.model = model
>>>>>>> aae9bf2 (feat(mvp): implement backend MVP with controllers, services, and tests)
=======
>>>>>>> fd8b683 (feat(mvp): implement backend MVP with controllers, services, and tests)
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

    const parts = response.data.candidates[0]?.content?.parts ?? []
    const imagePart = parts.find((p) => p.inlineData)
    if (!imagePart?.inlineData) {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fd8b683 (feat(mvp): implement backend MVP with controllers, services, and tests)
      const textPart = parts.find((p) => p.text)
      const detail = textPart?.text ? `: ${textPart.text}` : ''
      throw new Error(`Gemini returned no image in response${detail}`)
=======
      throw new Error('Gemini returned no image in response')
>>>>>>> aae9bf2 (feat(mvp): implement backend MVP with controllers, services, and tests)
<<<<<<< HEAD
=======
      throw new Error('Gemini returned no image in response')
>>>>>>> aae9bf2 (feat(mvp): implement backend MVP with controllers, services, and tests)
=======
      const textPart = parts.find((p) => p.text)
      const detail = textPart?.text ? `: ${textPart.text}` : ''
      throw new Error(`Gemini returned no image in response${detail}`)
>>>>>>> 9614619 (fix: apply all remaining PR review comment fixes)
=======
>>>>>>> fd8b683 (feat(mvp): implement backend MVP with controllers, services, and tests)
    }

    return Buffer.from(imagePart.inlineData.data, 'base64')
  }
}
