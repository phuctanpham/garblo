import { Schema, model, Document, Types } from 'mongoose'

export interface IOutfit extends Document {
  modelId: Types.ObjectId
  itemIds: Types.ObjectId[]
  resultImageUrl: string
  provider: string
  createdAt: Date
}

const OutfitSchema = new Schema<IOutfit>(
  {
    modelId: { type: Schema.Types.ObjectId, ref: 'Model', required: true },
    itemIds: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    resultImageUrl: { type: String, required: true },
    provider: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export const Outfit = model<IOutfit>('Outfit', OutfitSchema)
