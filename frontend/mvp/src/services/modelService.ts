import api from './api'
import type { IModel } from '../types'

export async function getModels(): Promise<IModel[]> {
  const { data } = await api.get<IModel[]>('/api/models')
  return data
}

export async function uploadModel(file: File, name?: string): Promise<IModel> {
  const form = new FormData()
  form.append('image', file)
  if (name) form.append('name', name)

  const { data } = await api.post<IModel>('/api/models', form)
  return data
}
