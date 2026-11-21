import {
  AdminConfigurationError,
  isAdminAuthenticated,
  isSameOriginRequest,
  readJsonBody,
  sendJson,
} from '../../api-helpers/adminAuth.js'
import { isMongoUnavailableError } from '../../api-helpers/mongoDatabase.js'
import { getSitePagesCollection, isEditablePagePath, validatePageDocument } from '../../api-helpers/sitePages.js'

export default async function handler(request, response) {
  if (request.method !== 'GET' && request.method !== 'PUT' && request.method !== 'DELETE') {
    response.setHeader('Allow', 'GET, PUT, DELETE')
    return sendJson(response, 405, { error: 'Method not allowed.' })
  }

  try {
    if (request.method !== 'GET' && !isSameOriginRequest(request)) {
      return sendJson(response, 403, { error: 'Request origin was not accepted.' })
    }
    if (!isAdminAuthenticated(request)) return sendJson(response, 401, { error: 'Sign in to manage website pages.' })

    const collection = await getSitePagesCollection()
    if (request.method === 'GET') {
      const pages = await collection.find({}, { projection: { _id: 0 } }).sort({ path: 1 }).toArray()
      return sendJson(response, 200, { pages })
    }

    const body = await readJsonBody(request, 256 * 1024)
    if (request.method === 'DELETE') {
      if (!isEditablePagePath(body?.path)) return sendJson(response, 400, { error: 'Choose a supported website page.' })
      const result = await collection.deleteOne({ path: body.path })
      return sendJson(response, 200, { deleted: result.deletedCount > 0 })
    }

    const page = validatePageDocument(body?.page)
    await collection.replaceOne({ path: page.path }, page, { upsert: true })
    return sendJson(response, 200, { saved: true, page: { ...page, updatedAt: page.updatedAt.toISOString() } })
  } catch (error) {
    if (error instanceof AdminConfigurationError) return sendJson(response, error.statusCode, { error: error.message })
    if (isMongoUnavailableError(error)) {
      return sendJson(response, 503, { error: 'Website page storage is temporarily unavailable.' })
    }
    if (error.statusCode === 413 || error.statusCode === 400 || error instanceof SyntaxError) {
      return sendJson(response, error.statusCode || 400, { error: error.statusCode ? error.message : 'Invalid JSON request.' })
    }
    console.error('Website page management failed:', error)
    return sendJson(response, 500, { error: 'Unable to manage website pages.' })
  }
}
