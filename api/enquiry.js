import { randomUUID } from 'node:crypto'
import {
  isSameOriginRequest,
  readJsonBody,
  sendJson,
} from '../api-helpers/adminAuth.js'
import { getMongoDatabase } from '../api-helpers/mongoDatabase.js'

const allowedFormTypes = new Set(['contact', 'course', 'corporate', 'demo', 'ai-python'])
const stringFields = [
  'name',
  'phone',
  'email',
  'course',
  'preferredDemoMode',
  'preferredContactMethod',
  'message',
  'organization',
  'preferredDate',
  'preferredTime',
  'referralSource',
]
const maximumFieldLengths = {
  name: 160,
  phone: 80,
  email: 254,
  course: 240,
  preferredDemoMode: 80,
  preferredContactMethod: 80,
  message: 4000,
  organization: 240,
  preferredDate: 40,
  preferredTime: 80,
  referralSource: 120,
}

function normalizeEnquiry(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body) || !allowedFormTypes.has(body.formType)) {
    throw Object.assign(new Error('Invalid enquiry form data.'), { statusCode: 400 })
  }
  if (typeof body.website !== 'string' || body.website.length > 0) {
    throw Object.assign(new Error('The enquiry could not be accepted.'), { statusCode: 400 })
  }

  const enquiry = { formType: body.formType }
  for (const field of stringFields) {
    const value = body[field] ?? ''
    if (typeof value !== 'string' || value.length > maximumFieldLengths[field]) {
      throw Object.assign(new Error(`Invalid ${field} value.`), { statusCode: 400 })
    }
    enquiry[field] = value.trim()
  }
  if (!enquiry.name || !enquiry.phone) {
    throw Object.assign(new Error('Name and phone are required.'), { statusCode: 400 })
  }
  return enquiry
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return sendJson(response, 405, { error: 'Method not allowed.' })
  }
  if (!isSameOriginRequest(request)) return sendJson(response, 403, { error: 'Request origin was not accepted.' })

  let enquiry
  let id
  try {
    const body = await readJsonBody(request)
    enquiry = normalizeEnquiry(body)
    id = typeof body.idempotencyKey === 'string' && /^[a-zA-Z0-9-]{12,100}$/.test(body.idempotencyKey)
      ? body.idempotencyKey
      : randomUUID()
  } catch (error) {
    return sendJson(response, error.statusCode || 400, { error: error.message || 'Invalid enquiry request.' })
  }

  try {
    const collection = (await getMongoDatabase()).collection('enquiries')
    const existing = await collection.findOne({ _id: id }, { projection: { _id: 1 } })
    if (existing) return sendJson(response, 200, { ok: true })

    await collection.insertOne({
      _id: id,
      ...enquiry,
      status: 'new',
      receivedAt: new Date(),
      updatedAt: new Date(),
    })
    return sendJson(response, 200, { ok: true })
  } catch (error) {
    if (error.code === 11000) return sendJson(response, 200, { ok: true })
    console.error('Enquiry storage failed:', error)
    return sendJson(response, 503, { error: 'The enquiry could not be saved. Please try again or contact us directly.' })
  }
}
