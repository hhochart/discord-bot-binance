import * as crypto from 'crypto'

const algorithm = 'aes-256-ctr'
const secret = crypto
  .createHash('sha256')
  .update(String(process.env.CRYPTO_SECRET_KEY))
  .digest('base64')
  .substr(0, 32)

export interface EncryptPayload {
  content: string
}

export interface EncryptResponse {
  encryptedContent: string
  iv: string
}

type DecryptPayload = EncryptResponse
type DecryptResponse = EncryptPayload

export function encrypt(payload: EncryptPayload): EncryptResponse {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, secret, iv)

  let encrypted = Buffer.concat([
    cipher.update(payload.content),
    cipher.final(),
  ])

  return {
    encryptedContent: encrypted.toString('hex'),
    iv: iv.toString('hex'),
  }
}

export function decrypt(payload: DecryptPayload): DecryptResponse {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secret,
    Buffer.from(payload.iv, 'hex'),
  )

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.encryptedContent, 'hex')),
    decipher.final(),
  ])

  return { content: decrypted.toString() }
}
