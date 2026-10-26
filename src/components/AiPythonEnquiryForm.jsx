import { useState } from 'react'
import { ArrowRight, CheckCircle2, LoaderCircle } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { aiPythonCourses } from '../data/aiPythonCourses'

export default function AiPythonEnquiryForm({ initialCourse = '' }) {
  const { addEnquiry } = useAppData()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    course: initialCourse,
  })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.course) {
      setError('Please complete all fields to request course information.')
      setStatus('error')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.')
      setStatus('error')
      return
    }
    if (!/^[+\d\s().-]{7,20}$/.test(form.phone.trim())) {
      setError('Please enter a valid phone number.')
      setStatus('error')
      return
    }

    setStatus('loading')
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 450))
      addEnquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        interest: form.course,
        message: `Request for course information: ${form.course}`,
        kind: 'ai-python',
        createdAt: new Date().toISOString(),
      })
      setStatus('success')
    } catch {
      setError('This browser could not save the demo request. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={24} />
        <div>
          <strong>Thank you, {form.name.trim()}.</strong>
          <p>Your course information request is saved as a demo in this browser only. It has not been sent to D-Anmol Enterprises.</p>
          <button className="text-link" type="button" onClick={() => { setForm({ name: '', phone: '', email: '', course: initialCourse }); setStatus('idle') }}>Make another request</button>
        </div>
      </div>
    )
  }

  return (
    <form className="enquiry-form ai-python-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <label>
          <span>Your name <b>*</b></span>
          <input name="name" autoComplete="name" value={form.name} onChange={update} required placeholder="Name" />
        </label>
        <label>
          <span>Phone number <b>*</b></span>
          <input name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={update} required placeholder="Your phone number" />
        </label>
        <label className="form-full">
          <span>Email address <b>*</b></span>
          <input name="email" type="email" autoComplete="email" value={form.email} onChange={update} required placeholder="you@example.com" />
        </label>
        <label className="form-full">
          <span>Select a course <b>*</b></span>
          <select name="course" value={form.course} onChange={update} required>
            <option value="">Choose a course</option>
            {aiPythonCourses.map((course) => <option key={course.slug} value={course.title}>{course.title}</option>)}
          </select>
        </label>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary form-submit" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? <><LoaderCircle className="spin" size={18} /> Saving request...</> : <>Request course information <ArrowRight size={16} /></>}
      </button>
      <p className="demo-notice">Demo only: this request is stored in this browser and does not send email or notifications. Browser storage is not a secure production database.</p>
    </form>
  )
}
