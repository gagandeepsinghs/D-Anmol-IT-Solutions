import { publicSitePaths } from '../src/data/publicSitePaths.js'

function getSiteOrigin(request) {
  const configuredUrl = process.env.VITE_SITE_URL
  const forwardedHost = request.headers['x-forwarded-host']
  const host = (Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost) || request.headers.host
  const forwardedProtocol = request.headers['x-forwarded-proto']
  const hostValue = Array.isArray(host) ? host[0] : host
  const protocol = (Array.isArray(forwardedProtocol) ? forwardedProtocol[0] : forwardedProtocol)?.split(',')[0].trim()
    || (hostValue?.startsWith('localhost') || hostValue?.startsWith('127.0.0.1') ? 'http' : 'https')
  const siteUrl = configuredUrl || `${protocol}://${hostValue}`

  if (!hostValue && !configuredUrl) throw new Error('Unable to determine the public site URL')

  const parsedUrl = new URL(siteUrl)
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('VITE_SITE_URL must use HTTP or HTTPS')

  return parsedUrl.origin
}

export function createSitemapXml(origin, additionalPaths = []) {
  const paths = [...new Set([...publicSitePaths, ...additionalPaths])]
  const urls = paths.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

export function createRobotsTxt(origin) {
  return `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${origin}/sitemap.xml\n`
}

function sendText(request, response, contentType, content) {
  const origin = getSiteOrigin(request)
  response.setHeader('Content-Type', `${contentType}; charset=utf-8`)
  response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400')
  response.status(200).send(content(origin))
}

export function sitemapHandler(request, response, additionalPaths = []) {
  try {
    sendText(request, response, 'application/xml', (origin) => createSitemapXml(origin, additionalPaths))
  } catch (error) {
    console.error('Unable to generate sitemap:', error)
    response.status(500).send('Unable to generate sitemap')
  }
}

export function robotsHandler(request, response) {
  try {
    sendText(request, response, 'text/plain', createRobotsTxt)
  } catch (error) {
    console.error('Unable to generate robots.txt:', error)
    response.status(500).send('Unable to generate robots.txt')
  }
}
