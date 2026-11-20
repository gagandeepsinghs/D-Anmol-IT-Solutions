import { sendJson } from '../api-helpers/adminAuth.js'
import { getSiteContentCollection } from '../api-helpers/siteContent.js'

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return sendJson(response, 405, { error: 'Method not allowed.' })
  }
  try {
    const saved = await (await getSiteContentCollection())
      .findOne({ _id: 'published' }, { projection: { _id: 0, content: 1 } })
    return sendJson(response, 200, { content: saved?.content || {} })
  } catch (error) {
    console.error('Unable to load managed website content:', error)
    return sendJson(response, 503, { error: 'Managed website content is temporarily unavailable.' })
  }
}
