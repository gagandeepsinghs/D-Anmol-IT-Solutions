import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { AppDataContext } from './context/AppDataContext'
import { courses as defaultCourses } from './data/courses'
import { storageKeys } from './config/siteConfig'
import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'
import CourseDetailPage from './pages/CourseDetailPage'
import CorporatePage from './pages/CorporatePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import AdminPage from './pages/AdminPage'
import AiPythonPage from './pages/AiPythonPage'
import AiPythonCoursePage from './pages/AiPythonCoursePage'
import { aiPythonCourses } from './data/aiPythonCourses'
import FloatingActions from './components/FloatingActions'
import ScrollToTop from './components/ScrollToTop'

const titles = {
  '/': 'D-Anmol Enterprises | Practical Technology Training',
  '/courses': 'Courses | D-Anmol Enterprises',
  '/ai-python': 'AI & Python Training | D-Anmol Enterprises',
  '/corporate-training': 'Corporate Training | D-Anmol Enterprises',
  '/about': 'About Us | D-Anmol Enterprises',
  '/contact': 'Contact Us | D-Anmol Enterprises',
  '/admin': 'Demo Admin | D-Anmol Enterprises',
}

const descriptions = {
  '/': 'Practical technology training in AI, data analytics, programming and digital skills for individuals and teams.',
  '/courses': 'Explore practical technology and business skills courses from D-Anmol Enterprises.',
  '/ai-python': 'Explore practical Python, data science, machine learning, generative AI and automation training programmes at D-Anmol Enterprises.',
  '/corporate-training': 'Discuss practical, tailored AI, data analytics, programming and technology training for your team.',
  '/about': 'Learn about D-Anmol Enterprises and its practical approach to technology training.',
  '/contact': 'Contact D-Anmol Enterprises to ask about courses, team training and learning goals.',
  '/admin': 'Browser-only demo course and enquiry management for D-Anmol Enterprises.',
}

const legacyComputerBasicsTitle = 'Computer Basics, MS Office & Typing'
const legacyComputerBasicsSlug = 'computer-basics-ms-office-typing'
const legacyComputerBasicsDescription = 'Build everyday computer confidence with Windows and internet basics, Word documents, Excel spreadsheets, PowerPoint presentations and guided typing practice.'
const legacyComputerBasicsOverview = 'A beginner-friendly course for learning the practical computer skills used in study, office and everyday digital tasks. Start with files, folders, typing and online safety, then practice creating documents, spreadsheets and presentations using Microsoft Office applications.'

