import { Request, Response } from 'express'
import path from 'path'
import { Item } from '../models/Item'
import { createStorage } from '../services/storage/storageFactory'
import { ALLOWED_IMAGE_MIME_TYPES, ALLOWED_IMAGE_EXTENSIONS } from '../config/fileValidation'

const storage = createStorage()

export async function uploadItem(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' })
      return
    }

    if (!ALLOWED_IMAGE_MIME_TYPES.includes(req.file.mimetype)) {
      res.status(400).json({ error: 'Only image files are allowed (jpeg, png, webp, gif)' })
      return
    }

    const ext = path.extname(req.file.originalname).toLowerCase()
    if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
      res.status(400).json({ error: 'Only image files are allowed (jpeg, png, webp, gif)' })
      return
    }

    const filename = `item-${Date.now()}${ext}`
    const imageUrl = await storage.save({
      buffer: req.file.buffer,
      filename,
      mimetype: req.file.mimetype,
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
