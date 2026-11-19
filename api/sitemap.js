import { sitemapHandler } from './lib/seoResponses.js'
import { getSitePagesCollection } from './lib/sitePages.js'
import { getSiteContentCollection } from './lib/siteContent.js'

export default async function sitemap(request, response) {
  try {
    let additionalPaths = []
    if (process.env.MONGODB_URI && process.env.MONGODB_DB) {
      const [pages, savedContent] = await Promise.all([
        (await getSitePagesCollection())
          .find({ published: true, path: /^\/pages\// }, { projection: { path: 1 } })
          .toArray(),
        (await getSiteContentCollection())
          .findOne({ _id: 'published' }, { projection: { _id: 0, content: 1 } }),
      ])
      const validSlug = (slug) => typeof slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
      const coursePaths = (savedContent?.content?.courses || [])
        .filter((course) => course.published !== false && validSlug(course.slug))
        .map((course) => `/courses/${course.slug}`)
      const programmePaths = (savedContent?.content?.aiPythonCourses || [])
        .filter((course) => validSlug(course.slug))
        .map((course) => `/ai-python/${course.slug}`)
      additionalPaths = [...pages.map((page) => page.path), ...coursePaths, ...programmePaths]
    }
    return sitemapHandler(request, response, additionalPaths)
  } catch (error) {
    console.error('Unable to load managed pages for sitemap:', error)
    response.status(500).send('Unable to generate sitemap')
  }
}
