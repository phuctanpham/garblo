import type { IImageGenerator } from './IImageGenerator'
import { PollinationsAdapter } from './PollinationsAdapter'
import { HFAdapter } from './HFAdapter'
import { GeminiAdapter } from './GeminiAdapter'

export type ImageGenProvider = 'pollinations' | 'huggingface' | 'gemini'

export function createImageGenerator(
  provider: ImageGenProvider = (process.env.IMAGE_GEN_PROVIDER as ImageGenProvider) ?? 'pollinations',
): IImageGenerator {
  switch (provider) {
    case 'huggingface':
      return new HFAdapter()
    case 'gemini':
      return new GeminiAdapter()
    case 'pollinations':
    default:
      return new PollinationsAdapter()
  }
}
