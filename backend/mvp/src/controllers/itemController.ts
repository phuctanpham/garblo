import { Request, Response } from 'express'
import { Item } from '../models/Item'
import { createStorage } from '../services/storage/storageFactory'

const storage = createStorage()

export async function uploadItem(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' })
      return
    }

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
