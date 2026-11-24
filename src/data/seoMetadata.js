import { publicAiPythonSlugs, publicCourseSlugs, publicSitePaths } from './publicSitePaths.js'

export const corePageSeo = {
  '/': {
    title: 'D-Anmol Enterprises | IT Courses & Skill Training',
    description: 'Learn AI, Full Stack Development, data, digital marketing and computer skills online across India or offline in Chandigarh, Mohali and Panchkula.',
  },
  '/courses': {
    title: 'IT and Computer Courses in Chandigarh, Mohali & Panchkula',
    description: 'Explore eight practical courses with online training across India and offline learning in Chandigarh, Mohali and Panchkula.',
  },
  '/ai-python': {
    title: 'AI, Data & Automation Courses Online in India',
    description: 'Explore AI, data and automation learning paths at D-Anmol Enterprises. Contact us to discuss format, schedule and offline availability.',
  },
  '/corporate-training': {
    title: 'Corporate IT Training | D-Anmol Enterprises',
    description: 'Discuss practical technology training for teams online across India or offline in Chandigarh, Mohali and Panchkula.',
  },
  '/about': {
    title: 'About D-Anmol Enterprises | IT Training Institute',
    description: 'Learn about D-Anmol Enterprises and its practical IT, computer and digital skills training for learners and professional teams.',
  },
  '/contact': {
    title: 'Contact D-Anmol Enterprises | Course Enquiries',
    description: 'Contact D-Anmol Enterprises to ask about courses or request a demo. Call, email or WhatsApp the team.',
  },
  '/faq': {
    title: 'FAQs | D-Anmol Enterprises Courses & Training',
    description: 'Find answers about D-Anmol Enterprises courses, learning formats, demos, fees and enquiries.',
  },
}

const courseTitles = {
  'computer-basics-ms-office': 'Computer Basics',
  'computer-typing-government-exams': 'Computer Typing',
  'artificial-intelligence-machine-learning': 'Artificial Intelligence and Machine Learning',
  'generative-ai-course-in-chandigarh': 'Generative AI',
  'ai-automation': 'AI Automation',
  'data-analytics': 'Data Analytics',
  'data-science': 'Data Science',
  'full-stack-development-course-in-chandigarh': 'Full Stack Development',
  'digital-marketing-course-in-chandigarh': 'Digital Marketing',
  'shorthand-stenography': 'Shorthand Stenography',
}

const aiPythonTitles = {
  'python-django': 'Python Programming and Django',
  'data-science-python': 'Data Science',
  'ai-machine-learning': 'Artificial Intelligence and Machine Learning',
  'generative-ai-llm-development': 'Generative AI',
  'ai-agents-automation': 'AI Automation',
}

export const courseSeo = {
  'ai-automation': {
    title: 'AI Automation Course Online in India | D-Anmol Enterprises',
    description: 'Learn AI automation with workflow tools, APIs and practical projects. Online training across India; offline classes subject to availability in Chandigarh, Mohali and Panchkula.',
  },
  'full-stack-development-course-in-chandigarh': {
    title: 'Full Stack Development Course in Chandigarh & Mohali',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js and MongoDB. Online across India or enquire for offline Full Stack classes in Chandigarh, Mohali and Panchkula.',
  },
  'data-analytics': {
    title: 'Data Analytics Course in Chandigarh, Mohali & Panchkula',
    description: 'Learn Excel, Python, data visualization and statistical analysis. Online course across India; offline options subject to availability in Chandigarh, Mohali and Panchkula.',
  },
  'data-science': {
    title: 'Data Science Course Online in India | D-Anmol Enterprises',
    description: 'Study Python, data preparation, machine learning and practical projects. Online training is available across India; enquire about offline batches in Chandigarh, Mohali and Panchkula.',
  },
  'computer-basics-ms-office': {
    title: 'Computer Basics Course for Government Exams | Chandigarh',
    description: 'Learn Windows, internet skills, Word, Excel and PowerPoint. Online across India; enquire about offline computer basics classes in Chandigarh, Mohali and Panchkula.',
  },
  'shorthand-stenography': {
    title: 'Shorthand Stenography Classes in Chandigarh & Panchkula',
    description: 'Learn Pitman shorthand, dictation, reading and transcription. Online training across India or enquire for offline shorthand classes in Chandigarh, Mohali and Panchkula.',
  },
  'computer-typing-government-exams': {
    title: 'Computer Typing Course for Government Exams | Chandigarh',
    description: 'Improve typing accuracy and pace with guided timed practice. Online course across India; offline availability can be confirmed in Chandigarh, Mohali and Panchkula.',
  },
  'digital-marketing-course-in-chandigarh': {
    title: 'Digital Marketing Course in Mohali & Chandigarh',
    description: 'Learn SEO, advertising, social media marketing and analytics with practical tasks. Online training across India; offline options subject to availability in Chandigarh, Mohali and Panchkula.',
  },
}

export const pageSeoByPath = {
  ...corePageSeo,
  ...Object.fromEntries(publicCourseSlugs.map((slug) => [
    `/courses/${slug}`,
    courseSeo[slug] || {
      title: `${courseTitles[slug]} Course | D-Anmol Enterprises`,
      description: `Explore ${courseTitles[slug]} training at D-Anmol Enterprises. Online across India; enquire about offline availability in Chandigarh, Mohali and Panchkula.`,
    },
  ])),
  ...Object.fromEntries(publicAiPythonSlugs.map((slug) => [
    `/ai-python/${slug}`,
    {
      title: `${aiPythonTitles[slug]} | AI Training | D-Anmol Enterprises`,
      description: `Explore ${aiPythonTitles[slug]} training at D-Anmol Enterprises. Online learning is available across India; enquire about offline availability in Chandigarh, Mohali and Panchkula.`,
    },
  ])),
}

if (Object.keys(pageSeoByPath).length !== publicSitePaths.length) {
  throw new Error('SEO metadata must be defined for every public site route')
}
