import { Request, Response } from 'express'
import path from 'path'
import { Model } from '../models/Model'
import { createStorage } from '../services/storage/storageFactory'

const storage = createStorage()

export async function uploadModel(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' })
      return
    }

    const ext = path.extname(req.file.originalname) || '.jpg'
    const filename = `model-${Date.now()}${ext}`
    const imageUrl = await storage.save({
      buffer: req.file.buffer,
      filename,
      mimetype: req.file.mimetype,
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
