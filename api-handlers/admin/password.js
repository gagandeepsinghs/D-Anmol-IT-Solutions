import {
  AdminConfigurationError,
  createAdminPasswordHash,
  getAdminConfiguration,
  isAdminAuthenticated,
  isSameOriginRequest,
  isValidAdminPassword,
  isValidStoredAdminPassword,
  readJsonBody,
  sendJson,
} from '../../api-helpers/adminAuth.js'
import { getModuleImageCollection } from '../../api-helpers/moduleImageStore.js'

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return sendJson(response, 405, { error: 'Method not allowed.' })
  }
  if (!isSameOriginRequest(request)) return sendJson(response, 403, { error: 'Request origin was not accepted.' })

  try {
    const { password: initialPassword, secret } = getAdminConfiguration()
    if (!isAdminAuthenticated(request)) return sendJson(response, 401, { error: 'Sign in to change the admin password.' })

    const body = await readJsonBody(request)
    const { currentPassword, newPassword, confirmPassword } = body || {}
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string' || typeof confirmPassword !== 'string') {
      return sendJson(response, 400, { error: 'Enter your current password and the new password twice.' })
    }
    if (newPassword.length < 12 || newPassword.length > 1024) {
      return sendJson(response, 400, { error: 'The new password must be at least 12 characters.' })
    }
    if (newPassword !== confirmPassword) {
      return sendJson(response, 400, { error: 'The new passwords do not match.' })
    }

    const credentialsCollection = (await getModuleImageCollection()).db.collection('adminCredentials')
    const credentials = await credentialsCollection.findOne({ _id: 'admin' })
    const currentPasswordIsValid = credentials
      ? isValidStoredAdminPassword(currentPassword, credentials)
      : isValidAdminPassword(currentPassword, initialPassword, secret)
    if (!currentPasswordIsValid) return sendJson(response, 401, { error: 'Current password is incorrect.' })

    await credentialsCollection.replaceOne({ _id: 'admin' }, {
      _id: 'admin',
      ...createAdminPasswordHash(newPassword),
      updatedAt: new Date(),
    }, { upsert: true })
    return sendJson(response, 200, { updated: true })
  } catch (error) {
    if (error instanceof AdminConfigurationError) return sendJson(response, error.statusCode, { error: error.message })
    console.error('Admin password change failed:', error)
    return sendJson(response, error.statusCode || 500, { error: error.statusCode ? error.message : 'Unable to change the admin password.' })
  }
}
