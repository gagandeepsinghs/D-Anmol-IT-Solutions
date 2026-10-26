import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowRight, BookOpenText, Bot, BriefcaseBusiness, Building2, ChartNoAxesCombined, ChevronDown, Code2, GraduationCap, Keyboard, Lightbulb, Menu, Sparkles, Workflow, X } from 'lucide-react'
import { siteConfig } from '../config/siteConfig'
import { Button } from './Button'
import { useAppData } from '../context/AppDataContext'

const linksBeforeCourses = [{ to: '/', label: 'Home' }]
const linksAfterCourses = [
  { to: '/corporate-training', label: 'Corporate training' },
  { to: '/about', label: 'About us' },
  { to: '/contact', label: 'Contact' },
]

const courseIcons = [BookOpenText, Keyboard, Bot, Sparkles, ChartNoAxesCombined, Code2, Code2, Workflow, Lightbulb, BriefcaseBusiness]
const trainingOptions = [
  { title: 'Industrial Training', description: 'Practical technology training with guided exercises and project work.', icon: Building2 },
  { title: '6 Weeks Summer Training', description: 'A short-term training option for students; schedule and topics are confirmed on enquiry.', icon: Building2 },
  { title: 'Internship', description: 'Explore a project-based learning experience; availability and format are discussed with you.', icon: BriefcaseBusiness },
  { title: 'Diploma Course', description: 'Build skills through a longer learning programme; curriculum and duration depend on the selected subject.', icon: GraduationCap },
  { title: 'Career Course', description: 'Develop practical skills around your learning and career goals. Outcomes and opportunities are not guaranteed.', icon: BookOpenText },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [coursesOpen, setCoursesOpen] = useState(false)
  const [trainingOpen, setTrainingOpen] = useState(false)
  const { courses } = useAppData()
  const location = useLocation()
  const menuRef = useRef(null)
  const trainingMenuRef = useRef(null)
  const isCoursesActive = location.pathname === '/courses' || location.pathname.startsWith('/courses/')
  const closeMenu = () => setOpen(false)

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setCoursesOpen(false)
      if (trainingMenuRef.current && !trainingMenuRef.current.contains(event.target)) setTrainingOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setCoursesOpen(false)
        setTrainingOpen(false)
      }
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  const toggleCourses = () => {
    setTrainingOpen(false)
    if (window.matchMedia('(hover: hover)').matches) setCoursesOpen(true)
    else setCoursesOpen((current) => !current)
  }
  const toggleTraining = () => {
    setCoursesOpen(false)
    if (window.matchMedia('(hover: hover)').matches) setTrainingOpen(true)
    else setTrainingOpen((current) => !current)
  }
  const closeNavigation = () => {
    setCoursesOpen(false)
    setTrainingOpen(false)
    closeMenu()
  }
  const openCoursesOnHover = () => {
    if (window.matchMedia('(hover: hover)').matches) setCoursesOpen(true)
  }
  const closeCoursesOnLeave = () => {
    if (window.matchMedia('(hover: hover)').matches) setCoursesOpen(false)
  }
  const openTrainingOnHover = () => {
    if (window.matchMedia('(hover: hover)').matches) {
      setCoursesOpen(false)
      setTrainingOpen(true)
    }
  }
  const closeTrainingOnLeave = () => {
    if (window.matchMedia('(hover: hover)').matches) setTrainingOpen(false)
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="D-Anmol Enterprises home" onClick={closeNavigation}>
          <img src={siteConfig.compactLogo} alt="D-Anmol Enterprises" />
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          onClick={() => { setOpen(!open); setCoursesOpen(false); setTrainingOpen(false) }}
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
        <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
          {linksBeforeCourses.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeNavigation}
            >
              {link.label}
            </NavLink>
          ))}
          <div
            className={`courses-nav-item ${coursesOpen ? 'courses-menu-open' : ''}`}
            ref={menuRef}
            onMouseEnter={openCoursesOnHover}
            onMouseLeave={closeCoursesOnLeave}
          >
            <button
              className={`nav-link courses-menu-trigger ${isCoursesActive ? 'active' : ''}`}
              type="button"
              aria-expanded={coursesOpen}
              aria-controls="courses-mega-menu"
              onClick={toggleCourses}
            >
              Courses <ChevronDown size={15} aria-hidden="true" />
            </button>
            {coursesOpen && (
              <div className="courses-mega-menu" id="courses-mega-menu">
                <div className="courses-mega-heading">
                  <h2>Explore our courses</h2>
                  <Link to="/courses" onClick={closeNavigation}>View all courses <ArrowRight size={15} /></Link>
                </div>
                <div className="courses-mega-grid">
                  {courses.filter((course) => course.published !== false).map((course, index) => {
                    const Icon = courseIcons[index % courseIcons.length]
                    return (
                      <Link className="courses-mega-item" to={`/courses/${course.slug}`} key={course.id} onClick={closeNavigation}>
                        <span className="courses-mega-icon"><Icon size={20} aria-hidden="true" /></span>
                        <span className="courses-mega-copy"><strong>{course.title}</strong><small>{course.description}</small></span>
                        <ArrowRight className="courses-mega-arrow" size={16} aria-hidden="true" />
                      </Link>
                    )
                  })}
                </div>
                <div className="courses-mega-footer">
                  <span>Not sure where to begin?</span>
                  <Link to="/contact" onClick={closeNavigation}>Talk to an advisor <ArrowRight size={15} /></Link>
                </div>
              </div>
            )}
          </div>
          <div
            className={`courses-nav-item training-nav-item ${trainingOpen ? 'courses-menu-open' : ''}`}
            ref={trainingMenuRef}
            onMouseEnter={openTrainingOnHover}
            onMouseLeave={closeTrainingOnLeave}
          >
            <button
              className={`nav-link courses-menu-trigger training-menu-trigger ${location.pathname === '/ai-python' ? 'active' : ''}`}
              type="button"
              aria-expanded={trainingOpen}
              aria-controls="training-menu"
              onClick={toggleTraining}
            >
              Training <ChevronDown size={15} aria-hidden="true" />
            </button>
            {trainingOpen && (
              <div className="training-menu" id="training-menu">
                <div className="training-menu-heading"><span className="eyebrow">Learning pathways</span><h2>Explore our training options</h2></div>
                <div className="training-menu-list">
                  {trainingOptions.map(({ title, description, icon: Icon }) => (
                    <Link
                      className="training-menu-item"
                      to={`/contact?interest=${encodeURIComponent(title)}`}
                      key={title}
                      onClick={closeNavigation}
                    >
                      <span className="training-menu-icon"><Icon size={20} aria-hidden="true" /></span>
                      <span className="courses-mega-copy"><strong>{title}</strong><small>{description}</small></span>
                      <ArrowRight className="courses-mega-arrow" size={16} aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          {linksAfterCourses.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeNavigation}
            >
              {link.label}
            </NavLink>
          ))}
          <Button to="/courses" className="nav-cta" onClick={closeNavigation}>Explore courses</Button>
        </nav>
      </div>
    </header>
  )
}
