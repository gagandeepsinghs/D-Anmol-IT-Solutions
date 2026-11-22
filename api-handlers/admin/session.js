import { AdminConfigurationError, isAdminAuthenticated, sendJson } from '../../api-helpers/adminAuth.js'
import { isMongoUnavailableError } from '../../api-helpers/mongoDatabase.js'

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return sendJson(response, 405, { error: 'Method not allowed.' })
  }

  try {
    return sendJson(response, 200, { authenticated: await isAdminAuthenticated(request) })
  } catch (error) {
    if (error instanceof AdminConfigurationError) return sendJson(response, error.statusCode, { error: error.message })
    if (isMongoUnavailableError(error)) return sendJson(response, 503, { error: 'Admin session verification is temporarily unavailable.' })
    console.error('Unable to verify admin session:', error)
    return sendJson(response, 500, { error: 'Unable to verify admin session.' })
  }
}
