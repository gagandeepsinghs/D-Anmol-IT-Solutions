import { sendJson } from '../api-helpers/adminAuth.js'
import { getSitePagesCollection } from '../api-helpers/sitePages.js'

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return sendJson(response, 405, { error: 'Method not allowed.' })
  }

  try {
    const pages = await (await getSitePagesCollection())
      .find({ published: true }, { projection: { _id: 0, path: 1, title: 1, description: 1, sections: 1 } })
      .toArray()
    return sendJson(response, 200, { pages })
  } catch (error) {
    console.error('Unable to load managed website pages:', error)
    return sendJson(response, 503, { error: 'Managed pages are temporarily unavailable.' })
  }
}
