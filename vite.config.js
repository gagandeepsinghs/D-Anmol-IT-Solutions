import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { setServers } from 'node:dns'
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

function setStructuredDataScript(html, id, data) {
  const pattern = new RegExp(`<script[^>]*id="${id}"[^>]*>.*?<\\/script>`, 'is')
  const tag = `<script type="application/ld+json" id="${id}">${JSON.stringify(data)}</script>`
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`)
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
    if (isPreview && (pathname === '/admin' || publicSitePaths.includes(pathname) || isManagedPagePath)) {
      const filePath = isManagedPagePath
        ? resolve(outputDirectory, 'managed-page.html')
        : pathname === '/'
        ? resolve(outputDirectory, 'index.html')
        : resolve(outputDirectory, pathname.slice(1), 'index.html')
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
      const siteOrigin = 'https://www.danmolenterprises.com'
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
        html = setHtmlMeta(html, 'name', 'twitter:card', 'summary_large_image')
        html = setHtmlMeta(html, 'property', 'og:type', 'website')
        html = setHtmlMeta(html, 'property', 'og:site_name', 'D-Anmol Enterprises')
        html = setHtmlMeta(html, 'property', 'og:locale', 'en_IN')
        html = setStructuredDataScript(html, 'organization-schema', {
          '@context': 'https://schema.org',
          '@type': ['Organization', 'EducationalOrganization'],
          '@id': `${siteOrigin}/#organization`,
          name: 'D-Anmol Enterprises',
          url: siteOrigin,
          email: 'danmolenterprises6@gmail.com',
          telephone: '+919289337268',
          areaServed: [
            { '@type': 'City', name: 'Chandigarh' },
            { '@type': 'City', name: 'Mohali' },
            { '@type': 'City', name: 'Panchkula' },
            { '@type': 'Country', name: 'India' },
          ],
        })
        html = setStructuredDataScript(html, 'website-schema', {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': `${siteOrigin}/#website`,
          url: siteOrigin,
          name: 'D-Anmol Enterprises',
          publisher: { '@id': `${siteOrigin}/#organization` },
        })
        const breadcrumbItems = [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteOrigin },
        ]
        if (pathname.startsWith('/courses')) {
          breadcrumbItems.push({ '@type': 'ListItem', position: 2, name: 'Courses', item: `${siteOrigin}/courses` })
        }
        if (pathname.startsWith('/courses/')) {
          breadcrumbItems.push({ '@type': 'ListItem', position: 3, name: metadata.title, item: canonical })
        }
        html = setStructuredDataScript(html, 'breadcrumb-schema', {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbItems,
        })
        if (pathname.startsWith('/courses/')) {
          html = setStructuredDataScript(html, 'course-schema', {
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: metadata.title.split(' | ')[0],
            description: metadata.description,
            url: canonical,
            provider: { '@id': `${siteOrigin}/#organization` },
          })
          const courseFaqMap = {
            '/courses/ai-automation': [['Is AI automation suitable for beginners?', 'It starts with process mapping and workflow fundamentals. Basic computer familiarity is helpful; prior automation experience is not required.'], ['Can AI automation be studied online?', 'Yes, online training is available across India. Offline availability can be confirmed in Chandigarh, Mohali and Panchkula.']],
            '/courses/full-stack-development-course-in-chandigarh': [['Is Full Stack Development suitable for beginners?', 'The course progresses from web fundamentals into React, server-side development and databases. Confirm the starting level before enrolment.'], ['Can Full Stack Development be studied online?', 'Yes, online training is available across India. Enquire about offline availability in Chandigarh, Mohali and Panchkula.']],
            '/courses/data-analytics': [['What will I learn in Data Analytics?', 'A typical learning plan covers Python, data cleaning, exploration, visualization and introductory statistical analysis.'], ['Can I study Data Analytics online?', 'Yes, online training is available across India. Offline availability can be confirmed in Chandigarh, Mohali and Panchkula.']],
            '/courses/data-science': [['Is prior programming experience needed for Data Science?', 'Basic computer familiarity is useful. Your existing Python knowledge can be assessed before choosing the starting point.'], ['Is Data Science available online in India?', 'Yes. Online training is available across India. Enquire about offline availability in Chandigarh, Mohali and Panchkula.']],
            '/courses/computer-basics-ms-office': [['Is Computer Basics useful for government-exam preparation?', 'It teaches practical computer fundamentals, files, Word, Excel and PowerPoint. Follow the requirements published for the specific exam.'], ['Are Computer Basics classes available offline?', 'Enquire about availability in Chandigarh, Mohali or Panchkula. Online training is available across India.']],
            '/courses/shorthand-stenography': [['What shorthand method is taught?', 'The course outline covers Pitman shorthand principles, reading, dictation, note-taking and transcription practice.'], ['Are shorthand classes available in Panchkula?', 'Enquire for current availability in Chandigarh, Mohali and Panchkula. Online training is available across India.']],
            '/courses/computer-typing-government-exams': [['Does this course guarantee a government-exam result?', 'No. It provides guided practice and timed drills. Eligibility and speed requirements come from the specific published exam notification.'], ['Can I learn typing online?', 'Yes, online training is available across India. Offline availability can be confirmed in Chandigarh, Mohali and Panchkula.']],
            '/courses/digital-marketing-course-in-chandigarh': [['Which skills are covered in Digital Marketing?', 'SEO, advertising, social media, analytics and reporting are taught through practical tasks.'], ['Is Digital Marketing available online?', 'Yes, online training is available across India. Enquire about offline availability in Chandigarh, Mohali and Panchkula.']],
          }
          const faqs = courseFaqMap[pathname]
          if (faqs) {
            html = setStructuredDataScript(html, 'course-faq-schema', {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map(([name, acceptedAnswer]) => ({
                '@type': 'Question',
                name,
                acceptedAnswer: { '@type': 'Answer', text: acceptedAnswer },
              })),
            })
          }
        } else {
          html = html.replace(/<script[^>]*id="course-schema"[^>]*>.*?<\/script>\s*/is, '')
        }
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

      const adminHtml = createRouteHtml('/admin', {
        title: 'Admin | D-Anmol Enterprises',
        description: 'Manage website pages and content.',
      })
        .replace(/<meta name="robots" content="index,follow,max-image-preview:large"\s*\/?>/i, '<meta name="robots" content="noindex,nofollow" />')
        .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/i, '')
        .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/i, '')
      const adminDirectory = resolve(outputDirectory, 'admin')
      mkdirSync(adminDirectory, { recursive: true })
      writeFileSync(resolve(adminDirectory, 'index.html'), adminHtml)

      const managedPageHtml = baseHtml
        .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, '')
        .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/i, '')
        .replace(/<meta name="robots" content="[^"]*"\s*\/?>/i, '<meta name="robots" content="index,follow" />')
      writeFileSync(resolve(outputDirectory, 'managed-page.html'), managedPageHtml)
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
    if (env.MONGODB_DNS_SERVER) setServers([env.MONGODB_DNS_SERVER])
  }
  const siteUrl = env.VITE_SITE_URL ? new URL(env.VITE_SITE_URL).origin : null

  return {
    appType: command === 'serve' && mode === 'production' ? 'custom' : 'spa',
    build: { manifest: true },
    plugins: [localApiPlugin(), seoAndNotFoundPlugin(siteUrl, env.VITE_GOOGLE_SITE_VERIFICATION), react()],
  }
})
