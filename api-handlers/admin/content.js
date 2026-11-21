import {
  AdminConfigurationError,
  isAdminAuthenticated,
  isSameOriginRequest,
  readJsonBody,
  sendJson,
} from '../../api-helpers/adminAuth.js'
import { isMongoUnavailableError } from '../../api-helpers/mongoDatabase.js'
import { getSiteContentCollection, validateSiteContent } from '../../api-helpers/siteContent.js'

export default async function handler(request, response) {
  if (request.method !== 'GET' && request.method !== 'PUT') {
    response.setHeader('Allow', 'GET, PUT')
    return sendJson(response, 405, { error: 'Method not allowed.' })
  }
  try {
    if (request.method === 'PUT' && !isSameOriginRequest(request)) {
      return sendJson(response, 403, { error: 'Request origin was not accepted.' })
    }
    if (!isAdminAuthenticated(request)) return sendJson(response, 401, { error: 'Sign in to manage website content.' })

    const collection = await getSiteContentCollection()
    if (request.method === 'GET') {
      const saved = await collection.findOne({ _id: 'published' }, { projection: { _id: 0, content: 1 } })
      return sendJson(response, 200, { content: saved?.content || null })
    }

    const body = await readJsonBody(request, 1024 * 1024)
    const content = validateSiteContent(body?.content)
    await collection.replaceOne({ _id: 'published' }, {
      _id: 'published',
      content,
      updatedAt: new Date(),
    }, { upsert: true })
    return sendJson(response, 200, { saved: true })
  } catch (error) {
    if (error instanceof AdminConfigurationError) return sendJson(response, error.statusCode, { error: error.message })
    if (isMongoUnavailableError(error)) {
      return sendJson(response, 503, { error: 'Website content storage is temporarily unavailable.' })
    }
    if (error.statusCode === 413 || error.statusCode === 400 || error instanceof SyntaxError) {
      return sendJson(response, error.statusCode || 400, { error: error.statusCode ? error.message : 'Invalid JSON request.' })
    }
    console.error('Website content management failed:', error)
    return sendJson(response, 500, { error: 'Unable to manage website content.' })
  }
}
