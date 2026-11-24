export const preferredOrigin = 'https://www.danmolenterprises.com'

export function setStructuredData(id, data) {
  if (typeof document === 'undefined') return
  let script = document.getElementById(id)
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = id
    document.head.append(script)
  }
  script.textContent = JSON.stringify(data)
}

export function removeStructuredData(id) {
  if (typeof document === 'undefined') return
  document.getElementById(id)?.remove()
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'EducationalOrganization'],
    '@id': `${preferredOrigin}/#organization`,
    name: 'D-Anmol Enterprises',
    url: preferredOrigin,
    email: 'danmolenterprises6@gmail.com',
    telephone: '+919289337268',
    areaServed: [
      { '@type': 'City', name: 'Chandigarh' },
      { '@type': 'City', name: 'Mohali' },
      { '@type': 'City', name: 'Panchkula' },
      { '@type': 'Country', name: 'India' },
    ],
  }
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${preferredOrigin}/#website`,
    url: preferredOrigin,
    name: 'D-Anmol Enterprises',
    publisher: { '@id': `${preferredOrigin}/#organization` },
  }
}

export function getBreadcrumbSchema(pathname, title) {
  const items = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: preferredOrigin },
  ]
  if (pathname.startsWith('/courses/') || pathname === '/courses') {
    items.push({ '@type': 'ListItem', position: 2, name: 'Courses', item: `${preferredOrigin}/courses` })
  }
  if (pathname.startsWith('/courses/')) {
    items.push({ '@type': 'ListItem', position: 3, name: title, item: `${preferredOrigin}${pathname}` })
  }
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items }
}

export function getCourseSchema(course, pathname) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    url: `${preferredOrigin}${pathname}`,
    provider: { '@id': `${preferredOrigin}/#organization` },
    educationalLevel: course.level || 'Beginner to intermediate',
  }
}

export const courseFaqs = {
  'ai-automation': [
    ['Is AI automation suitable for beginners?', 'The course starts with process mapping and workflow fundamentals. Basic computer familiarity is helpful; prior automation experience is not required.'],
    ['Can this course be taken online?', 'Yes, online training is available across India. Offline availability can be confirmed for Chandigarh, Mohali and Panchkula.'],
  ],
  'full-stack-development-course-in-chandigarh': [
    ['Does the Full Stack course start at beginner level?', 'The course plan is designed for learners progressing from web fundamentals into React, server-side development and databases. Confirm your current level before enrolment.'],
    ['Is Full Stack training available online?', 'Yes, online training is available across India. Enquire about offline batch availability in Chandigarh, Mohali and Panchkula.'],
  ],
  'data-analytics': [
    ['What should I learn in a Data Analytics course?', 'The learning plan covers Python, data cleaning, exploration, visualization and introductory statistical and machine-learning concepts.'],
    ['Can I study Data Analytics online?', 'Yes, online training is available across India. Offline classes may be available in Chandigarh, Mohali or Panchkula; confirm the current schedule.'],
  ],
  'data-science': [
    ['Is prior programming experience needed for Data Science?', 'Some basic computer familiarity is useful. Your existing Python knowledge can be assessed so the starting point is clear.'],
    ['Is Data Science training available online in India?', 'Yes. Online Data Science training is available across India, with offline enquiry options in Chandigarh, Mohali and Panchkula.'],
  ],
  'computer-basics-ms-office': [
    ['Is this course suitable for government-exam preparation?', 'It covers practical computer fundamentals commonly used in office and exam settings, including files, Word, Excel and PowerPoint. Always follow the requirements published for the target exam.'],
    ['Are Computer Basics classes available nearby?', 'Enquire about offline classes in Chandigarh, Mohali or Panchkula. Online training is available across India.'],
  ],
  'computer-typing-government-exams': [
    ['Does the typing course guarantee a government-exam result?', 'No. It provides guided practice, error review and timed drills. Eligibility and test speed requirements come from the specific published exam notification.'],
    ['Can I learn typing online?', 'Yes, online training is available across India. Offline availability can be confirmed in Chandigarh, Mohali and Panchkula.'],
  ],
  'shorthand-stenography': [
    ['What shorthand method is taught?', 'The course outline covers Pitman shorthand principles, followed by reading, dictation, note-taking and transcription practice.'],
    ['Are shorthand classes available in Panchkula?', 'Enquire for current offline availability in Chandigarh, Mohali and Panchkula. Online training is available across India.'],
  ],
  'digital-marketing-course-in-chandigarh': [
    ['Which digital marketing skills are covered?', 'The course includes SEO, advertising, social media, analytics and reporting with practical campaign exercises.'],
    ['Is this course available as an online course in India?', 'Yes. Online training is available across India, and offline availability may be confirmed in Chandigarh, Mohali or Panchkula.'],
  ],
}

export function getCourseFaqSchema(course, pathname) {
  const faqs = courseFaqs[course.slug]
  if (!faqs) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([name, acceptedAnswer]) => ({
      '@type': 'Question',
      name,
      acceptedAnswer: { '@type': 'Answer', text: acceptedAnswer },
    })),
  }
}
