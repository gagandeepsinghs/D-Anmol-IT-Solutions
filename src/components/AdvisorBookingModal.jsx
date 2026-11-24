import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, BookOpenText, Bot, BriefcaseBusiness, ChartNoAxesCombined, CheckCircle2, ChevronDown, Code2, Layers, LayoutDashboard, LoaderCircle, Sparkles, Workflow, X } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import EnquirySubmissionError from './EnquirySubmissionError'
import { validateEnquiryFields } from '../lib/enquiryValidation'
import { submitEnquiry } from '../lib/submitEnquiry'

const courseIcons = [Bot, ChartNoAxesCombined, Code2, Sparkles, Workflow, Layers, LayoutDashboard, BriefcaseBusiness, BookOpenText]
const timeOptions = ['Morning (9 AM–12 PM)', 'Afternoon (12 PM–4 PM)', 'Evening (4 PM–7 PM)']
const countryCodes = [
  { country: 'India', flag: '🇮🇳', code: '+91' },
  { country: 'United States', flag: '🇺🇸', code: '+1' },
  { country: 'United Kingdom', flag: '🇬🇧', code: '+44' },
  { country: 'Canada', flag: '🇨🇦', code: '+1' },
  { country: 'Australia', flag: '🇦🇺', code: '+61' },
]

function getToday() {
  const date = new Date()
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 10)
}

