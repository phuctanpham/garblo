import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { Item } from '../models/Item'
import { Model } from '../models/Model'
import { Outfit } from '../models/Outfit'
import { createImageGenerator } from '../services/image-gen/imageGenFactory'
import { createStorage } from '../services/storage/storageFactory'

const imageGen = createImageGenerator()
const storage = createStorage()
const provider = process.env.IMAGE_GEN_PROVIDER ?? 'pollinations'

export async function generateOutfit(req: Request, res: Response): Promise<void> {
  try {
    const { modelId, itemIds } = req.body as { modelId: string; itemIds: string[] }

    if (!modelId || !Array.isArray(itemIds) || itemIds.length === 0) {
      res.status(400).json({ error: 'modelId and itemIds[] are required' })
      return
    }

    if (!Types.ObjectId.isValid(modelId)) {
      res.status(400).json({ error: 'Invalid modelId' })
      return
    }

    const invalidItemId = itemIds.find((id) => !Types.ObjectId.isValid(id))
    if (invalidItemId) {
      res.status(400).json({ error: `Invalid itemId: ${invalidItemId}` })
      return
    }

    const [model, items] = await Promise.all([
      Model.findById(modelId),
      Item.find({ _id: { $in: itemIds.map((id) => new Types.ObjectId(id)) } }),
    ])

    if (!model) {
      res.status(404).json({ error: 'Model not found' })
      return
    }
    if (items.length === 0) {
      res.status(404).json({ error: 'No items found' })
      return
    }

    const itemNames = items.map((i) => i.name).join(', ')
    const prompt = `A fashion model wearing ${itemNames}. Professional fashion photography, clean white background, full body shot, high quality.`

    const imageBuffer = await imageGen.generate({ prompt, width: 512, height: 768 })

    const filename = `outfit-${Date.now()}.png`
    const resultImageUrl = await storage.save({ buffer: imageBuffer, filename, mimetype: 'image/png' })

    const outfit = await Outfit.create({
      modelId: new Types.ObjectId(modelId),
      itemIds: itemIds.map((id) => new Types.ObjectId(id)),
      resultImageUrl,
      provider,
    })

    res.status(201).json(outfit)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
}

export async function getOutfits(_req: Request, res: Response): Promise<void> {
  try {
    const outfits = await Outfit.find()
      .populate('modelId')
      .populate('itemIds')
      .sort({ createdAt: -1 })
    res.json(outfits)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
}
