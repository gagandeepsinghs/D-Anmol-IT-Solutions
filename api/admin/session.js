import { AdminConfigurationError, isAdminAuthenticated, sendJson } from '../lib/adminAuth.js'

export default function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return sendJson(response, 405, { error: 'Method not allowed.' })
  }

  try {
    return sendJson(response, 200, { authenticated: isAdminAuthenticated(request) })
  } catch (error) {
    if (error instanceof AdminConfigurationError) return sendJson(response, error.statusCode, { error: error.message })
    console.error('Unable to verify admin session:', error)
    return sendJson(response, 500, { error: 'Unable to verify admin session.' })
  }
}
