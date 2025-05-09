import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

export const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!
export const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!
export const R2_BUCKET = process.env.R2_BUCKET!
export const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL! // S3 API endpoint, e.g. https://<accountid>.r2.cloudflarestorage.com
export const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN! // e.g. https://pub-<accountid>.r2.dev

if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_ACCOUNT_ID || !R2_PUBLIC_URL || !R2_PUBLIC_DOMAIN) {
  throw new Error('Missing Cloudflare R2 environment variables')
}

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

export async function uploadToR2(file: Buffer | Uint8Array, contentType: string, keyPrefix = 'uploads'): Promise<string> {
  const key = `${keyPrefix}/${uuidv4()}`
  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: 'public-read',
    })
  )
  return getR2Url(key)
}

export function getR2Url(key: string): string {
  // Use the public domain for direct access (no bucket in path)
  return `${R2_PUBLIC_DOMAIN}/${key}`
} 