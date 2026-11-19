import { useState } from 'react'
import { ArrowRight, CheckCircle2, LoaderCircle } from 'lucide-react'
import EnquirySubmissionError from './EnquirySubmissionError'
import { useAppData } from '../context/AppDataContext'
import { validateEnquiryFields } from '../lib/enquiryValidation'
import { submitEnquiry } from '../lib/submitEnquiry'

export default function AiPythonEnquiryForm({ initialCourse = '' }) {
  const { courses } = useAppData()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    course: initialCourse,
    website: '',
  })
  const [status, setStatus] = useState('idle')
  const [fieldErrors, setFieldErrors] = useState({})
  const [submissionFailed, setSubmissionFailed] = useState(false)
  const [submissionError, setSubmissionError] = useState('')

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
    if (!form.course) errors.course = 'Please select a course.'
    setFieldErrors(errors)
    if (Object.values(errors).some(Boolean)) {
      return
    }

    setStatus('loading')
    try {
      await submitEnquiry({
        formType: 'ai-python',
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        course: form.course,
        message: '',
        website: form.website,
      })
      setStatus('success')
    } catch (error) {
      setSubmissionFailed(true)
      setStatus('failure')
      setSubmissionError(error instanceof Error ? error.message : 'The enquiry could not be sent.')
    }
  }

  if (status === 'success') {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={24} />
        <div>
          <strong>Thank you, {form.name.trim()}.</strong>
          <p>Your course information request has been received. We’ll be in touch.</p>
          <button className="text-link" type="button" onClick={() => { setForm({ name: '', phone: '', email: '', course: initialCourse, website: '' }); setStatus('idle') }}>Make another request</button>
        </div>
      </div>
    )
  }

  return (
    <form className="enquiry-form ai-python-form" onSubmit={submit} noValidate>
      <input className="honeypot-field" name="website" value={form.website} onChange={update} tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="form-grid">
        <label>
          <span>Your name <b>*</b></span>
          <input name="name" autoComplete="name" value={form.name} onChange={update} required placeholder="Name" aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? 'ai-python-name-error' : undefined} />
          {fieldErrors.name && <small className="form-field-error" id="ai-python-name-error">{fieldErrors.name}</small>}
        </label>
        <label>
          <span>Phone number <b>*</b></span>
          <input name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={update} required placeholder="Your phone number" aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? 'ai-python-phone-error' : undefined} />
          {fieldErrors.phone && <small className="form-field-error" id="ai-python-phone-error">{fieldErrors.phone}</small>}
        </label>
        <label className="form-full">
          <span>Email address <small>Optional</small></span>
          <input name="email" type="email" autoComplete="email" value={form.email} onChange={update} placeholder="you@example.com" aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? 'ai-python-email-error' : undefined} />
          {fieldErrors.email && <small className="form-field-error" id="ai-python-email-error">{fieldErrors.email}</small>}
        </label>
        <label className="form-full">
          <span>Select a course <b>*</b></span>
          <select name="course" value={form.course} onChange={update} required aria-invalid={Boolean(fieldErrors.course)} aria-describedby={fieldErrors.course ? 'ai-python-course-error' : undefined}>
            <option value="">Choose a course</option>
            {courses.map((course) => <option key={course.slug} value={course.title}>{course.title}</option>)}
          </select>
          {fieldErrors.course && <small className="form-field-error" id="ai-python-course-error">{fieldErrors.course}</small>}
        </label>
      </div>
      {submissionFailed && <EnquirySubmissionError message={submissionError} />}
      <button className="button button-primary form-submit" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? <><LoaderCircle className="spin" size={18} /> Sending...</> : <>Request course information <ArrowRight size={16} /></>}
      </button>
    </form>
  )
}