export default function AdvisorBookingModal({ onClose }) {
  const { courses } = useAppData()
  const dialogRef = useRef(null)
  const openerRef = useRef(null)
  const courseTriggerRef = useRef(null)
  const courseOptionRefs = useRef([])
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    countryCode: '+91',
    course: '',
    preferredDemoMode: '',
    preferredContactMethod: '',
    referralSource: '',
    date: '',
    time: '',
    website: '',
  })
  const [status, setStatus] = useState('idle')
  const [fieldErrors, setFieldErrors] = useState({})
  const [submissionFailed, setSubmissionFailed] = useState(false)
  const [submissionError, setSubmissionError] = useState('')
  const [submittedName, setSubmittedName] = useState('')
  const [courseMenuOpen, setCourseMenuOpen] = useState(false)
  const [activeCourseIndex, setActiveCourseIndex] = useState(0)
  const availableCourses = useMemo(() => courses.filter((course) => course.published !== false), [courses])
  const selectedCourseIndex = availableCourses.findIndex((course) => course.title === form.course)

  useEffect(() => {
    if (courseMenuOpen) courseOptionRefs.current[activeCourseIndex]?.focus()
  }, [activeCourseIndex, courseMenuOpen])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    openerRef.current = document.activeElement
    document.body.style.overflow = 'hidden'
    if (!window.matchMedia('(max-width: 600px)').matches) {
      dialogRef.current?.querySelector('input[name="name"]')?.focus()
    }

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
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => ({ ...current, [name]: '' }))
    setSubmissionFailed(false)
    setSubmissionError('')
    if (status === 'failure') setStatus('idle')
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
    setFieldErrors((current) => ({ ...current, course: '' }))
    setCourseMenuOpen(false)
    courseTriggerRef.current?.focus()
  }

  const submit = async (event) => {
    event.preventDefault()
    setSubmissionFailed(false)
    setSubmissionError('')
    const errors = validateEnquiryFields(form)
    if (!form.course) errors.course = 'Please select a course.'
    if (!form.preferredDemoMode) errors.preferredDemoMode = 'Please select online or offline.'
    if (!form.preferredContactMethod) errors.preferredContactMethod = 'Please select a contact method.'
    if (form.preferredContactMethod === 'Email' && !form.email.trim()) errors.email = 'Please enter an email address for email contact.'
    if (!form.date) errors.date = 'Please select a preferred date.'
    if (!form.time) errors.time = 'Please select a preferred time.'
    setFieldErrors(errors)
    if (Object.values(errors).some(Boolean)) {
      return
    }
    setStatus('loading')
    try {
      await submitEnquiry({
        formType: 'demo',
        name: form.name.trim(),
        phone: `${form.countryCode} ${form.phone.trim()}`,
        email: form.email.trim(),
        course: form.course,
        message: 'Free demo request',
        preferredDemoMode: form.preferredDemoMode,
        preferredContactMethod: form.preferredContactMethod,
        preferredDate: form.date,
        preferredTime: form.time,
        referralSource: form.referralSource,
        website: form.website,
      })
      setSubmittedName(form.name.trim())
      setStatus('success')
    } catch (error) {
      setStatus('failure')
      setSubmissionFailed(true)
      setSubmissionError(error instanceof Error ? error.message : 'The enquiry could not be sent.')
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
                  <span className="advisor-modal-kicker">D-Anmol Enterprises</span>
                  <h2 id="advisor-modal-title">Demo request received</h2>
                </div>
                <button className="advisor-modal-close" type="button" onClick={onClose} aria-label="Close advisor booking">
                  <X size={21} />
                </button>
              </header>
              <div className="advisor-success" role="status">
                <CheckCircle2 size={42} aria-hidden="true" />
                <h3>Thanks, {submittedName}!</h3>
                <p>Your free demo request has been received. The academy will contact you to confirm.</p>
                <button className="button button-primary" type="button" onClick={onClose}>Done</button>
              </div>
            </div>
          ) : (
            <form className="advisor-booking-form" onSubmit={submit} noValidate>
              <input className="honeypot-field" name="website" value={form.website} onChange={update} tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <div className="advisor-booking-details">
                <div className="advisor-booking-intro">
                  <button className="advisor-mobile-close" type="button" onClick={onClose} aria-label="Close advisor booking">
                    <X size={19} />
                  </button>
                  <h2 id="advisor-modal-title">Book Your <span>Free Demo Now</span></h2>
                </div>
                <div className="advisor-details-grid">
                  <label>
                    <span>Full name <b>*</b></span>
                    <input name="name" autoComplete="name" value={form.name} onChange={update} placeholder="Your full name" required aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? 'advisor-name-error' : undefined} />
                    {fieldErrors.name && <small className="form-field-error" id="advisor-name-error">{fieldErrors.name}</small>}
                  </label>
                  <label>
                    <span>Phone number <b>*</b></span>
                    <span className="advisor-phone-field">
                      <select
                        className="advisor-country-code"
                        name="countryCode"
                        value={form.countryCode}
                        onChange={update}
                        aria-label="Country calling code"
                      >
                        {countryCodes.map(({ country, flag, code }) => (
                          <option key={`${country}-${code}`} value={code}>{flag} {code}</option>
                        ))}
                      </select>
                      <input name="phone" type="tel" inputMode="tel" autoComplete="tel-national" value={form.phone} onChange={update} placeholder="Your phone number" aria-label="Phone number" required aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? 'advisor-phone-error' : undefined} />
                    </span>
                    {fieldErrors.phone && <small className="form-field-error" id="advisor-phone-error">{fieldErrors.phone}</small>}
                  </label>
                  <label>
                    <span>Email address {form.preferredContactMethod === 'Email' && <small>Required for email contact</small>}</span>
                    <input name="email" type="email" autoComplete="email" value={form.email} onChange={update} placeholder="you@example.com" aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? 'advisor-email-error' : undefined} />
                    {fieldErrors.email && <small className="form-field-error" id="advisor-email-error">{fieldErrors.email}</small>}
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
                        aria-invalid={Boolean(fieldErrors.course)}
                        aria-describedby={fieldErrors.course ? 'advisor-course-error' : undefined}
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
                    {fieldErrors.course && <small className="form-field-error" id="advisor-course-error">{fieldErrors.course}</small>}
                  </label>
                  <label>
                    <span>Preferred demo mode <b>*</b></span>
                    <select name="preferredDemoMode" value={form.preferredDemoMode} onChange={update} required aria-invalid={Boolean(fieldErrors.preferredDemoMode)} aria-describedby={fieldErrors.preferredDemoMode ? 'advisor-demo-mode-error' : undefined}>
                      <option value="">Select mode</option>
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                    </select>
                    {fieldErrors.preferredDemoMode && <small className="form-field-error" id="advisor-demo-mode-error">{fieldErrors.preferredDemoMode}</small>}
                  </label>
                  <label>
                    <span>Preferred contact method <b>*</b></span>
                    <select name="preferredContactMethod" value={form.preferredContactMethod} onChange={update} required aria-invalid={Boolean(fieldErrors.preferredContactMethod)} aria-describedby={fieldErrors.preferredContactMethod ? 'advisor-contact-method-error' : undefined}>
                      <option value="">Select method</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Phone call">Phone call</option>
                      <option value="Email">Email</option>
                    </select>
                    {fieldErrors.preferredContactMethod && <small className="form-field-error" id="advisor-contact-method-error">{fieldErrors.preferredContactMethod}</small>}
                  </label>
                  <label>
                    <span>How did you hear about us?</span>
                    <select name="referralSource" value={form.referralSource} onChange={update}>
                      <option value="">Select (optional)</option>
                      <option value="Google Search">Google Search</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Friend or Family">Friend or Family</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  <label>
                    <span>Preferred date <b>*</b></span>
                    <input name="date" type="date" min={getToday()} value={form.date} onChange={update} required aria-invalid={Boolean(fieldErrors.date)} aria-describedby={fieldErrors.date ? 'advisor-date-error' : undefined} />
                    {fieldErrors.date && <small className="form-field-error" id="advisor-date-error">{fieldErrors.date}</small>}
                  </label>
                  <label>
                    <span>Preferred time <b>*</b></span>
                    <select name="time" value={form.time} onChange={update} required aria-invalid={Boolean(fieldErrors.time)} aria-describedby={fieldErrors.time ? 'advisor-time-error' : undefined}>
                      <option value="">Select time</option>
                      {timeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                    {fieldErrors.time && <small className="form-field-error" id="advisor-time-error">{fieldErrors.time}</small>}
                  </label>
                  <div className="advisor-timezone-field">
                    <span>Times shown in</span>
                    <select aria-label="Times shown in" value="Asia/Kolkata · GMT+5:30" disabled>
                      <option>Asia/Kolkata · GMT+5:30</option>
                    </select>
                  </div>
                </div>
                <p className="advisor-timezone-note">Times shown in India Standard Time (IST).</p>
                {submissionFailed && <EnquirySubmissionError message={submissionError} />}
                <div className="advisor-modal-actions">
                  <button className="advisor-submit" type="submit" disabled={status === 'loading'}>
                    {status === 'loading'
                      ? <><LoaderCircle className="spin" size={18} /> Sending request...</>
                      : <>Book Free Demo <ArrowRight size={19} /></>}
                  </button>
                </div>
                <p className="advisor-demo-note">Demo requests are subject to confirmation by the academy.</p>
              </div>
              <aside className="advisor-course-panel">
                <div className="advisor-course-panel-header">
                  <div>
                    <h3>Our Courses</h3>
                    <p>Tap a course to select it</p>
                  </div>
                  <button className="advisor-modal-close" type="button" onClick={onClose} aria-label="Close advisor booking">
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
                          setFieldErrors((current) => ({ ...current, course: '' }))
                          setSubmissionFailed(false)
                          if (status === 'failure') setStatus('idle')
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
