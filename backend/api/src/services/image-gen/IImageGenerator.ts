export interface GenerateOptions {
  prompt: string
  width?: number
  height?: number
}

export interface IImageGenerator {
  generate(options: GenerateOptions): Promise<Buffer>
}