export default function App() {
  const [courseData, setCourseData] = useState(defaultCourses)
  const [enquiries, setEnquiries] = useState([])
  const [storageNotice, setStorageNotice] = useState('')
  const [storageReady, setStorageReady] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const notices = []
    try {
      const savedCourses = window.localStorage.getItem(storageKeys.courses)
      if (savedCourses !== null) {
        const parsed = JSON.parse(savedCourses)
        if (!Array.isArray(parsed)) throw new Error('Saved course data is not a list.')
        const catalogVersion = 'catalog-course-details-v5'
        const needsCatalogMigration = window.localStorage.getItem(storageKeys.courseCatalogVersion) !== catalogVersion
        const newlyAddedCourses = !needsCatalogMigration
          ? []
          : defaultCourses.filter((course) => (
            ['computer-basics-office-productivity', 'computer-typing-government-exams'].includes(course.id)
            && !parsed.some((savedCourse) => savedCourse.id === course.id)
          ))
        const migratedSavedCourses = parsed.map((savedCourse) => {
          if (['power-bi', 'sql-database'].includes(savedCourse.id)) return null
          let migratedCourse = savedCourse
          if (savedCourse.id === 'data-analytics' && needsCatalogMigration) {
            migratedCourse = {
              ...savedCourse,
              description: savedCourse.description.replace('spreadsheets, SQL, visualization', 'spreadsheets, data visualization'),
              modules: Array.isArray(savedCourse.modules)
                ? savedCourse.modules.filter((module) => !/sql/i.test(module && typeof module === 'object' ? module.title : module))
                : savedCourse.modules,
              skills: Array.isArray(savedCourse.skills)
                ? savedCourse.skills.filter((skill) => !/sql/i.test(skill))
                : savedCourse.skills,
            }
          }
          const defaultCourse = defaultCourses.find((course) => course.id === savedCourse.id)
          if (needsCatalogMigration && savedCourse.id === 'computer-basics-office-productivity' && defaultCourse) {
            migratedCourse = {
              ...migratedCourse,
              title: savedCourse.title === legacyComputerBasicsTitle ? defaultCourse.title : savedCourse.title,
              slug: savedCourse.slug === legacyComputerBasicsSlug ? defaultCourse.slug : savedCourse.slug,
              description: savedCourse.description === legacyComputerBasicsDescription ? defaultCourse.description : savedCourse.description,
              overview: savedCourse.overview === legacyComputerBasicsOverview ? defaultCourse.overview : savedCourse.overview,
              modules: Array.isArray(savedCourse.modules)
                ? savedCourse.modules.filter((module) => (
                (module && typeof module === 'object' ? module.title : module) !== 'Keyboard and typing practice'
                ))
                : savedCourse.modules,
              skills: Array.isArray(savedCourse.skills)
                ? savedCourse.skills.filter((skill) => skill !== 'Keyboard and typing fundamentals')
                : savedCourse.skills,
            }
          }
          if (!needsCatalogMigration || !defaultCourse) return migratedCourse
          return {
            ...migratedCourse,
            overview: migratedCourse.overview || defaultCourse.overview,
            suitableFor: migratedCourse.suitableFor || defaultCourse.suitableFor,
            level: migratedCourse.level || defaultCourse.level,
            technologies: migratedCourse.technologies?.length ? migratedCourse.technologies : defaultCourse.technologies,
            outcomes: migratedCourse.outcomes?.length ? migratedCourse.outcomes : defaultCourse.outcomes,
            prerequisites: migratedCourse.prerequisites || defaultCourse.prerequisites,
            modules: migratedCourse.modules?.length ? migratedCourse.modules : defaultCourse.modules,
            skills: migratedCourse.skills?.length ? migratedCourse.skills : defaultCourse.skills,
            projects: migratedCourse.projects?.length ? migratedCourse.projects : defaultCourse.projects,
          }
        }).filter(Boolean)
        const migratedCourses = [...migratedSavedCourses, ...newlyAddedCourses]
        const catalogueChanged = JSON.stringify(parsed) !== JSON.stringify(migratedCourses)
        if (catalogueChanged) {
          try {
            window.localStorage.setItem(storageKeys.courses, JSON.stringify(migratedCourses))
          } catch {
            notices.push('The updated demo course catalogue could not be saved to this browser.')
          }
        }
        setCourseData(migratedCourses)
        if (window.localStorage.getItem(storageKeys.courseCatalogVersion) !== catalogVersion) {
          try {
            window.localStorage.setItem(storageKeys.courseCatalogVersion, catalogVersion)
          } catch {
            notices.push('The demo course catalogue update could not be saved for future visits.')
          }
        }
      } else {
        try {
          window.localStorage.setItem(storageKeys.courseCatalogVersion, 'catalog-course-details-v5')
        } catch {
          notices.push('The demo course catalogue version could not be saved for future visits.')
        }
      }
    } catch {
      notices.push('Saved demo course data could not be read. Default course data is being shown.')
    }
    try {
      const savedEnquiries = window.localStorage.getItem(storageKeys.enquiries)
      if (savedEnquiries !== null) {
        const parsed = JSON.parse(savedEnquiries)
        if (!Array.isArray(parsed)) throw new Error('Saved enquiry data is not a list.')
        setEnquiries(parsed)
      }
    } catch {
      notices.push('Saved demo enquiries could not be read.')
    }
    setStorageNotice(notices.join(' '))
    setStorageReady(true)
  }, [])

  useEffect(() => {
    if (!storageReady) return
    try {
      window.localStorage.setItem(storageKeys.courses, JSON.stringify(courseData))
    } catch {
      setStorageNotice('This browser could not save demo course changes. Your current page may show changes until it is refreshed.')
    }
  }, [courseData, storageReady])

  useEffect(() => {
    if (!storageReady) return
    try {
      window.localStorage.setItem(storageKeys.enquiries, JSON.stringify(enquiries))
    } catch {
      setStorageNotice('This browser could not save demo enquiries. No enquiry has been sent.')
    }
  }, [enquiries, storageReady])

  useEffect(() => {
    const aiCourse = location.pathname.startsWith('/ai-python/')
      ? aiPythonCourses.find((course) => course.slug === location.pathname.split('/').pop())
      : null
    const mainCourse = location.pathname.startsWith('/courses/')
      ? courseData.find((course) => course.slug === location.pathname.split('/').pop())
      : null
    const title = aiCourse
      ? `${aiCourse.title} | AI & Python Training | D-Anmol Enterprises`
      : mainCourse
        ? `${mainCourse.title} | Courses | D-Anmol Enterprises`
        : titles[location.pathname] || (location.pathname.startsWith('/courses/') ? 'Course details | D-Anmol Enterprises' : 'Page not found | D-Anmol Enterprises')
    document.title = title
    const description = aiCourse
      ? `${aiCourse.description} Explore the course outline, learning outcomes and project ideas at D-Anmol Enterprises.`
      : mainCourse
        ? `${mainCourse.description} Explore the course overview, curriculum and learning outcomes at D-Anmol Enterprises.`
        : descriptions[location.pathname] || 'Explore practical technology training programmes from D-Anmol Enterprises.'
    const descriptionTag = document.querySelector('meta[name="description"]')
    if (descriptionTag) descriptionTag.setAttribute('content', description)
    window.scrollTo(0, 0)
  }, [location.pathname, courseData])

  const addEnquiry = (enquiry) => {
    const next = [...enquiries, enquiry]
    window.localStorage.setItem(storageKeys.enquiries, JSON.stringify(next))
    setEnquiries(next)
  }
  const contextValue = useMemo(() => ({ courses: courseData, setCourses: setCourseData, enquiries, addEnquiry, storageNotice }), [courseData, enquiries, storageNotice])

  return (
    <AppDataContext.Provider value={contextValue}>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/computer-basics-ms-office-typing" element={<Navigate to="/courses/computer-basics-ms-office" replace />} />
          <Route path="/courses/:slug" element={<CourseDetailPage />} />
          <Route path="/ai-python" element={<AiPythonPage />} />
          <Route path="/ai-python/:slug" element={<AiPythonCoursePage />} />
          <Route path="/corporate-training" element={<CorporatePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <FloatingActions />
      <ScrollToTop />
    </AppDataContext.Provider>
  )
}

function NotFound() {
  return <section className="not-found page-wrap"><span className="eyebrow">404 · Page not found</span><h1>This page went off the learning path.</h1><p>Let’s get you back to somewhere useful.</p><Link className="button button-primary" to="/">Back to home</Link></section>
}
