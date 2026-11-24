export const corePublicPaths = [
  '/',
  '/courses',
  '/ai-python',
  '/corporate-training',
  '/about',
  '/contact',
  '/faq',
]

export const publicCourseSlugs = [
  'computer-basics-ms-office',
  'computer-typing-government-exams',
  'artificial-intelligence-machine-learning',
  'generative-ai-course-in-chandigarh',
  'ai-automation',
  'data-analytics',
  'data-science',
  'full-stack-development-course-in-chandigarh',
  'digital-marketing-course-in-chandigarh',
  'shorthand-stenography',
]

export const publicAiPythonSlugs = [
  'python-django',
  'data-science-python',
  'ai-machine-learning',
  'generative-ai-llm-development',
  'ai-agents-automation',
]

export const publicSitePaths = [
  ...corePublicPaths,
  ...publicCourseSlugs.map((slug) => `/courses/${slug}`),
  ...publicAiPythonSlugs.map((slug) => `/ai-python/${slug}`),
]

export const legacyRedirects = {
  '/courses/computer-basics-ms-office-typing': '/courses/computer-basics-ms-office',
  '/courses/data-science-with-python-course-in-chandigarh': '/courses/data-analytics',
  '/courses/artificial-intelligence-course-in-chandigarh': '/courses/artificial-intelligence-machine-learning',
  '/courses/machine-learning-course-in-chandigarh': '/courses/artificial-intelligence-machine-learning',
}
