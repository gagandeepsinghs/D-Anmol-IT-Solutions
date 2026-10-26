const courseModuleTechnologies = {
  'computer-basics-office-productivity': [
    ['Windows'],
    ['Windows'],
    ['Microsoft Word'],
    ['Microsoft Excel'],
    ['Microsoft PowerPoint'],
    ['Microsoft Word', 'Microsoft Excel', 'Microsoft PowerPoint'],
  ],
  'computer-typing-government-exams': [
    ['Keyboarding practice'],
    ['Keyboarding practice', 'Timed typing exercises'],
    ['Timed typing exercises'],
    ['Timed typing exercises'],
    ['Keyboarding practice', 'Timed typing exercises'],
  ],
  'ai-machine-learning': [
    ['Python'],
    ['Python', 'Scikit-learn'],
    ['Python', 'Scikit-learn'],
    ['Scikit-learn'],
    ['Scikit-learn'],
    ['Python', 'TensorFlow', 'PyTorch'],
  ],
  'generative-ai': [
    ['Generative AI tools', 'LLM platforms'],
    ['Prompt design'],
    ['Generative AI tools', 'Prompt design'],
    ['LLM platforms'],
    ['Generative AI tools'],
    ['Generative AI tools', 'LLM platforms'],
  ],
  'data-analytics': [
    ['Spreadsheets'],
    ['Spreadsheets'],
    ['Data cleaning'],
    ['Data visualization'],
    ['Spreadsheets', 'Data visualization'],
  ],
  'python-programming': [
    ['Python'],
    ['Python'],
    ['Python'],
    ['Python'],
    ['Python'],
    ['Python'],
  ],
  'full-stack-web': [
    ['HTML'],
    ['CSS'],
    ['JavaScript'],
    ['React', 'JavaScript'],
    ['JavaScript'],
    ['HTML', 'CSS', 'JavaScript', 'React'],
  ],
  'ai-automation-n8n': [
    ['Workflow automation'],
    ['n8n'],
    ['n8n', 'Workflow automation'],
    ['n8n'],
    ['AI-assisted steps'],
    ['n8n', 'Workflow automation'],
  ],
  'digital-marketing': [
    ['Content planning'],
    ['Content planning', 'Social media'],
    ['Search fundamentals'],
    ['Social media'],
    ['Campaign measurement'],
    ['Content planning', 'Search fundamentals', 'Social media', 'Campaign measurement'],
  ],
  'corporate-training': [
    ['Programme topics agreed during discovery'],
    ['Programme topics agreed during discovery'],
    ['Programme topics agreed during discovery'],
    ['Programme topics agreed during discovery'],
  ],
  'python-django': [
    ['Python'],
    ['Python'],
    ['Python'],
    ['Django'],
    ['Django', 'HTML & CSS'],
    ['Python', 'Django'],
  ],
  'data-science-python': [
    ['Python', 'Pandas', 'NumPy'],
    ['Python', 'Pandas', 'NumPy'],
    ['NumPy', 'Pandas'],
    ['Pandas'],
    ['Python', 'Scikit-learn'],
    ['Python', 'Scikit-learn'],
  ],
  'generative-ai-llm': [
    ['Python', 'LLM APIs'],
    ['Prompt engineering'],
    ['Python', 'LLM APIs'],
    ['Python', 'LangChain'],
    ['LLM APIs'],
    ['Python', 'LangChain', 'LLM APIs'],
  ],
  'ai-agents-automation': [
    ['Python', 'LangChain'],
    ['Python', 'LangChain', 'APIs and tool calling'],
    ['Python', 'APIs and tool calling'],
    ['n8n'],
    ['LangChain', 'APIs and tool calling'],
    ['Python', 'LangChain', 'n8n'],
  ],
}

export function getModuleTechnologies(courseId, moduleIndex, courseTechnologies = [], moduleTitle = '') {
  if (courseId === 'ai-machine-learning' && moduleTitle === 'Neural-network foundations') {
    return ['TensorFlow', 'PyTorch'].filter((technology) => courseTechnologies.includes(technology))
  }
  const moduleTechnologies = courseModuleTechnologies[courseId]?.[moduleIndex]
  if (!moduleTechnologies) return courseTechnologies
  return moduleTechnologies.filter((technology) => courseTechnologies.includes(technology))
}
