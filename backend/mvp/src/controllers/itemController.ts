import { Request, Response } from 'express'
import path from 'path'
import { Item } from '../models/Item'
import { createStorage } from '../services/storage/storageFactory'

const storage = createStorage()

export async function uploadItem(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' })
      return
    }

<<<<<<< HEAD
<<<<<<< HEAD
    const allowedMimeTypes: Record<string, string> = {
      'image/png': '.png',
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/webp': '.webp',
    }

    const mimeType = req.file.mimetype
    const normalizedExt = allowedMimeTypes[mimeType]

    if (!normalizedExt) {
      res.status(400).json({ error: 'Unsupported file type' })
      return
    }

    const filename = `item-${Date.now()}${normalizedExt}`
    const imageUrl = await storage.save({
      buffer: req.file.buffer,
      filename,
      mimetype: mimeType,
=======
=======
>>>>>>> aae9bf2 (feat(mvp): implement backend MVP with controllers, services, and tests)
    const ext = path.extname(req.file.originalname) || '.png'
    const filename = `item-${Date.now()}${ext}`
    const imageUrl = await storage.save({
      buffer: req.file.buffer,
      filename,
      mimetype: req.file.mimetype,
<<<<<<< HEAD
>>>>>>> aae9bf2 (feat(mvp): implement backend MVP with controllers, services, and tests)
=======
>>>>>>> aae9bf2 (feat(mvp): implement backend MVP with controllers, services, and tests)
    })

    const item = await Item.create({
      name: (req.body.name as string) || 'New Item',
      category: (req.body.category as string) || 'clothing',
      imageUrl,
    })

    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
}

export async function getItems(_req: Request, res: Response): Promise<void> {
  try {
    const items = await Item.find().sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
}
