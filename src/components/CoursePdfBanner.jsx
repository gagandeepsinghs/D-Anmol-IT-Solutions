import { useState } from 'react'
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react'
import './CoursePdfBanner.css'

export default function CoursePdfBanner({ courseTitle, courseImage, email }) {
  const [isOpen, setIsOpen] = useState(false)
  const subject = encodeURIComponent(`Course syllabus request: ${courseTitle}`)

  const requestSyllabus = (event) => {
    event.preventDefault()
    const emailAddress = String(new FormData(event.currentTarget).get('email') || '').trim()
    const body = encodeURIComponent(
      `Hello D-Anmol Enterprises,\n\nPlease send me the syllabus for ${courseTitle}.\n\nMy email address: ${emailAddress}`
    )
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
  }

  return (
    <aside className="course-pdf-banner" aria-label={`Syllabus information for ${courseTitle}`}>
      <div className="course-pdf-preview" aria-hidden="true">
        {courseImage && <img src={courseImage} alt="" />}
        <div className="course-pdf-preview-overlay" />
        <span className="course-pdf-label">PDF</span>
        <div className="course-pdf-preview-copy">
          <strong>Course<br />Syllabus</strong>
          <span>D-ANMOL ACADEMY</span>
        </div>
      </div>

      <div
        className={`course-pdf-content${isOpen ? ' is-open' : ''}`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="course-pdf-flipper">
          <div className="course-pdf-face course-pdf-front" aria-hidden={isOpen}>
            <span className="course-pdf-kicker">FREE COURSE GUIDE</span>
            <h2>Want the syllabus?</h2>
            <p>Get the module and project outline for <strong>{courseTitle}</strong> sent to your email.</p>
            <button
              className="course-pdf-email"
              type="button"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((open) => !open)}
            >
              Request the syllabus <ArrowRight size={17} />
            </button>
            <span className="course-pdf-hover-hint">Hover or select the button to continue</span>
          </div>
          <div className="course-pdf-face course-pdf-back" aria-hidden={!isOpen}>
            <span className="course-pdf-kicker">GET YOUR COURSE GUIDE</span>
            <h2>Where should we send it?</h2>
            <p>Enter your email address to request the <strong>{courseTitle}</strong> syllabus.</p>
            <form className="course-pdf-email-form" onSubmit={requestSyllabus}>
              <label htmlFor={`course-pdf-email-${courseTitle.replace(/\W+/g, '-').toLowerCase()}`}>Your email address</label>
              <div className="course-pdf-email-input">
                <Mail size={18} aria-hidden="true" />
                <input
                  id={`course-pdf-email-${courseTitle.replace(/\W+/g, '-').toLowerCase()}`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@gmail.com"
                  required
                />
              </div>
              <div className="course-pdf-form-actions">
                <button className="course-pdf-email" type="submit">
                  Request syllabus <ArrowRight size={17} />
                </button>
                <button className="course-pdf-back-button" type="button" onClick={() => setIsOpen(false)}>
                  <ArrowLeft size={15} /> Back
                </button>
              </div>
            </form>
            <span className="course-pdf-email-note">Opens your email app with the request ready to send.</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
