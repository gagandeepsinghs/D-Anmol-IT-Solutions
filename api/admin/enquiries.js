import {
  AdminConfigurationError,
  isAdminAuthenticated,
  isSameOriginRequest,
  readJsonBody,
  sendJson,
} from '../lib/adminAuth.js'
import { getModuleImageCollection } from '../lib/moduleImageStore.js'

const allowedStatuses = new Set(['new', 'contacted', 'closed'])

export default async function handler(request, response) {
  if (request.method !== 'GET' && request.method !== 'PATCH' && request.method !== 'DELETE') {
    response.setHeader('Allow', 'GET, PATCH, DELETE')
    return sendJson(response, 405, { error: 'Method not allowed.' })
  }
  try {
    if (request.method !== 'GET' && !isSameOriginRequest(request)) {
      return sendJson(response, 403, { error: 'Request origin was not accepted.' })
    }
    if (!isAdminAuthenticated(request)) return sendJson(response, 401, { error: 'Sign in to manage enquiries.' })

    const collection = (await getModuleImageCollection()).db.collection('enquiries')
    if (request.method === 'GET') {
      const enquiries = await collection.find({}, {
        projection: {
          _id: 1,
          formType: 1,
          name: 1,
          phone: 1,
          email: 1,
          course: 1,
          preferredDemoMode: 1,
          preferredContactMethod: 1,
          message: 1,
          organization: 1,
          preferredDate: 1,
          preferredTime: 1,
          referralSource: 1,
          status: 1,
          deliveryStatus: 1,
          receivedAt: 1,
          deliveredAt: 1,
        },
      }).sort({ receivedAt: -1 }).limit(250).toArray()
      return sendJson(response, 200, { enquiries })
    }

    const body = await readJsonBody(request)
    if (typeof body?.id !== 'string' || body.id.length > 100) {
      return sendJson(response, 400, { error: 'Choose a valid enquiry.' })
    }

    if (request.method === 'DELETE') {
      const result = await collection.deleteOne({ _id: body.id })
      return sendJson(response, 200, { deleted: result.deletedCount > 0 })
    }
    if (!allowedStatuses.has(body.status)) {
      return sendJson(response, 400, { error: 'Choose a valid enquiry status.' })
    }
    const result = await collection.updateOne(
      { _id: body.id },
      { $set: { status: body.status, updatedAt: new Date() } },
    )
    return sendJson(response, 200, { updated: result.modifiedCount > 0 })
  } catch (error) {
    if (error instanceof AdminConfigurationError) return sendJson(response, error.statusCode, { error: error.message })
    console.error('Admin enquiry management failed:', error)
    return sendJson(response, 500, { error: 'Unable to manage enquiries.' })
  }
}
