import type { IStorage } from './IStorage'
import { LocalStorageAdapter } from './LocalStorageAdapter'
import { S3StorageAdapter } from './S3StorageAdapter'

export type StorageProvider = 'local' | 's3'

export function createStorage(
  provider: StorageProvider = (process.env.STORAGE_TYPE as StorageProvider) ??
    'local',
): IStorage {
  switch (provider) {
    case 's3':
      return new S3StorageAdapter()
    case 'local':
    default:
      return new LocalStorageAdapter()
  }
}
