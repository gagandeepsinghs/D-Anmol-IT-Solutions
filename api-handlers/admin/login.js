import {
  AdminConfigurationError,
  getAdminConfiguration,
  isSameOriginRequest,
  isValidAdminPassword,
  isValidStoredAdminPassword,
  readJsonBody,
  sendJson,
  setAdminSession,
} from '../../api-helpers/adminAuth.js'
import { getMongoDatabase } from '../../api-helpers/mongoDatabase.js'

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return sendJson(response, 405, { error: 'Method not allowed.' })
  }
  if (!isSameOriginRequest(request)) return sendJson(response, 403, { error: 'Request origin was not accepted.' })

  try {
    const { password: expectedPassword, secret } = getAdminConfiguration()
    const body = await readJsonBody(request)
    const credentials = await (await getMongoDatabase())
      .collection('adminCredentials')
      .findOne({ _id: 'admin' })
    const passwordIsValid = credentials
      ? isValidStoredAdminPassword(body?.password, credentials)
      : isValidAdminPassword(body?.password, expectedPassword, secret)
    if (!passwordIsValid) {
      return sendJson(response, 401, { error: 'Incorrect password.' })
    }

    setAdminSession(response, secret)
    return sendJson(response, 200, { authenticated: true })
  } catch (error) {
    if (error instanceof AdminConfigurationError) return sendJson(response, error.statusCode, { error: error.message })
    console.error('Admin login failed:', error)
    return sendJson(response, error.statusCode || 500, { error: error.statusCode ? error.message : 'Unable to sign in.' })
  }
}
