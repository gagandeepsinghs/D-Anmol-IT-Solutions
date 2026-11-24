import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { ArrowRight, CheckCircle2, LoaderCircle } from 'lucide-react'
import EnquirySubmissionError from './EnquirySubmissionError'
import { validateEnquiryFields } from '../lib/enquiryValidation'
import { submitEnquiry } from '../lib/submitEnquiry'
import { useAppData } from '../context/AppDataContext'

const initialForm = { name: '', email: '', phone: '', organization: '', interest: '', preferredDemoMode: '', preferredContactMethod: '', message: '', website: '' }

export default function EnquiryForm({ kind = 'contact', compact = false, title, description, initialCourse = '', id }) {
  const { courses } = useAppData()
  const { search } = useLocation()
  const courseOptions = courses.map((course) => course.title)
  const enquiryParams = new URLSearchParams(search)
  const requestedCourse = initialCourse || enquiryParams.get('course') || enquiryParams.get('interest') || ''
  const [form, setForm] = useState({ ...initialForm, interest: courseOptions.includes(requestedCourse) ? requestedCourse : '' })
  const [status, setStatus] = useState('idle')
  const [fieldErrors, setFieldErrors] = useState({})
  const [submissionFailed, setSubmissionFailed] = useState(false)
  const [submissionError, setSubmissionError] = useState('')
  const [submittedName, setSubmittedName] = useState('')
  const formTitle = title || (kind === 'corporate' ? 'Let’s plan your team’s learning' : kind === 'course' ? 'Ask about this course' : 'Send us a message')

  const update = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => ({ ...current, [name]: '' }))
    setSubmissionFailed(false)
    setSubmissionError('')
    if (status === 'failure') setStatus('idle')
  }

  const submit = async (event) => {
    event.preventDefault()
    setSubmissionFailed(false)
    setSubmissionError('')
    const errors = validateEnquiryFields(form)
    if (kind !== 'corporate' && !form.interest) errors.interest = 'Please choose a course or select “I’m not sure yet.”'
    if (form.preferredContactMethod === 'Email' && !form.email.trim()) errors.email = 'Please enter an email address for email contact.'
    setFieldErrors(errors)
    if (Object.values(errors).some(Boolean)) {
      return
    }
    setStatus('loading')
    try {
      await submitEnquiry({
        formType: kind,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        course: form.interest.trim(),
        preferredDemoMode: form.preferredDemoMode,
        preferredContactMethod: form.preferredContactMethod,
        message: form.message.trim(),
        organization: form.organization.trim(),
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

  return (
    <div id={id} className={`form-card ${compact ? 'form-card-compact' : ''}`}>
      <div className="form-heading">
        <span className="eyebrow">Start a conversation</span>
        <h2>{formTitle}</h2>
        {description && <p>{description}</p>}
      </div>
      {status === 'success' ? (
        <div className="form-success" role="status">
          <CheckCircle2 size={24} />
          <div>
            <strong>Thanks, {submittedName || 'there'}.</strong>
            <p>Your request has been received. We’ll be in touch.</p>
            <button className="text-link" type="button" onClick={() => setStatus('idle')}>Submit another request</button>
          </div>
        </div>
      ) : (
        <form className="enquiry-form" onSubmit={submit} noValidate>
          <input className="honeypot-field" name="website" value={form.website} onChange={update} tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <div className="form-grid">
            <label>
              <span>Your name <b>*</b></span>
              <input name="name" autoComplete="name" value={form.name} onChange={update} required placeholder="Name" aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined} />
              {fieldErrors.name && <small className="form-field-error" id="contact-name-error">{fieldErrors.name}</small>}
            </label>
            <label>
              <span>Email address <small>{form.preferredContactMethod === 'Email' ? 'Required for email contact' : 'Optional'}</small></span>
              <input name="email" type="email" autoComplete="email" value={form.email} onChange={update} placeholder="you@example.com" aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined} />
              {fieldErrors.email && <small className="form-field-error" id="contact-email-error">{fieldErrors.email}</small>}
            </label>
            <label>
              <span>Phone <b>*</b></span>
              <input name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={update} required placeholder="Your phone number" aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? 'contact-phone-error' : undefined} />
              {fieldErrors.phone && <small className="form-field-error" id="contact-phone-error">{fieldErrors.phone}</small>}
            </label>
            {kind === 'corporate' && <label>
              <span>Organization <small>Optional</small></span>
              <input name="organization" autoComplete="organization" value={form.organization} onChange={update} placeholder="Company or team" />
            </label>}
            <label className="form-full">
              <span>{kind === 'corporate' ? 'Training interest' : 'Course or area of interest'} {kind !== 'corporate' && <b>*</b>}</span>
              {kind === 'corporate' ? (
                <input name="interest" value={form.interest} onChange={update} placeholder="e.g. Data analytics for our team" />
              ) : (
                <select name="interest" value={form.interest} onChange={update} required aria-invalid={Boolean(fieldErrors.interest)} aria-describedby={fieldErrors.interest ? 'contact-interest-error' : undefined}>
                  <option value="">Choose a course</option>
                  {courseOptions.map((course) => <option key={course} value={course}>{course}</option>)}
                  <option value="Not sure yet">I’m not sure yet</option>
                </select>
              )}
              {fieldErrors.interest && <small className="form-field-error" id="contact-interest-error">{fieldErrors.interest}</small>}
            </label>
            {kind !== 'corporate' && <>
              <label>
                <span>Preferred demo mode <small>Optional</small></span>
                <select name="preferredDemoMode" value={form.preferredDemoMode} onChange={update}>
                  <option value="">No preference</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </label>
              {kind !== 'course' && <label>
                <span>Preferred contact method <small>Optional</small></span>
                <select name="preferredContactMethod" value={form.preferredContactMethod} onChange={update}>
                  <option value="">No preference</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Phone call">Phone call</option>
                  <option value="Email">Email</option>
                </select>
              </label>}
            </>}
            <label className="form-full">
              <span>Your message <small>Optional</small></span>
              <textarea name="message" value={form.message} onChange={update} rows={compact ? 3 : 4} placeholder="Tell us a little about what you are looking for..." />
            </label>
          </div>
          {submissionFailed && <EnquirySubmissionError message={submissionError} />}
          <button className="button button-primary form-submit" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? <><LoaderCircle className="spin" size={18} /> Sending...</> : <>Send enquiry <ArrowRight size={16} /></>}
          </button>
        </form>
      )}
    </div>
  )
}
