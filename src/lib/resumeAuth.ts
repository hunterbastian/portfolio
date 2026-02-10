import { createHmac, timingSafeEqual } from 'crypto'

export const RESUME_COOKIE_NAME = 'studio_alpine_resume_access'
export const RESUME_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 14
const DEFAULT_RESUME_PASSWORD = 'utah'

function buildSignature(payload: string, key: string): string {
  return createHmac('sha256', key).update(payload).digest('base64url')
}

function safeCompare(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a)
  const bBuffer = Buffer.from(b)
  if (aBuffer.length !== bBuffer.length) {
    return false
  }
  return timingSafeEqual(aBuffer, bBuffer)
}

export function getResumePassword(): string | null {
  const password = process.env.RESUME_PASSWORD?.trim()
  return password || DEFAULT_RESUME_PASSWORD
}

export function createResumeAccessToken(password: string): string {
  const expiresAt = Math.floor(Date.now() / 1000) + RESUME_COOKIE_MAX_AGE_SECONDS
  const payload = String(expiresAt)
  const signature = buildSignature(payload, password)
  return `${payload}.${signature}`
}

export function verifyResumeAccessToken(token: string | undefined, password: string): boolean {
  if (!token) {
    return false
  }

  const [expiresAtRaw, signature] = token.split('.')
  if (!expiresAtRaw || !signature) {
    return false
  }

  const expiresAt = Number(expiresAtRaw)
  if (!Number.isFinite(expiresAt)) {
    return false
  }
  if (expiresAt <= Math.floor(Date.now() / 1000)) {
    return false
  }

  const expectedSignature = buildSignature(expiresAtRaw, password)
  return safeCompare(signature, expectedSignature)
}
