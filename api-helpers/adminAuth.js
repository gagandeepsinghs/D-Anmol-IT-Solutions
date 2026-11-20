import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const cookieName = 'anmol_admin_session'
const sessionDurationSeconds = 8 * 60 * 60
const passwordKeyLength = 32
let cachedPasswordHash

export class AdminConfigurationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'AdminConfigurationError'
    this.statusCode = 503
  }
}

export function getAdminConfiguration() {
  const password = process.env.ADMIN_PASSWORD
  const secret = process.env.ADMIN_SESSION_SECRET

  if (!password || password.length < 12) {
    throw new AdminConfigurationError('Set ADMIN_PASSWORD to a value of at least 12 characters.')
  }
  if (!secret || secret.length < 32) {
    throw new AdminConfigurationError('Set ADMIN_SESSION_SECRET to a random value of at least 32 characters.')
  }

  return { password, secret }
}

export function sendJson(response, statusCode, value) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify(value))
}

export async function readJsonBody(request, maximumBytes = 64 * 1024) {
  if (request.body !== undefined) {
    const body = request.body
    if (body && typeof body === 'object' && !Buffer.isBuffer(body)) return body
    const bodyText = Buffer.isBuffer(body) ? body.toString('utf8') : String(body)
    if (Buffer.byteLength(bodyText) > maximumBytes) throw Object.assign(new Error('Request body is too large.'), { statusCode: 413 })
    return JSON.parse(bodyText)
  }

  const chunks = []
  let totalBytes = 0
  for await (const chunk of request) {
    totalBytes += chunk.length
    if (totalBytes > maximumBytes) throw Object.assign(new Error('Request body is too large.'), { statusCode: 413 })
    chunks.push(chunk)
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

export function isSameOriginRequest(request) {
  const origin = request.headers.origin
  const forwardedHost = request.headers['x-forwarded-host']
  const host = ((Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost) || request.headers.host)?.split(',')[0].trim()
  const forwardedProtocol = request.headers['x-forwarded-proto']
  const protocol = ((Array.isArray(forwardedProtocol) ? forwardedProtocol[0] : forwardedProtocol) || '')
    .split(',')[0]
    .trim()
    .replace(/:$/, '')
    || (host?.startsWith('localhost') || host?.startsWith('127.0.0.1') ? 'http' : 'https')

  if (!origin || !host) return false

  try {
    const parsedOrigin = new URL(origin)
    return parsedOrigin.host.toLowerCase() === String(host).toLowerCase()
      && parsedOrigin.protocol === `${protocol}:`
  } catch {
    return false
  }
}

function createSessionToken(secret) {
  const payload = Buffer.from(JSON.stringify({
    expiresAt: Math.floor(Date.now() / 1000) + sessionDurationSeconds,
  })).toString('base64url')
  const signature = createHmac('sha256', secret).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

function isValidSessionToken(token, secret) {
  if (typeof token !== 'string') return false
  const [payload, signature, extra] = token.split('.')
  if (!payload || !signature || extra) return false

  const expectedSignature = createHmac('sha256', secret).update(payload).digest()
  const actualSignature = Buffer.from(signature, 'base64url')
  if (actualSignature.length !== expectedSignature.length || !timingSafeEqual(actualSignature, expectedSignature)) return false

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    return Number.isInteger(session.expiresAt) && session.expiresAt > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}

function readSessionCookie(request) {
  const cookieHeader = request.headers.cookie || ''
  const cookie = cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${cookieName}=`))
  return cookie ? cookie.slice(cookieName.length + 1) : null
}

export function setAdminSession(response, secret) {
  const token = createSessionToken(secret)
  const attributes = [
    `${cookieName}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'SameSite=Strict',
    'Path=/',
    `Max-Age=${sessionDurationSeconds}`,
  ]
  if (process.env.NODE_ENV === 'production') attributes.push('Secure')
  response.setHeader('Set-Cookie', attributes.join('; '))
}

export function clearAdminSession(response) {
  const attributes = [`${cookieName}=`, 'HttpOnly', 'SameSite=Strict', 'Path=/', 'Max-Age=0']
  if (process.env.NODE_ENV === 'production') attributes.push('Secure')
  response.setHeader('Set-Cookie', attributes.join('; '))
}

export function isAdminAuthenticated(request) {
  const { secret } = getAdminConfiguration()
  return isValidSessionToken(readSessionCookie(request), secret)
}

export function isValidAdminPassword(password, expectedPassword, secret) {
  if (typeof password !== 'string' || password.length > 1024) return false
  const candidateHash = scryptSync(password, secret, passwordKeyLength)
  const cacheKey = `${secret}\n${expectedPassword}`
  if (cachedPasswordHash?.key !== cacheKey) {
    cachedPasswordHash = { key: cacheKey, hash: scryptSync(expectedPassword, secret, passwordKeyLength) }
  }
  const expectedHash = cachedPasswordHash.hash
  return timingSafeEqual(candidateHash, expectedHash)
}

export function createAdminPasswordHash(password) {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, passwordKeyLength)
  return {
    passwordSalt: salt.toString('base64url'),
    passwordHash: hash.toString('base64url'),
  }
}

export function isValidStoredAdminPassword(password, credentials) {
  if (typeof password !== 'string' || password.length > 1024
    || typeof credentials?.passwordSalt !== 'string'
    || typeof credentials?.passwordHash !== 'string') {
    return false
  }

  const salt = Buffer.from(credentials.passwordSalt, 'base64url')
  const expectedHash = Buffer.from(credentials.passwordHash, 'base64url')
  if (salt.length !== 16 || expectedHash.length !== passwordKeyLength) return false

  const actualHash = scryptSync(password, salt, passwordKeyLength)
  return timingSafeEqual(actualHash, expectedHash)
}
