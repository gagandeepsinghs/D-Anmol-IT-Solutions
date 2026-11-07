import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, BookOpenText, Bot, BriefcaseBusiness, ChartNoAxesCombined, CheckCircle2, ChevronDown, Code2, Layers, LayoutDashboard, LoaderCircle, Sparkles, Workflow, X } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { aiPythonCourses } from '../data/aiPythonCourses'
import { siteConfig } from '../config/siteConfig'

const courseIcons = [Bot, ChartNoAxesCombined, Code2, Sparkles, Workflow, Layers, LayoutDashboard, BriefcaseBusiness, BookOpenText]
const referralOptions = ['Google search', 'Social media', 'Friend or colleague', 'School or college', 'Other']
const timeOptions = ['Morning (9 AM–12 PM)', 'Afternoon (12 PM–4 PM)', 'Evening (4 PM–7 PM)']

const courseOfferings = [
  { id: 'computer-basics-office-productivity', source: 'catalog' },
  { id: 'computer-typing-government-exams', source: 'catalog' },
  { id: 'ai-machine-learning', source: 'catalog' },
  { id: 'generative-ai', source: 'catalog' },
  { id: 'data-science-with-python', source: 'catalog' },
  { id: 'python-programming', source: 'catalog' },
  { id: 'full-stack-development', source: 'catalog' },
  { id: 'ai-automation', source: 'catalog' },
  { id: 'digital-marketing', source: 'catalog' },
  { id: 'corporate-training', source: 'service', title: 'Corporate Training' },
  { id: 'desk-to-dashboard', source: 'catalog' },
  { id: 'python-django', source: 'ai-python' },
  { id: 'data-science-python', source: 'ai-python' },
  { id: 'generative-ai-llm', source: 'ai-python' },
]

const courseTitleAliases = {
  'Computer Basics & MS Office': 'Computer Basics',
  'Computer Typing for Government Exams': 'Computer Typing',
  'Desk to Dashboard: Excel, Power BI & SQL Course in Mohali': 'Desktop to Dashboard',
}

function getToday() {
  const date = new Date()
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 10)
}

