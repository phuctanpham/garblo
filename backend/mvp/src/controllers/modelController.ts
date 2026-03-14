import { Request, Response } from 'express'
import path from 'path'
import { Model } from '../models/Model'
import { createStorage } from '../services/storage/storageFactory'

const storage = createStorage()

const ALLOWED_MIME_TYPES = new Set<string>([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
])

const ALLOWED_EXTENSIONS = new Set<string>([
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
])

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export async function uploadModel(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' })
      return
    }

    const { mimetype, originalname, size } = req.file
    const ext = (path.extname(originalname) || '.jpg').toLowerCase()

    if (!ALLOWED_MIME_TYPES.has(mimetype)) {
      res.status(400).json({ error: 'Only image uploads are allowed' })
      return
    }

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      res.status(400).json({ error: 'Unsupported image file extension' })
      return
    }

    if (typeof size === 'number' && size > MAX_FILE_SIZE_BYTES) {
      res.status(413).json({ error: 'Uploaded file is too large' })
      return
    }

    const filename = `model-${Date.now()}${ext}`
    const imageUrl = await storage.save({
      buffer: req.file.buffer,
      filename,
      mimetype,
    })

    const model = await Model.create({
      name: (req.body.name as string) || 'My Model',
      imageUrl,
    })

    res.status(201).json(model)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
}

export async function getModels(_req: Request, res: Response): Promise<void> {
  try {
    const models = await Model.find().sort({ createdAt: -1 })
    res.json(models)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
}
