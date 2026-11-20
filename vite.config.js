import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRobotsTxt, createSitemapXml } from './api-helpers/seoResponses.js'
import { legacyRedirects, publicSitePaths } from './src/data/publicSitePaths.js'
import { pageSeoByPath } from './src/data/seoMetadata.js'

const notFoundPage = readFileSync(new URL('./public/404.html', import.meta.url), 'utf8')
const publicPathSet = new Set([...publicSitePaths, ...Object.keys(legacyRedirects)])
const outputDirectory = fileURLToPath(new URL('./dist/', import.meta.url))

function escapeAttribute(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function setHtmlMeta(html, attribute, key, content) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const metaPattern = new RegExp(`<meta\\s+${attribute}="${escapedKey}"\\s+content="[^"]*"\\s*\\/?>`, 'i')
  const tag = `<meta ${attribute}="${escapeAttribute(key)}" content="${escapeAttribute(content)}" />`
  if (metaPattern.test(html)) return html.replace(metaPattern, tag)
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

function seoAndNotFoundPlugin(configuredSiteUrl, googleVerificationToken) {
  let isPreview = false

  const middleware = (request, response, next) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') return next()

    let pathname
    try {
      pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    } catch {
      response.statusCode = 400
      return response.end('Invalid URL')
    }

    if (pathname !== '/' && pathname.endsWith('/')) {
      response.statusCode = 308
      response.setHeader('Location', `${pathname.replace(/\/+$/, '')}${new URL(request.url, 'http://localhost').search}`)
      return response.end()
    }

    if (legacyRedirects[pathname]) {
      response.statusCode = 308
      response.setHeader('Location', `${legacyRedirects[pathname]}${new URL(request.url, 'http://localhost').search}`)
      return response.end()
    }

    const host = request.headers.host || 'localhost'
    const protocol = request.headers['x-forwarded-proto']
      || (host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https')
    const origin = configuredSiteUrl || `${protocol}://${host}`

    if (pathname === '/sitemap.xml' || pathname === '/robots.txt') {
      response.statusCode = 200
      response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600')
      if (pathname === '/sitemap.xml') {
        response.setHeader('Content-Type', 'application/xml; charset=utf-8')
        return response.end(createSitemapXml(new URL(origin).origin))
      }
      response.setHeader('Content-Type', 'text/plain; charset=utf-8')
      return response.end(createRobotsTxt(new URL(origin).origin))
    }

    const isManagedPagePath = /^\/pages\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pathname)
    if (isPreview && (publicSitePaths.includes(pathname) || isManagedPagePath)) {
      const filePath = pathname === '/' || isManagedPagePath
        ? resolve(outputDirectory, 'index.html')
        : resolve(outputDirectory, `.${pathname}`, 'index.html')
      response.statusCode = 200
      response.setHeader('Content-Type', 'text/html; charset=utf-8')
      return response.end(request.method === 'HEAD' ? undefined : readFileSync(filePath))
    }

    if (pathname === '/admin' || publicPathSet.has(pathname) || isManagedPagePath || pathname === '/404.html' || pathname.startsWith('/@') || pathname.startsWith('/src/')) return next()
    if (!request.headers.accept?.includes('text/html')) return next()

    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
    response.end(notFoundPage)
  }

  let command

  return {
    name: 'seo-endpoints-and-not-found',
    configResolved(config) {
      command = config.command
    },
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      isPreview = true
      server.middlewares.use(middleware)
    },
    closeBundle() {
      if (command !== 'build') return

      let baseHtml = readFileSync(resolve(outputDirectory, 'index.html'), 'utf8')
      const assetsDirectory = resolve(outputDirectory, 'assets')
      const logoFile = readdirSync(assetsDirectory).find((file) => file.startsWith('D Anmol Enterprises Logo Light-') && file.endsWith('.webp'))
      const siteOrigin = configuredSiteUrl ? new URL(configuredSiteUrl).origin : ''
      const logoUrl = logoFile ? `${siteOrigin}/assets/${encodeURIComponent(logoFile)}` : null

      const createRouteHtml = (pathname, metadata) => {
        const canonical = `${siteOrigin}${pathname}`
        let html = baseHtml
          .replace(/<title>[^<]*<\/title>/i, `<title>${escapeAttribute(metadata.title)}</title>`)
          .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonical}" />`)
        html = setHtmlMeta(html, 'name', 'description', metadata.description)
        html = setHtmlMeta(html, 'name', 'robots', 'index,follow,max-image-preview:large')
        html = setHtmlMeta(html, 'property', 'og:title', metadata.title)
        html = setHtmlMeta(html, 'property', 'og:description', metadata.description)
        html = setHtmlMeta(html, 'property', 'og:url', canonical)
        html = setHtmlMeta(html, 'name', 'twitter:title', metadata.title)
        html = setHtmlMeta(html, 'name', 'twitter:description', metadata.description)
        if (logoUrl) {
          html = setHtmlMeta(html, 'property', 'og:image', logoUrl)
          html = setHtmlMeta(html, 'name', 'twitter:image', logoUrl)
        }
        if (googleVerificationToken) {
          html = setHtmlMeta(html, 'name', 'google-site-verification', googleVerificationToken)
        }
        return html
      }

      const rootHtml = createRouteHtml('/', pageSeoByPath['/'])
      writeFileSync(resolve(outputDirectory, 'index.html'), rootHtml)

      publicSitePaths.filter((pathname) => pathname !== '/').forEach((pathname) => {
        const html = createRouteHtml(pathname, pageSeoByPath[pathname])
        const pageDirectory = resolve(outputDirectory, `.${pathname}`)
        mkdirSync(pageDirectory, { recursive: true })
        writeFileSync(resolve(pageDirectory, 'index.html'), html)
      })
    },
  }
}

