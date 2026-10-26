import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, BookOpenText, Bot, BriefcaseBusiness, ChartNoAxesCombined, CheckCircle2, Code2, Layers, LayoutDashboard, LoaderCircle, Sparkles, Workflow, X } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { aiPythonCourses } from '../data/aiPythonCourses'
import { siteConfig } from '../config/siteConfig'

const courseIcons = [Bot, ChartNoAxesCombined, Code2, Sparkles, Workflow, Layers, LayoutDashboard, BriefcaseBusiness, BookOpenText]
const referralOptions = ['Google search', 'Social media', 'Friend or colleague', 'School or college', 'Other']
const timeOptions = ['Morning (9 AM–12 PM)', 'Afternoon (12 PM–4 PM)', 'Evening (4 PM–7 PM)']

function getToday() {
  const date = new Date()
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 10)
}

export default function AdvisorBookingModal({ onClose }) {
  const { courses, addEnquiry } = useAppData()
  const dialogRef = useRef(null)
  const contentRef = useRef(null)
  const openerRef = useRef(null)
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
  const [step, setStep] = useState(1)
  const availableCourses = useMemo(() => {
    const seen = new Set()
    return [...courses, ...aiPythonCourses].filter((course) => {
      const title = course.title.trim()
      if (seen.has(title)) return false
      seen.add(title)
      return true
    })
  }, [courses])

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

  useEffect(() => {
    if (status !== 'success') {
      contentRef.current?.scrollTo({ top: 0 })
      if (step === 2) dialogRef.current?.querySelector('input[name="name"]')?.focus()
    }
  }, [step, status])

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (!form.course) {
      setError('Choose a course to continue.')
      return
    }
    if (step === 1) {
      setStep(2)
      return
    }
    if (!form.name.trim() || !form.phone.trim() || !form.date || !form.time) {
      setError('Please complete your name, phone number, preferred date and time.')
      return
    }
    if (!/^[+\d\s().-]{7,20}$/.test(form.phone.trim())) {
      setError('Please enter a valid phone number.')
      return
    }
    setStatus('loading')
    try {
      addEnquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
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
        <header className="advisor-modal-header">
          <div className="advisor-modal-mark" aria-hidden="true"><Bot size={23} /></div>
          <div>
            <span className="advisor-modal-kicker">D-Anmol learning consultation</span>
            <h2 id="advisor-modal-title">{status === 'success' ? 'Request received' : step === 1 ? 'Find your next skill' : 'Let’s plan your demo'}</h2>
            {status !== 'success' && <p>{step === 1 ? 'Choose a topic and we’ll tailor a short demo around it.' : 'Share a few details so our team can prepare.'}</p>}
          </div>
          <button className="advisor-modal-close" type="button" onClick={onClose} aria-label="Close demo booking">
            <X size={21} />
          </button>
        </header>
        <div className="advisor-modal-content" ref={contentRef}>
          {status === 'success' ? (
            <div className="advisor-success" role="status">
              <CheckCircle2 size={42} aria-hidden="true" />
              <h3>Thanks, {submittedName}!</h3>
              <p>Your demo request has been saved in this browser. It has not been sent to {siteConfig.name}.</p>
              <button className="button button-primary" type="button" onClick={onClose}>Done</button>
            </div>
          ) : (
            <form className="advisor-booking-form" onSubmit={submit} noValidate>
              <div className="advisor-step-progress" aria-label={`Step ${step} of 2`}>
                <span className={step === 1 ? 'is-current' : 'is-complete'}><i>01</i> Choose a topic</span>
                <span className="advisor-step-connector" />
                <span className={step === 2 ? 'is-current' : ''}><i>02</i> Your details</span>
              </div>
              {step === 1 ? (
                <div className="advisor-course-picker" aria-label="Choose a course">
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
                        }}
                      >
                        <span className={`advisor-course-icon advisor-course-icon-${index % 6}`}><CourseIcon size={19} aria-hidden="true" /></span>
                        <span className="advisor-course-title">{course.title}</span>
                        <span className="advisor-course-check" aria-hidden="true">{selected ? '✓' : '+'}</span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <>
                  <div className="advisor-selected-course">
                    <span>DEMO TOPIC</span>
                    <strong>{form.course}</strong>
                    <button type="button" onClick={() => { setStep(1); setError('') }}>Change</button>
                  </div>
                  <div className="advisor-details-grid">
                    <label>
                      <span>Your name <b>*</b></span>
                      <input name="name" autoComplete="name" value={form.name} onChange={update} placeholder="e.g. Anmol Sharma" required />
                    </label>
                    <label>
                      <span>Phone number <b>*</b></span>
                      <input name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={update} placeholder="+91" required />
                    </label>
                    <label>
                      <span>Preferred date <b>*</b></span>
                      <input name="date" type="date" min={getToday()} value={form.date} onChange={update} required />
                    </label>
                    <label>
                      <span>Best time to connect <b>*</b></span>
                      <select name="time" value={form.time} onChange={update} required>
                        <option value="">Choose a time</option>
                        {timeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </label>
                    <label className="advisor-details-referral">
                      <span>Where did you hear about us? <small>Optional</small></span>
                      <select name="referral" value={form.referral} onChange={update}>
                        <option value="">Choose an option</option>
                        {referralOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </label>
                  </div>
                  <p className="advisor-timezone-note">Times are shown in India Standard Time (IST).</p>
                </>
              )}
              {error && <p className="form-error" role="alert">{error}</p>}
              <div className="advisor-modal-actions">
                {step === 2 && <button className="advisor-back-button" type="button" onClick={() => { setStep(1); setError('') }}>Back</button>}
                <button className="advisor-submit" type="submit" disabled={status === 'loading'}>
                  {status === 'loading'
                    ? <><LoaderCircle className="spin" size={18} /> Saving request...</>
                    : step === 1
                      ? <>Continue <ArrowRight size={19} /></>
                      : <>Request my demo <ArrowRight size={19} /></>}
                </button>
              </div>
              <p className="advisor-demo-note">A quick, no-pressure conversation about your learning goals. Demo requests are stored in this browser only.</p>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
