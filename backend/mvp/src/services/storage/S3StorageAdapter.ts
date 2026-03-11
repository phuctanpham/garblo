import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import type { IStorage, SaveOptions } from './IStorage'

export class S3StorageAdapter implements IStorage {
  private readonly client: S3Client
  private readonly bucket: string
  private readonly region: string

  constructor(
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
