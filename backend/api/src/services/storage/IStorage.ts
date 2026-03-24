export interface SaveOptions {
  buffer: Buffer
  filename: string
  mimetype?: string
}

export interface IStorage {
  save(options: SaveOptions): Promise<string>
}
