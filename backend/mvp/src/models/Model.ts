import { Schema, model, Document } from 'mongoose'

export interface IModel extends Document {
  name: string
  imageUrl: string
  createdAt: Date
}

const ModelSchema = new Schema<IModel>(
  {
    name: { type: String, required: true, default: 'My Model' },
    imageUrl: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export const Model = model<IModel>('Model', ModelSchema)