function localApiPlugin() {
  const handlers = {
    '/api/admin/login': () => import('./api-handlers/admin/login.js'),
    '/api/admin/session': () => import('./api-handlers/admin/session.js'),
    '/api/admin/logout': () => import('./api-handlers/admin/logout.js'),
    '/api/admin/pages': () => import('./api-handlers/admin/pages.js'),
    '/api/admin/content': () => import('./api-handlers/admin/content.js'),
    '/api/admin/enquiries': () => import('./api-handlers/admin/enquiries.js'),
    '/api/admin/password': () => import('./api-handlers/admin/password.js'),
    '/api/course-image': () => import('./api/course-image.js'),
    '/api/site-image': () => import('./api/site-image.js'),
    '/api/enquiry': () => import('./api/enquiry.js'),
    '/api/site-pages': () => import('./api/site-pages.js'),
    '/api/site-content': () => import('./api/site-content.js'),
  }

  return {
    name: 'local-api-functions',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        let pathname
        try {
          pathname = new URL(request.url, 'http://localhost').pathname
        } catch {
          response.statusCode = 400
          return response.end('Invalid URL')
        }

        const loadHandler = handlers[pathname]
        if (!loadHandler) return next()

        try {
          const { default: handler } = await loadHandler()
          await handler(request, response)
        } catch (error) {
          console.error(`Local API request failed for ${pathname}:`, error)
          if (!response.headersSent) {
            response.statusCode = 500
            response.setHeader('Content-Type', 'application/json; charset=utf-8')
            response.end(JSON.stringify({ error: 'The local API request failed.' }))
          }
        }
      })
    },
  }
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (command === 'serve') {
    Object.entries(env).forEach(([key, value]) => {
      if (process.env[key] === undefined) process.env[key] = value
    })
  }
  const siteUrl = env.VITE_SITE_URL ? new URL(env.VITE_SITE_URL).origin : null

  return {
    appType: command === 'serve' && mode === 'production' ? 'custom' : 'spa',
    plugins: [localApiPlugin(), seoAndNotFoundPlugin(siteUrl, env.VITE_GOOGLE_SITE_VERIFICATION), react()],
  }
})
