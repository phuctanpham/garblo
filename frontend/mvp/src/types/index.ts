export interface IItem {
  _id: string
  name: string
  category: string
  imageUrl: string
  createdAt: string
}

export interface IModel {
  _id: string
  name: string
  imageUrl: string
  createdAt: string
}

export interface IOutfit {
  _id: string
  modelId: string
  itemIds: string[]
  resultImageUrl: string
  provider: string
  createdAt: string
}
