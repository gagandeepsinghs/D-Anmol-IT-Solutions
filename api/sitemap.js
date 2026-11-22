import { sitemapHandler } from '../api-helpers/seoResponses.js'
import { isMongoUnavailableError } from '../api-helpers/mongoDatabase.js'
import { getSitePagesCollection } from '../api-helpers/sitePages.js'
import { getSiteContentCollection } from '../api-helpers/siteContent.js'
import { publicAiPythonSlugs } from '../src/data/publicSitePaths.js'

export default async function sitemap(request, response) {
  try {
    let additionalPaths = []
    const hasMongoUri = Boolean(process.env.MONGODB_URI?.trim())
    const hasMongoDatabase = Boolean(process.env.MONGODB_DB?.trim())
    if (hasMongoUri !== hasMongoDatabase) {
      return response.status(503).send('MongoDB configuration is incomplete')
    }
    if (hasMongoUri) {
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
        .filter((course) => validSlug(course.slug) && publicAiPythonSlugs.includes(course.slug))
        .map((course) => `/ai-python/${course.slug}`)
      additionalPaths = [...pages.map((page) => page.path), ...coursePaths, ...programmePaths]
    }
    return sitemapHandler(request, response, additionalPaths)
  } catch (error) {
    if (isMongoUnavailableError(error)) {
      return response.status(503).send('Sitemap data is temporarily unavailable')
    }
    console.error('Unable to load managed pages for sitemap:', error)
    response.status(500).send('Unable to generate sitemap')
  }
}
