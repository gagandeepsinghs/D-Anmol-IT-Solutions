import {
  AdminConfigurationError,
  isAdminAuthenticated,
  isSameOriginRequest,
  readJsonBody,
  sendJson,
} from './lib/adminAuth.js'
import {
  getModuleImageCollection,
  ModuleImageStorageUnavailableError,
} from './lib/moduleImageStore.js'

const maximumImageBytes = 3 * 1024 * 1024
const maximumRequestBytes = 4.5 * 1024 * 1024
const supportedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4.5mb',
    },
  },
}

function getImageKey(request) {
  const key = new URL(request.url, 'http://localhost').searchParams.get('key')
  return typeof key === 'string' && key.length <= 80 && /^[a-z][a-z0-9-]*$/.test(key)
    ? key
    : null
}

function isValidImageData(data, contentType) {
  if (contentType === 'image/jpeg') return data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff
  if (contentType === 'image/png') {
    return data.length >= 8
      && data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  }
  if (contentType === 'image/webp') {
    return data.length >= 12
      && data.toString('ascii', 0, 4) === 'RIFF'
      && data.toString('ascii', 8, 12) === 'WEBP'
  }
  return false
}

async function handleError(error, response, action) {
  if (error instanceof AdminConfigurationError) return sendJson(response, error.statusCode, { error: error.message })
  if (error instanceof ModuleImageStorageUnavailableError) {
    return sendJson(response, error.statusCode, { error: error.message })
  }
  if (error.statusCode === 413 || error instanceof SyntaxError) {
    return sendJson(response, error.statusCode || 400, { error: error.statusCode ? error.message : 'Invalid JSON request.' })
  }
  console.error(`Site image ${action} failed:`, error)
  return sendJson(response, 500, { error: `Unable to ${action} site image.` })
}

export default async function handler(request, response) {
  const key = getImageKey(request)
  if (!key) return sendJson(response, 400, { error: 'A valid site image key is required.' })

  if (request.method === 'GET') {
    try {
      const image = await (await getModuleImageCollection()).db
        .collection('siteImages')
        .findOne({ _id: key })
      if (!image) return sendJson(response, 404, { error: 'No uploaded site image was found.' })

      const data = Buffer.isBuffer(image.data)
        ? image.data
        : Buffer.from(image.data.value(true))
      response.statusCode = 200
      response.setHeader('Content-Type', image.contentType)
      response.setHeader('Content-Length', data.length)
      response.setHeader('Cache-Control', 'no-store')
      response.setHeader('X-Content-Type-Options', 'nosniff')
      response.setHeader('Content-Disposition', 'inline')
      return response.end(data)
    } catch (error) {
      return handleError(error, response, 'load')
    }
  }

  if (request.method !== 'PUT' && request.method !== 'DELETE') {
    response.setHeader('Allow', 'GET, PUT, DELETE')
    return sendJson(response, 405, { error: 'Method not allowed.' })
  }
  if (!isSameOriginRequest(request)) return sendJson(response, 403, { error: 'Request origin was not accepted.' })

  try {
    if (!isAdminAuthenticated(request)) return sendJson(response, 401, { error: 'Sign in to manage site images.' })
    if (request.method === 'DELETE') {
      await (await getModuleImageCollection()).db.collection('siteImages').deleteOne({ _id: key })
      return sendJson(response, 200, { deleted: true })
    }

    const body = await readJsonBody(request, maximumRequestBytes)
    if (!supportedImageTypes.has(body?.contentType) || typeof body?.data !== 'string') {
      return sendJson(response, 400, { error: 'Choose a JPEG, PNG or WebP image.' })
    }
    if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(body.data)) {
      return sendJson(response, 400, { error: 'The uploaded image data is invalid.' })
    }

    const data = Buffer.from(body.data, 'base64')
    if (data.length === 0 || data.length > maximumImageBytes || data.toString('base64') !== body.data) {
      return sendJson(response, 413, { error: 'Optimized image must be no larger than 3 MB.' })
    }
    if (!isValidImageData(data, body.contentType)) {
      return sendJson(response, 400, { error: 'The image file does not match its format.' })
    }

    await (await getModuleImageCollection()).db.collection('siteImages').replaceOne({
      _id: key,
    }, {
      _id: key,
      contentType: body.contentType,
      data,
      updatedAt: new Date(),
    }, { upsert: true })

    return sendJson(response, 200, { saved: true, image: `/api/site-image?key=${encodeURIComponent(key)}` })
  } catch (error) {
    return handleError(error, response, 'save')
  }
}
