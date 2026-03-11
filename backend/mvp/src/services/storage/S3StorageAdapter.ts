import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import type { IStorage, SaveOptions } from './IStorage'

export class S3StorageAdapter implements IStorage {
  private readonly client: S3Client
  private readonly bucket: string
  private readonly region: string

  constructor(
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fd8b683 (feat(mvp): implement backend MVP with controllers, services, and tests)
    bucket: string | undefined = process.env.S3_BUCKET,
    region: string | undefined = process.env.S3_REGION ?? 'us-east-1',
    accessKeyId: string | undefined = process.env.S3_ACCESS_KEY,
    secretAccessKey: string | undefined = process.env.S3_SECRET_KEY,
  ) {
    const resolvedBucket = bucket?.trim()
    if (!resolvedBucket) {
      throw new Error(
        'S3StorageAdapter configuration error: S3 bucket is not configured. Set S3_BUCKET or pass a bucket name to the constructor.',
      )
    }

    const resolvedRegion = region?.trim()
    if (!resolvedRegion) {
      throw new Error(
        'S3StorageAdapter configuration error: S3 region is not configured. Set S3_REGION or pass a region to the constructor.',
      )
    }

    const resolvedAccessKeyId = accessKeyId?.trim()
    const resolvedSecretAccessKey = secretAccessKey?.trim()
    if (!resolvedAccessKeyId || !resolvedSecretAccessKey) {
      throw new Error(
        'S3StorageAdapter configuration error: S3 credentials are not configured. Set S3_ACCESS_KEY and S3_SECRET_KEY or pass credentials to the constructor.',
      )
    }

    this.bucket = resolvedBucket
    this.region = resolvedRegion
    this.client = new S3Client({
      region: resolvedRegion,
<<<<<<< HEAD
      credentials: { accessKeyId: resolvedAccessKeyId, secretAccessKey: resolvedSecretAccessKey },
=======
=======
>>>>>>> aae9bf2 (feat(mvp): implement backend MVP with controllers, services, and tests)
=======
<<<<<<< HEAD
      credentials: {
        accessKeyId: resolvedAccessKeyId,
        secretAccessKey: resolvedSecretAccessKey,
      },
=======
      credentials: { accessKeyId: resolvedAccessKeyId, secretAccessKey: resolvedSecretAccessKey },
=======
>>>>>>> fd8b683 (feat(mvp): implement backend MVP with controllers, services, and tests)
    bucket = process.env.S3_BUCKET ?? '',
    region = process.env.S3_REGION ?? 'us-east-1',
    accessKeyId = process.env.S3_ACCESS_KEY ?? '',
    secretAccessKey = process.env.S3_SECRET_KEY ?? '',
  ) {
    this.bucket = bucket
    this.region = region
    this.client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> aae9bf2 (feat(mvp): implement backend MVP with controllers, services, and tests)
=======
>>>>>>> aae9bf2 (feat(mvp): implement backend MVP with controllers, services, and tests)
=======
>>>>>>> aae9bf2 (feat(mvp): implement backend MVP with controllers, services, and tests)
>>>>>>> b61a30f (feat(mvp): implement backend MVP with controllers, services, and tests)
>>>>>>> fd8b683 (feat(mvp): implement backend MVP with controllers, services, and tests)
    })
  }

  async save({ buffer, filename, mimetype = 'image/png' }: SaveOptions): Promise<string> {
    const key = `uploads/${filename}`
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
      }),
    )
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`
  }
}
