import { clearAdminSession, isSameOriginRequest, sendJson } from '../../api-helpers/adminAuth.js'

export default function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return sendJson(response, 405, { error: 'Method not allowed.' })
  }
  if (!isSameOriginRequest(request)) return sendJson(response, 403, { error: 'Request origin was not accepted.' })

  clearAdminSession(response)
  return sendJson(response, 200, { authenticated: false })
}
