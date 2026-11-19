import { createCourseIllustration } from '../lib/courseIllustration'

const courseModuleImageOverrides = import.meta.glob(
  '../assets/images/courses/modules/*/*.{jpg,jpeg,png,webp}',
  { eager: true, query: '?url', import: 'default' },
)
const moduleImageExtensions = ['jpg', 'jpeg', 'png', 'webp']

const courseVisualDefaults = {
  AI_Automation: 'workflow',
  Artificial_Intelligence_Machine_Learning: 'ai',
  Computer_Basics_MS_Office: 'document',
  Computer_Typing: 'keyboard',
  Corporate_Training: 'team',
  Data_Analytics_Foundations: 'analytics',
  Digital_Marketing: 'marketing',
  Full_Stack_Web_Development: 'code',
  Generative_AI: 'ai',
  Python_Programming: 'code',
  Stenography_Shorthand: 'document',
}

function getModuleVisualType(folder, title) {
  const normalizedTitle = title.toLowerCase()

  if (/keyboard|finger|home row|top row|bottom row|typing|punctuation|timed practice|accuracy|speed/.test(normalizedTitle)) return 'keyboard'
  if (/shorthand|stenograph|pitman|dictation|transcription|outline/.test(normalizedTitle)) return 'document'
  if (/marketing|seo|social media|ads|campaign|copywriting|content strategy|creative|keyword|conversion/.test(normalizedTitle)) return 'marketing'
  if (/sql|database|relational|queries|joins/.test(normalizedTitle)) return 'database'
  if (/excel|spreadsheet|pivot|power query|dax|power bi|dashboard|reporting workflow/.test(normalizedTitle)) return 'spreadsheet'
  if (/analytics|statistics|visualisation|visualization|eda|data cleaning|data preparation|feature engineering|regression|classification|ensemble|model selection|unsupervised|business questions/.test(normalizedTitle)) return 'analytics'
  if (/webhook|api|http|automation|workflow|nodes|data flow|integration|error handling|reliability|process improvement|triggers/.test(normalizedTitle)) return 'workflow'
  if (/word|powerpoint|office|windows|file management|internet|email|document|presentation|productivity tools/.test(normalizedTitle)) return 'document'
  if (/react|html|css|javascript|dom|git|web fundamentals|web & internet|node\.js|express|routing|browser/.test(normalizedTitle)) return 'code'
  if (/corporate|collaboration|team|goal mapping|workshop|role-specific|department|quality practices/.test(normalizedTitle)) return 'team'
  if (/artificial intelligence|machine learning|deep learning|generative ai|prompt|llm|embeddings|rag|responsible ai|ai literacy|neural network/.test(normalizedTitle)) return 'ai'
  if (/python|programming|functions|variables|loops|object-oriented|testing|debugging|packages/.test(normalizedTitle)) return 'code'

  return courseVisualDefaults[folder] || 'code'
}

export function getCourseModuleImage(folder, index, moduleTitle = 'Course module') {
  const moduleNumber = String(index + 1).padStart(2, '0')
  const customImage = moduleImageExtensions
    .map((extension) => courseModuleImageOverrides[`../assets/images/courses/modules/${folder}/module-${moduleNumber}.${extension}`])
    .find(Boolean)

  if (customImage) return customImage
  return createCourseIllustration(moduleTitle, getModuleVisualType(folder, moduleTitle), index)
}

export function getCourseModuleImageUrl(folder, moduleNumber) {
  const params = new URLSearchParams({
    folder,
    module: String(moduleNumber).padStart(2, '0'),
  })
  return `/api/module-image?${params.toString()}`
}
