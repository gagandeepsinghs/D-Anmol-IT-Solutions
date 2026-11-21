import { sendJson } from '../../api-helpers/adminAuth.js'
import login from '../../api-handlers/admin/login.js'
import logout from '../../api-handlers/admin/logout.js'
import session from '../../api-handlers/admin/session.js'
import pages from '../../api-handlers/admin/pages.js'
import content from '../../api-handlers/admin/content.js'
import enquiries from '../../api-handlers/admin/enquiries.js'
import password from '../../api-handlers/admin/password.js'

const adminHandlers = new Map([
  ['/api/admin/login', login],
  ['/api/admin/logout', logout],
  ['/api/admin/session', session],
  ['/api/admin/pages', pages],
  ['/api/admin/content', content],
  ['/api/admin/enquiries', enquiries],
  ['/api/admin/password', password],
])

export default async function handler(request, response) {
  const pathname = (request.url || '').split('?')[0].replace(/\/+$/, '')
  const adminHandler = adminHandlers.get(pathname)
  if (!adminHandler) return sendJson(response, 404, { error: 'Admin endpoint not found.' })
  return adminHandler(request, response)
}
