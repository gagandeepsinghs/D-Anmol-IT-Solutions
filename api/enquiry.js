import { randomUUID } from 'node:crypto'
import {
  isSameOriginRequest,
  readJsonBody,
  sendJson,
} from '../api-helpers/adminAuth.js'
import { getModuleImageCollection } from '../api-helpers/moduleImageStore.js'

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

function getForwardUrl() {
  const value = process.env.ENQUIRY_FORWARD_URL || process.env.VITE_ENQUIRY_URL
  if (!value) {
    throw Object.assign(new Error('Set ENQUIRY_FORWARD_URL to the deployed Google Apps Script web app URL.'), { statusCode: 503 })
  }
  let url
  try {
    url = new URL(value)
  } catch {
    throw Object.assign(new Error('ENQUIRY_FORWARD_URL must be a valid HTTPS URL.'), { statusCode: 503 })
  }
  if (url.protocol !== 'https:') {
    throw Object.assign(new Error('ENQUIRY_FORWARD_URL must use HTTPS.'), { statusCode: 503 })
  }
  return url.href
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
    const collection = (await getModuleImageCollection()).db.collection('enquiries')
    const existing = await collection.findOne({ _id: id }, { projection: { deliveryStatus: 1, receivedAt: 1, status: 1 } })
    if (existing?.deliveryStatus === 'sent') return sendJson(response, 200, { ok: true })

    await collection.replaceOne({ _id: id }, {
      _id: id,
      ...enquiry,
      status: existing?.status || 'new',
      deliveryStatus: 'pending',
      receivedAt: existing?.receivedAt || new Date(),
      updatedAt: new Date(),
    }, { upsert: true })

    try {
      const forwardUrl = getForwardUrl()
      const forwardedResponse = await fetch(forwardUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(enquiry),
        redirect: 'follow',
      })
      const result = await forwardedResponse.json().catch(() => ({}))
      if (!forwardedResponse.ok || result.ok !== true) {
        await collection.updateOne({ _id: id }, { $set: { deliveryStatus: 'failed', updatedAt: new Date() } })
        return sendJson(response, 200, { ok: true, deliveryStatus: 'failed' })
      }
    } catch (error) {
      await collection.updateOne({ _id: id }, { $set: { deliveryStatus: 'failed', updatedAt: new Date() } })
      console.error('Enquiry forwarding failed:', error)
      return sendJson(response, 200, { ok: true, deliveryStatus: 'failed' })
    }

    await collection.updateOne({ _id: id }, {
      $set: { deliveryStatus: 'sent', deliveredAt: new Date(), updatedAt: new Date() },
    })
    return sendJson(response, 200, { ok: true })
  } catch (error) {
    console.error('Enquiry storage failed:', error)
    return sendJson(response, 503, { error: 'The enquiry could not be saved. Please try again or contact us directly.' })
  }
}
