import { getModuleImageCollection } from './moduleImageStore.js'

const maximumContentBytes = 1024 * 1024
const maximumCourseImageLength = 25_000
const contentKeys = new Set(['settings', 'courses', 'aiPythonCourses', 'faqs', 'courseSyllabi'])

export async function getSiteContentCollection() {
  return (await getModuleImageCollection()).db.collection('siteContent')
}

export function validateSiteContent(content) {
  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    throw Object.assign(new Error('Website content must be an object.'), { statusCode: 400 })
  }
  for (const key of Object.keys(content)) {
    if (!contentKeys.has(key)) throw Object.assign(new Error(`Unsupported content section: ${key}.`), { statusCode: 400 })
  }

  if (content.settings !== undefined) {
    if (!content.settings || typeof content.settings !== 'object' || Array.isArray(content.settings)
      || Object.values(content.settings).some((value) => typeof value !== 'string' || value.length > 2000)) {
      throw Object.assign(new Error('Website settings must contain text values of no more than 2,000 characters.'), { statusCode: 400 })
    }
  }
  if (content.courses !== undefined) validateCatalog(content.courses, 'courses', 'modules')
  if (content.aiPythonCourses !== undefined) validateCatalog(content.aiPythonCourses, 'AI and Python courses', 'curriculum')
  if (content.faqs !== undefined) validateArray(content.faqs, 'FAQs', ['question', 'answer'])
  if (content.courseSyllabi !== undefined) validateCourseSyllabi(content.courseSyllabi)

  if (Buffer.byteLength(JSON.stringify(content)) > maximumContentBytes) {
    throw Object.assign(new Error('Website content is too large.'), { statusCode: 413 })
  }
  return content
}

function validateArray(values, label, requiredStringFields) {
  if (!Array.isArray(values) || values.length > 200) {
    throw Object.assign(new Error(`${label} must be a list with no more than 200 items.`), { statusCode: 400 })
  }
  values.forEach((value, index) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)
      || requiredStringFields.some((field) => typeof value[field] !== 'string'
        || !value[field].trim() || value[field].length > 5000)) {
      throw Object.assign(new Error(`${label} item ${index + 1} is invalid.`), { statusCode: 400 })
    }
  })
}

function validateCatalog(values, label, curriculumKey) {
  validateArray(values, label, ['id', 'slug', 'title'])
  const ids = new Set()
  const slugs = new Set()
  values.forEach((value, index) => {
    if (ids.has(value.id) || slugs.has(value.slug)) {
      throw Object.assign(new Error(`${label} contains a duplicate ID or slug.`), { statusCode: 400 })
    }
    ids.add(value.id)
    slugs.add(value.slug)
    if (!Array.isArray(value[curriculumKey]) || !Array.isArray(value.technologies)
      || !Array.isArray(value.outcomes) || !Array.isArray(value.projects)) {
      throw Object.assign(new Error(`${label} item ${index + 1} must include its curriculum, technologies, outcomes, and projects lists.`), { statusCode: 400 })
    }
    if (value.image !== undefined && (typeof value.image !== 'string' || value.image.length > maximumCourseImageLength)) {
      throw Object.assign(new Error(`${label} item ${index + 1} has an invalid image.`), { statusCode: 400 })
    }
    if (value[curriculumKey].some((module) => !module || typeof module !== 'object' || typeof module.title !== 'string' || typeof module.description !== 'string')) {
      throw Object.assign(new Error(`${label} item ${index + 1} has an invalid curriculum.`), { statusCode: 400 })
    }
    if (value.technologies.some((item) => typeof item !== 'string')
      || value.outcomes.some((item) => typeof item !== 'string')
      || (value.skills && (!Array.isArray(value.skills) || value.skills.some((item) => typeof item !== 'string')))) {
      throw Object.assign(new Error(`${label} item ${index + 1} contains invalid list values.`), { statusCode: 400 })
    }
    if (curriculumKey === 'modules' && value.projects.some((item) => typeof item !== 'string')) {
      throw Object.assign(new Error(`${label} item ${index + 1} has invalid project names.`), { statusCode: 400 })
    }
    if (curriculumKey === 'curriculum' && value.projects.some((item) => !item || typeof item !== 'object' || typeof item.title !== 'string' || typeof item.description !== 'string')) {
      throw Object.assign(new Error(`${label} item ${index + 1} has invalid project details.`), { statusCode: 400 })
    }
  })
}

function validateCourseSyllabi(courseSyllabi) {
  if (!courseSyllabi || typeof courseSyllabi !== 'object' || Array.isArray(courseSyllabi)
    || Object.keys(courseSyllabi).length > 200) {
    throw Object.assign(new Error('Course modules must be a valid course list.'), { statusCode: 400 })
  }

  for (const [courseId, syllabus] of Object.entries(courseSyllabi)) {
    if (courseId.length > 80 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(courseId)
      || !syllabus || typeof syllabus !== 'object' || Array.isArray(syllabus)
      || !Array.isArray(syllabus.modules) || syllabus.modules.length > 99
      || !Array.isArray(syllabus.workflow) || syllabus.workflow.length > 12
      || !Array.isArray(syllabus.buildItems) || syllabus.buildItems.length > 100
      || (syllabus.nextModuleNumber !== undefined
        && (!Number.isInteger(syllabus.nextModuleNumber) || syllabus.nextModuleNumber < 1 || syllabus.nextModuleNumber > 100))) {
      throw Object.assign(new Error(`Course modules for ${courseId} are invalid.`), { statusCode: 400 })
    }

    const moduleNumbers = new Set()
    syllabus.modules.forEach((module, index) => {
      if (!module || typeof module !== 'object' || Array.isArray(module)
        || !Number.isInteger(module.number) || module.number < 1 || module.number > 99
        || moduleNumbers.has(module.number)
        || typeof module.title !== 'string' || !module.title.trim() || module.title.length > 240
        || typeof module.activity !== 'string' || module.activity.length > 2000
        || !Array.isArray(module.topics) || module.topics.length > 30
        || module.topics.some((topic) => typeof topic !== 'string' || topic.length > 240)) {
        throw Object.assign(new Error(`Module ${index + 1} for ${courseId} is invalid.`), { statusCode: 400 })
      }
      moduleNumbers.add(module.number)
    })

    const nextModuleNumber = syllabus.nextModuleNumber
      || (moduleNumbers.size ? Math.max(...moduleNumbers) + 1 : 1)
    if (nextModuleNumber <= Math.max(0, ...moduleNumbers)) {
      throw Object.assign(new Error(`The next module number for ${courseId} is invalid.`), { statusCode: 400 })
    }

    for (const value of [...syllabus.workflow, ...syllabus.buildItems]) {
      if (typeof value !== 'string' || value.length > 1000) {
        throw Object.assign(new Error(`Course details for ${courseId} contain invalid text.`), { statusCode: 400 })
      }
    }
  }
}
