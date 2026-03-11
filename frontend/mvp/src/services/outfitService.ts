import api from './api'
import type { IOutfit } from '../types'

export async function generateOutfit(modelId: string, itemIds: string[]): Promise<IOutfit> {
  const { data } = await api.post<IOutfit>('/api/outfits/generate', { modelId, itemIds })
  return data
}

export async function getOutfits(): Promise<IOutfit[]> {
  const { data } = await api.get<IOutfit[]>('/api/outfits')
  return data
}
