import { lazy, startTransition, Suspense, useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { AppDataContext } from './context/AppDataContext'
import {
  courses as defaultCourses,
  filterRetiredCourses,
  filterRetiredCourseSyllabi,
  includeNewDefaultCourses,
  retiredCourseIds,
} from './data/courses'
import { aiPythonCourses as defaultAiPythonCourses, publicAiPythonCourseIds } from './data/aiPythonCourses'
import { siteConfig } from './config/siteConfig'
const HomePage = lazy(() => import('./pages/HomePage'))
const CoursesPage = lazy(() => import('./pages/CoursesPage'))
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'))
const CorporatePage = lazy(() => import('./pages/CorporatePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const FaqPage = lazy(() => import('./pages/FaqPage'))
const AiPythonPage = lazy(() => import('./pages/AiPythonPage'))
const AiPythonCoursePage = lazy(() => import('./pages/AiPythonCoursePage'))
import { pageSeoByPath } from './data/seoMetadata'
import NotFoundPage from './pages/NotFoundPage'
import AdminPage from './pages/AdminPage'
import FloatingActions from './components/FloatingActions'
import ScrollToTop from './components/ScrollToTop'
import ManagedPage from './components/ManagedPage'
import { getBreadcrumbSchema, getCourseFaqSchema, getCourseSchema, getOrganizationSchema, getWebsiteSchema, preferredOrigin, removeStructuredData, setStructuredData } from './lib/seo'

function setMeta(attribute, key, content) {
  const selector = `meta[${attribute}="${key}"]`
  let meta = document.querySelector(selector)
  if (content === null) {
    meta?.remove()
    return
  }
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attribute, key)
    document.head.append(meta)
  }
  meta.setAttribute('content', content)
}

function isRetiredCoursePath(path) {
  const [section, slug] = path.split('/').filter(Boolean)
  return section === 'courses' && retiredCourseIds.has(slug)
}

export default function App() {
  const location = useLocation()
  const [managedPages, setManagedPages] = useState({})
  const [siteContent, setSiteContent] = useState({})

  useEffect(() => {
    let active = true
    const loadPages = () => fetch('/api/site-pages', { credentials: 'same-origin' })
      .then(async (response) => {
        const result = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(result.error || 'Unable to load managed pages.')
        return result.pages || []
      })
      .then((pages) => {
        if (active) startTransition(() => setManagedPages(Object.fromEntries(pages.map((page) => [page.path, page]))))
      })
      .catch((error) => {
        if (active) console.error('Managed page loading failed:', error)
      })
    loadPages()
    window.addEventListener('managed-pages-updated', loadPages)
    return () => {
      active = false
      window.removeEventListener('managed-pages-updated', loadPages)
    }
  }, [])

  useEffect(() => {
    let active = true
    const loadContent = () => fetch('/api/site-content', { credentials: 'same-origin' })
      .then(async (response) => {
        const result = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(result.error || 'Unable to load managed website content.')
        return result.content || {}
      })
      .then((content) => {
        if (active) startTransition(() => setSiteContent(content))
      })
      .catch((error) => {
        if (active) console.error('Managed website content loading failed:', error)
      })
    loadContent()
    window.addEventListener('managed-content-updated', loadContent)
    return () => {
      active = false
      window.removeEventListener('managed-content-updated', loadContent)
    }
  }, [])

  useEffect(() => {
    const routeSeo = pageSeoByPath[location.pathname]
    const managedPage = isRetiredCoursePath(location.pathname) ? null : managedPages[location.pathname]
    const isAdminRoute = location.pathname === '/admin'
    const aiCourseSource = location.pathname.startsWith('/ai-python/')
      ? (siteContent.aiPythonCourses || defaultAiPythonCourses).find((course) => course.slug === location.pathname.split('/').pop())
      : null
    const currentCourses = filterRetiredCourses(includeNewDefaultCourses(siteContent.courses || defaultCourses))
    const aiCatalogCourse = aiCourseSource && currentCourses.find((course) => course.id === publicAiPythonCourseIds[aiCourseSource.id])
    const aiCourse = aiCourseSource ? { ...aiCourseSource, title: aiCatalogCourse?.title || aiCourseSource.title } : null
    const mainCourse = location.pathname.startsWith('/courses/')
      ? currentCourses.find((course) => course.slug === location.pathname.split('/').pop() && course.published !== false)
      : null
    const isPublicRoute = Boolean(routeSeo || managedPage || aiCourse || mainCourse)
    const title = isAdminRoute
      ? 'Admin | D-Anmol Enterprises'
      : managedPage
      ? managedPage.title
      : !isPublicRoute
      ? 'Page not found | D-Anmol Enterprises'
      : aiCourse
        ? `${aiCourse.title} | AI Training | D-Anmol Enterprises`
      : mainCourse
        ? `${mainCourse.title} | Courses | D-Anmol Enterprises`
        : routeSeo.title
    document.title = title
    const description = isAdminRoute
      ? 'Manage website pages and content.'
      : managedPage
      ? managedPage.description
      : !isPublicRoute
      ? 'This page could not be found. Explore D-Anmol Enterprises courses or contact the team.'
      : aiCourse
        ? aiCourse.description
        : mainCourse
          ? mainCourse.description
          : routeSeo.description
    const siteOrigin = preferredOrigin
    const canonicalUrl = isPublicRoute ? `${preferredOrigin}${location.pathname === '/' ? '/' : location.pathname.replace(/\/+$/, '')}` : null
    setMeta('name', 'description', description)
    setMeta('name', 'robots', isPublicRoute ? 'index,follow,max-image-preview:large' : 'noindex,follow')
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', canonicalUrl)
    const currentSettings = { ...siteConfig, ...siteContent.settings }
    setMeta('property', 'og:image', new URL(currentSettings.logo, siteOrigin).href)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', new URL(currentSettings.logo, siteOrigin).href)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', 'D-Anmol Enterprises')
    setMeta('property', 'og:locale', 'en_IN')
    setStructuredData('organization-schema', getOrganizationSchema())
    setStructuredData('website-schema', getWebsiteSchema())
    if (isPublicRoute) {
      setStructuredData('breadcrumb-schema', getBreadcrumbSchema(location.pathname, mainCourse?.title || aiCourse?.title || title))
    } else {
      removeStructuredData('breadcrumb-schema')
    }
    if (mainCourse) {
      setStructuredData('course-schema', getCourseSchema(mainCourse, location.pathname))
      const faqSchema = getCourseFaqSchema(mainCourse, location.pathname)
      if (faqSchema) setStructuredData('course-faq-schema', faqSchema)
      else removeStructuredData('course-faq-schema')
    } else if (aiCourse) {
      setStructuredData('course-schema', getCourseSchema(aiCourse, location.pathname))
    } else {
      removeStructuredData('course-schema')
      removeStructuredData('course-faq-schema')
    }
    let canonical = document.querySelector('link[rel="canonical"]')
    if (canonicalUrl) {
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.append(canonical)
      }
      canonical.href = canonicalUrl
    } else {
      canonical?.remove()
    }
    window.scrollTo(0, 0)
  }, [location.pathname, managedPages, siteContent])

  const contextValue = useMemo(() => ({
    courses: filterRetiredCourses(includeNewDefaultCourses(siteContent.courses || defaultCourses)),
    aiPythonCourses: siteContent.aiPythonCourses || defaultAiPythonCourses,
    courseSyllabi: filterRetiredCourseSyllabi(siteContent.courseSyllabi || {}),
    faqs: siteContent.faqs || null,
    siteSettings: { ...siteConfig, ...siteContent.settings },
  }), [siteContent])
  const managedPage = isRetiredCoursePath(location.pathname) ? null : managedPages[location.pathname]

  return (
    <AppDataContext.Provider value={contextValue}>
      {location.pathname !== '/admin' && <Header />}
      <main>
        {managedPage
          ? <ManagedPage page={managedPage} />
          : <Suspense fallback={<div className="page-wrap" aria-live="polite">Loading…</div>}><Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/computer-basics-ms-office-typing" element={<Navigate to="/courses/computer-basics-ms-office" replace />} />
          <Route path="/courses/data-science-with-python-course-in-chandigarh" element={<Navigate to="/courses/data-analytics" replace />} />
          <Route path="/courses/artificial-intelligence-course-in-chandigarh" element={<Navigate to="/courses/artificial-intelligence-machine-learning" replace />} />
          <Route path="/courses/machine-learning-course-in-chandigarh" element={<Navigate to="/courses/artificial-intelligence-machine-learning" replace />} />
          <Route path="/courses/:slug" element={<CourseDetailPage />} />
          <Route path="/ai-python" element={<AiPythonPage />} />
          <Route path="/ai-python/:slug" element={<AiPythonCoursePage />} />
          <Route path="/corporate-training" element={<CorporatePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="*" element={<NotFoundPage />} />
          </Routes></Suspense>}
      </main>
      {location.pathname !== '/admin' && <FloatingActions />}
      {location.pathname !== '/admin' && <Footer />}
      <ScrollToTop />
    </AppDataContext.Provider>
  )
}
