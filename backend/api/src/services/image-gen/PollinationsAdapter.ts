import axios from 'axios'
import type { IImageGenerator, GenerateOptions } from './IImageGenerator'

export class PollinationsAdapter implements IImageGenerator {
  async generate({
    prompt,
    width = 512,
    height = 768,
  }: GenerateOptions): Promise<Buffer> {
    const encoded = encodeURIComponent(prompt)
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true&model=flux`

    const response = await axios.get<ArrayBuffer>(url, {
      responseType: 'arraybuffer',
      timeout: 60_000,
    })

    return Buffer.from(response.data)
  }
}
