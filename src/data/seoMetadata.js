import { publicAiPythonSlugs, publicCourseSlugs, publicSitePaths } from './publicSitePaths.js'

export const corePageSeo = {
  '/': {
    title: 'D-Anmol Academy | Practical Technology Training',
    description: 'Explore practical technology and digital skills courses at D-Anmol Academy. Online training across India; offline training targets Mohali, Chandigarh and Panchkula.',
  },
  '/courses': {
    title: 'Our Courses | D-Anmol Academy',
    description: 'Explore AI, data, Full Stack Development, digital marketing, computer and shorthand courses at D-Anmol Academy. Ask about course and demo availability.',
  },
  '/ai-python': {
    title: 'AI, Data & Automation Training | D-Anmol Academy',
    description: 'Explore AI, data and automation learning paths at D-Anmol Academy. Contact the academy to discuss course details, format and schedule.',
  },
  '/corporate-training': {
    title: 'Corporate Training | D-Anmol Academy',
    description: 'Discuss practical technology training for your team, online across India or offline in Mohali, Chandigarh and Panchkula.',
  },
  '/about': {
    title: 'About D-Anmol Academy | Practical IT Training',
    description: 'Learn about D-Anmol Academy and its practical technology and digital skills training for students, professionals and teams.',
  },
  '/contact': {
    title: 'Contact D-Anmol Academy | Course Enquiries',
    description: 'Contact D-Anmol Academy to ask about courses or request a demo. Call, email or WhatsApp the academy.',
  },
  '/faq': {
    title: 'FAQs | D-Anmol Academy Courses & Training',
    description: 'Find answers about D-Anmol Academy courses, learning formats, demos, fees and enquiries.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | D-Anmol Academy',
    description: 'Learn how D-Anmol Academy uses and stores information submitted through website enquiries.',
  },
  '/terms-and-conditions': {
    title: 'Terms and Conditions | D-Anmol Academy',
    description: 'Read the terms for using the D-Anmol Academy website and requesting course information or demos.',
  },
  '/refund-cancellation-policy': {
    title: 'Refund and Cancellation Policy | D-Anmol Academy',
    description: 'Find out how to contact D-Anmol Academy about enrolment cancellations and refund questions.',
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
  'data-science-python': 'Data Science',
  'ai-machine-learning': 'Artificial Intelligence and Machine Learning',
  'generative-ai-llm-development': 'Generative AI',
  'ai-agents-automation': 'AI Automation',
}

function courseDescription(title) {
  return `Explore ${title} at D-Anmol Academy. Ask about course and demo availability, including online learning or offline options in Mohali, Chandigarh and Panchkula.`
}

export const pageSeoByPath = {
  ...corePageSeo,
  ...Object.fromEntries(publicCourseSlugs.map((slug) => [
    `/courses/${slug}`,
    {
      title: `${courseTitles[slug]} | Courses | D-Anmol Academy`,
      description: courseDescription(courseTitles[slug]),
    },
  ])),
  ...Object.fromEntries(publicAiPythonSlugs.map((slug) => [
    `/ai-python/${slug}`,
    {
      title: `${aiPythonTitles[slug]} | AI Training | D-Anmol Academy`,
      description: courseDescription(aiPythonTitles[slug]),
    },
  ])),
}

if (Object.keys(pageSeoByPath).length !== publicSitePaths.length) {
  throw new Error('SEO metadata must be defined for every public site route')
}
