import { getMongoDatabase } from './mongoDatabase.js'
import { publicSitePaths } from '../src/data/publicSitePaths.js'

const editablePaths = new Set(publicSitePaths)
const allowedSectionTypes = new Set(['hero', 'text', 'image', 'courses', 'faq', 'cta'])
const maximumPageBytes = 256 * 1024

export async function getSitePagesCollection() {
  return (await getMongoDatabase()).collection('sitePages')
}

export function isEditablePagePath(path) {
  return typeof path === 'string'
    && (editablePaths.has(path) || /^\/pages\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path))
}

export function validatePageDocument(page) {
  if (!page || typeof page !== 'object' || Array.isArray(page)) {
    throw Object.assign(new Error('Page data must be an object.'), { statusCode: 400 })
  }
  if (!isEditablePagePath(page.path)) {
    throw Object.assign(new Error('Choose a supported website page.'), { statusCode: 400 })
  }
  if (typeof page.title !== 'string' || page.title.trim().length === 0 || page.title.length > 160) {
    throw Object.assign(new Error('Page title is required and must be 160 characters or fewer.'), { statusCode: 400 })
  }
  if (typeof page.description !== 'string' || page.description.length > 320) {
    throw Object.assign(new Error('Page description must be 320 characters or fewer.'), { statusCode: 400 })
  }
  if (!Array.isArray(page.sections) || page.sections.length > 30) {
    throw Object.assign(new Error('A page must contain no more than 30 sections.'), { statusCode: 400 })
  }

  const sections = page.sections.map((section, index) => {
    if (!section || typeof section !== 'object' || Array.isArray(section) || !allowedSectionTypes.has(section.type)) {
      throw Object.assign(new Error(`Section ${index + 1} has an unsupported type.`), { statusCode: 400 })
    }

    const values = {}
    for (const [key, value] of Object.entries(section)) {
      if (!['id', 'type', 'heading', 'body', 'eyebrow', 'imageUrl', 'imageAlt', 'buttonText', 'buttonUrl'].includes(key)) continue
      if (typeof value !== 'string' || value.length > 5000) {
        throw Object.assign(new Error(`Section ${index + 1} contains invalid text.`), { statusCode: 400 })
      }
      if (key === 'buttonUrl' && value && !isSafeLink(value)) {
        throw Object.assign(new Error(`Section ${index + 1} has an invalid button link.`), { statusCode: 400 })
      }
      if (key === 'imageUrl' && value && !isSafeLink(value)) {
        throw Object.assign(new Error(`Section ${index + 1} has an invalid image URL.`), { statusCode: 400 })
      }
      values[key] = value
    }

    function isSafeLink(value) {
      if (value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')) return true
      try {
        const url = new URL(value)
        return url.protocol === 'https:' || url.protocol === 'http:'
      } catch {
        return false
      }
    }

    values.id = typeof section.id === 'string' && section.id.length <= 80 ? section.id : `section-${index + 1}`
    values.type = section.type
    return values
  })

  const document = {
    path: page.path,
    title: page.title.trim(),
    description: page.description.trim(),
    published: page.published === true,
    sections,
    updatedAt: new Date(),
  }
  if (Buffer.byteLength(JSON.stringify(document)) > maximumPageBytes) {
    throw Object.assign(new Error('Page content is too large.'), { statusCode: 413 })
  }
  return document
}
