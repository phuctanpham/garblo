import api from './api'
import type { IItem } from '../types'

export async function getItems(): Promise<IItem[]> {
  const { data } = await api.get<IItem[]>('/api/items')
  return data
}

export async function uploadItem(file: File, name?: string, category?: string): Promise<IItem> {
  const form = new FormData()
  form.append('image', file)
  if (name) form.append('name', name)
  if (category) form.append('category', category)

  const { data } = await api.post<IItem>('/api/items', form)
  return data
}
