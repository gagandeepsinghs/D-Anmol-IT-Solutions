import { useState } from 'react'
import { ArrowRight, CheckCircle2, LoaderCircle } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'

const initialForm = { name: '', email: '', phone: '', organization: '', interest: '', message: '' }

export default function EnquiryForm({ kind = 'contact', compact = false, title, description }) {
  const { addEnquiry } = useAppData()
  const enquiryParams = new URLSearchParams(window.location.search)
  const [form, setForm] = useState({ ...initialForm, interest: enquiryParams.get('course') || enquiryParams.get('interest') || '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [submittedName, setSubmittedName] = useState('')
  const formTitle = title || (kind === 'corporate' ? 'Let’s plan your team’s learning' : kind === 'course' ? 'Ask about this course' : 'Send us a message')

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error')
      setError('Please complete your name, email address and message.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus('error')
      setError('Please enter a valid email address.')
      return
    }
    setStatus('loading')
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 500))
      addEnquiry({ ...form, kind, createdAt: new Date().toISOString() })
      setSubmittedName(form.name.trim())
      setStatus('success')
      setForm({ ...initialForm, interest: form.interest })
    } catch {
      setStatus('error')
      setError('This demo could not save your request in this browser. Please try again.')
    }
  }

  return (
    <div className={`form-card ${compact ? 'form-card-compact' : ''}`}>
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
            <p>Your request is saved as a demo in this browser only. It has not been sent to D-Anmol Enterprises.</p>
            <button className="text-link" type="button" onClick={() => setStatus('idle')}>Submit another request</button>
          </div>
        </div>
      ) : (
        <form className="enquiry-form" onSubmit={submit} noValidate>
          <div className="form-grid">
            <label>
              <span>Your name <b>*</b></span>
              <input name="name" autoComplete="name" value={form.name} onChange={update} required placeholder="Name" />
            </label>
            <label>
              <span>Email address <b>*</b></span>
              <input name="email" type="email" autoComplete="email" value={form.email} onChange={update} required placeholder="you@example.com" />
            </label>
            <label>
              <span>Phone <small>Optional</small></span>
              <input name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={update} placeholder="Your phone number" />
            </label>
            {kind === 'corporate' && <label>
              <span>Organization <small>Optional</small></span>
              <input name="organization" autoComplete="organization" value={form.organization} onChange={update} placeholder="Company or team" />
            </label>}
            <label className="form-full">
              <span>{kind === 'corporate' ? 'Training interest' : 'Course or area of interest'} <small>Optional</small></span>
              <input name="interest" value={form.interest} onChange={update} placeholder={kind === 'corporate' ? 'e.g. Data analytics for our team' : 'What would you like to learn?'} />
            </label>
            <label className="form-full">
              <span>Your message <b>*</b></span>
              <textarea name="message" value={form.message} onChange={update} required rows="4" placeholder="Tell us a little about what you are looking for..." />
            </label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary form-submit" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? <><LoaderCircle className="spin" size={18} /> Saving demo...</> : <>Send demo enquiry <ArrowRight size={16} /></>}
          </button>
          <p className="demo-notice">Demo only: this form stores a test enquiry in this browser. No email or notification is sent. Browser storage is not a secure production database.</p>
        </form>
      )}
    </div>
  )
}
