import { Schema, model, Document } from 'mongoose'

export interface IItem extends Document {
  name: string
  category: string
  imageUrl: string
  createdAt: Date
}

const ItemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true, default: 'clothing' },
    imageUrl: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export const Item = model<IItem>('Item', ItemSchema)
