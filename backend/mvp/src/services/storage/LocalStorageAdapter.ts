import fs from 'fs'
import path from 'path'
import type { IStorage, SaveOptions } from './IStorage'

export class LocalStorageAdapter implements IStorage {
  private readonly uploadDir: string

  constructor(uploadDir = path.join(process.cwd(), 'public', 'uploads')) {
    this.uploadDir = uploadDir
    fs.mkdirSync(this.uploadDir, { recursive: true })
  }

  async save({ buffer, filename }: SaveOptions): Promise<string> {
    const dest = path.join(this.uploadDir, filename)
<<<<<<< HEAD
<<<<<<< HEAD
    await fs.promises.writeFile(dest, buffer)
=======
    fs.writeFileSync(dest, buffer)
>>>>>>> aae9bf2 (feat(mvp): implement backend MVP with controllers, services, and tests)
=======
    fs.writeFileSync(dest, buffer)
>>>>>>> aae9bf2 (feat(mvp): implement backend MVP with controllers, services, and tests)
    return `/uploads/${filename}`
  }
}