export default function AdvisorBookingModal({ onClose }) {
  const { courses, addEnquiry } = useAppData()
  const dialogRef = useRef(null)
  const openerRef = useRef(null)
  const courseTriggerRef = useRef(null)
  const courseOptionRefs = useRef([])
  const [form, setForm] = useState({
    name: '',
    phone: '',
    course: '',
    referral: '',
    date: '',
    time: '',
  })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [submittedName, setSubmittedName] = useState('')
  const [courseMenuOpen, setCourseMenuOpen] = useState(false)
  const [activeCourseIndex, setActiveCourseIndex] = useState(0)
  const availableCourses = useMemo(() => {
    const catalogById = new Map(courses.map((course) => [course.id, course]))
    const aiPythonById = new Map(aiPythonCourses.map((course) => [course.id, course]))

    return courseOfferings.flatMap((offering) => {
      if (offering.source === 'service') return [offering]
      const source = offering.source === 'catalog' ? catalogById : aiPythonById
      const course = source.get(offering.id)
      if (!course || course.published === false) return []
      return [{ ...course, title: courseTitleAliases[course.title.trim()] || course.title.trim() }]
    })
  }, [courses])
  const selectedCourseIndex = availableCourses.findIndex((course) => course.title === form.course)

  useEffect(() => {
    if (courseMenuOpen) courseOptionRefs.current[activeCourseIndex]?.focus()
  }, [activeCourseIndex, courseMenuOpen])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    openerRef.current = document.activeElement
    document.body.style.overflow = 'hidden'
    dialogRef.current?.querySelector('input[name="name"]')?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusableElements = [...dialogRef.current.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), [href]')]
        .filter((element) => element.getClientRects().length > 0)
      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      openerRef.current?.focus()
    }
  }, [onClose])

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
  }

  const openCourseMenu = () => {
    setActiveCourseIndex(selectedCourseIndex >= 0 ? selectedCourseIndex : 0)
    setCourseMenuOpen(true)
  }

  const handleCourseMenuKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      setCourseMenuOpen(false)
      courseTriggerRef.current?.focus()
      return
    }

    let nextIndex = activeCourseIndex
    if (event.key === 'ArrowDown') nextIndex = Math.min(activeCourseIndex + 1, availableCourses.length - 1)
    else if (event.key === 'ArrowUp') nextIndex = Math.max(activeCourseIndex - 1, 0)
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = availableCourses.length - 1
    else return
    event.preventDefault()
    setActiveCourseIndex(nextIndex)
  }

  const selectCourse = (course) => {
    setForm((current) => ({ ...current, course: course.title }))
    setError('')
    setCourseMenuOpen(false)
    courseTriggerRef.current?.focus()
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (!form.name.trim() || !form.phone.trim() || !form.course || !form.date || !form.time) {
      setError('Please complete your name, phone number, course, preferred date and time.')
      return
    }
    const phoneDigits = form.phone.replace(/\D/g, '')
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      setError('Please enter a valid phone number.')
      return
    }
    setStatus('loading')
    try {
      addEnquiry({
        name: form.name.trim(),
        phone: `${form.countryCode} ${form.phone.trim()}`,
        email: '',
        interest: form.course,
        message: `Free demo request for ${form.course}. Preferred date: ${form.date}. Preferred time: ${form.time}. Time zone: Asia/Kolkata. Referral source: ${form.referral || 'Not provided'}.`,
        kind: 'advisor-demo',
        createdAt: new Date().toISOString(),
      })
      setSubmittedName(form.name.trim())
      setStatus('success')
    } catch {
      setStatus('error')
      setError('We could not save this demo request in this browser. Please try again.')
    }
  }

  const closeFromBackdrop = (event) => {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <div className="advisor-modal-backdrop" onMouseDown={closeFromBackdrop}>
      <section className="advisor-modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="advisor-modal-title">
        <div className="advisor-modal-content">
          {status === 'success' ? (
            <div className="advisor-success-view">
              <header className="advisor-modal-header">
                <div className="advisor-modal-mark" aria-hidden="true"><Bot size={23} /></div>
                <div>
                  <span className="advisor-modal-kicker">D-Anmol learning consultation</span>
                  <h2 id="advisor-modal-title">Request received</h2>
                </div>
                <button className="advisor-modal-close" type="button" onClick={onClose} aria-label="Close demo booking">
                  <X size={21} />
                </button>
              </header>
              <div className="advisor-success" role="status">
                <CheckCircle2 size={42} aria-hidden="true" />
                <h3>Thanks, {submittedName}!</h3>
                <p>Your demo request has been saved in this browser. It has not been sent to {siteConfig.name}.</p>
                <button className="button button-primary" type="button" onClick={onClose}>Done</button>
              </div>
            </div>
          ) : (
            <form className="advisor-booking-form" onSubmit={submit} noValidate>
              <div className="advisor-booking-details">
                <div className="advisor-booking-intro">
                  <span className="advisor-modal-kicker">D-Anmol learning consultation</span>
                  <h2 id="advisor-modal-title">Book Your Free <span>Demo Now</span></h2>
                  <p>Choose a course and share a few details to help us prepare.</p>
                </div>
                <div className="advisor-details-grid">
                  <label>
                    <span>Full name <b>*</b></span>
                    <input name="name" autoComplete="name" value={form.name} onChange={update} placeholder="Your full name" required />
                  </label>
                  <label>
                    <span>Phone number <b>*</b></span>
                    <span className="advisor-phone-field">
                      <span className="advisor-phone-prefix" aria-hidden="true">+91</span>
                      <input name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" value={form.phone} onChange={update} placeholder="Your phone number" aria-label="Phone number" required />
                    </span>
                  </label>
                  <label>
                    <span>Course interest <b>*</b></span>
                    <div
                      className="advisor-course-select"
                      onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget)) setCourseMenuOpen(false)
                      }}
                    >
                      <button
                        ref={courseTriggerRef}
                        className="advisor-course-select-trigger"
                        type="button"
                        aria-label="Course interest"
                        aria-haspopup="listbox"
                        aria-expanded={courseMenuOpen}
                        aria-controls="advisor-course-options"
                        aria-required="true"
                        onClick={() => courseMenuOpen ? setCourseMenuOpen(false) : openCourseMenu()}
                      >
                        <span className={form.course ? '' : 'is-placeholder'}>{form.course || 'Select a course'}</span>
                        <ChevronDown size={18} aria-hidden="true" />
                      </button>
                      <div
                        className="advisor-course-select-options"
                        id="advisor-course-options"
                        role="listbox"
                        aria-label="Available courses"
                        hidden={!courseMenuOpen}
                        onKeyDown={handleCourseMenuKeyDown}
                      >
                        {availableCourses.map((course, index) => (
                          <button
                            className="advisor-course-select-option"
                            id={`advisor-course-option-${index}`}
                            key={course.title}
                            ref={(element) => { courseOptionRefs.current[index] = element }}
                            type="button"
                            role="option"
                            aria-selected={form.course === course.title}
                            tabIndex={-1}
                            onClick={() => selectCourse(course)}
                          >
                            {course.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </label>
                  <label>
                    <span>How did you hear about us? <small>Optional</small></span>
                    <select name="referral" value={form.referral} onChange={update}>
                      <option value="">Select (optional)</option>
                      {referralOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </label>
                  <label>
                    <span>Preferred date <b>*</b></span>
                    <input name="date" type="date" min={getToday()} value={form.date} onChange={update} required />
                  </label>
                  <label>
                    <span>Preferred time <b>*</b></span>
                    <select name="time" value={form.time} onChange={update} required>
                      <option value="">Select time</option>
                      {timeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </label>
                  <div className="advisor-timezone-field">
                    <span>Times shown in</span>
                    <div>Asia/Kolkata · GMT+5:30</div>
                  </div>
                </div>
                <p className="advisor-timezone-note">The demo runs on India Standard Time (IST).</p>
                {error && <p className="form-error" role="alert">{error}</p>}
                <div className="advisor-modal-actions">
                  <button className="advisor-submit" type="submit" disabled={status === 'loading'}>
                    {status === 'loading'
                      ? <><LoaderCircle className="spin" size={18} /> Saving request...</>
                      : <>Book Free Demo <ArrowRight size={19} /></>}
                  </button>
                </div>
                <p className="advisor-demo-note">A quick, no-pressure conversation about your learning goals. Demo requests are stored in this browser only.</p>
                <img className="advisor-form-logo" src={siteConfig.logo} alt={siteConfig.name} />
              </div>
              <aside className="advisor-course-panel">
                <div className="advisor-course-panel-header">
                  <div>
                    <h3>Our Courses</h3>
                    <p>Tap a course to select it</p>
                  </div>
                  <button className="advisor-modal-close" type="button" onClick={onClose} aria-label="Close demo booking">
                    <X size={21} />
                  </button>
                </div>
                <div className="advisor-course-picker" role="group" aria-label="Choose a course">
                  {availableCourses.map((course, index) => {
                    const CourseIcon = courseIcons[index % courseIcons.length]
                    const selected = form.course === course.title
                    return (
                      <button
                        className={`advisor-course-option ${selected ? 'is-selected' : ''}`}
                        key={course.title}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => {
                          setForm((current) => ({ ...current, course: course.title }))
                          setError('')
                          setCourseMenuOpen(false)
                        }}
                      >
                        <span className={`advisor-course-icon advisor-course-icon-${index % 6}`}><CourseIcon size={19} aria-hidden="true" /></span>
                        <span className="advisor-course-title">{course.title}</span>
                        <span className="advisor-course-check" aria-hidden="true">{selected ? '✓' : '+'}</span>
                      </button>
                    )
                  })}
                </div>
              </aside>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
