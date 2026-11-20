import { useEffect, useState } from 'react'
import { KeyRound, LogOut } from 'lucide-react'
import PageBuilderPanel from './PageBuilderPanel'
import SiteContentPanel from './SiteContentPanel'
import AdminEnquiriesPanel from './AdminEnquiriesPanel'
import './AdminPage.css'

async function readJsonResponse(response) {
  const result = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(result.error || 'The request could not be completed.')
  return result
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [password, setPassword] = useState('')
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [activeTab, setActiveTab] = useState('pages')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    let active = true
    fetch('/api/admin/session', { credentials: 'same-origin' })
      .then(readJsonResponse)
      .then((result) => {
        if (active) setAuthenticated(result.authenticated)
      })
      .catch((error) => {
        if (active) setNotice({ type: 'error', text: error.message })
      })
      .finally(() => {
        if (active) setCheckingSession(false)
      })
    return () => { active = false }
  }, [])

  async function handleLogin(event) {
    event.preventDefault()
    setBusy(true)
    setNotice(null)
    try {
      await readJsonResponse(await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      }))
      setAuthenticated(true)
      setPassword('')
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setBusy(false)
    }
  }

  async function handleLogout() {
    setBusy(true)
    setNotice(null)
    try {
      await readJsonResponse(await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'same-origin',
      }))
      setAuthenticated(false)
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setBusy(false)
    }
  }

  async function handlePasswordChange(event) {
    event.preventDefault()
    setBusy(true)
    setNotice(null)
    try {
      await readJsonResponse(await fetch('/api/admin/password', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordForm),
      }))
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setNotice({ type: 'success', text: 'Admin password changed.' })
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setBusy(false)
    }
  }

  if (checkingSession) {
    return <div className="admin-page"><div className="admin-panel"><p>Checking admin access…</p></div></div>
  }

  if (!authenticated) {
    return (
      <div className="admin-page">
        <section className="admin-panel admin-login-panel">
          <span className="admin-eyebrow">D-Anmol Academy</span>
          <h1>Admin sign in</h1>
          <p>Sign in to manage pages, courses, site content and incoming enquiries.</p>
          {notice && <p className="admin-notice admin-notice-error" role="alert">{notice.text}</p>}
          <form onSubmit={handleLogin} className="admin-login-form">
            <label htmlFor="admin-password">Admin password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button type="submit" disabled={busy || !password}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </section>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <section className="admin-panel">
        <div className="admin-heading">
          <div>
            <span className="admin-eyebrow">Website management</span>
            <h1>Admin panel</h1>
            <p>Manage page layouts, courses, website details and incoming enquiries. Original pages remain available until a managed version is published.</p>
          </div>
          <button type="button" className="admin-logout" onClick={handleLogout} disabled={busy}>
            <LogOut size={16} /> Sign out
          </button>
        </div>

        <nav className="admin-tabs" aria-label="Admin sections">
          <button type="button" className={activeTab === 'pages' ? 'admin-tab-active' : ''} onClick={() => setActiveTab('pages')}>Page builder</button>
          <button type="button" className={activeTab === 'courses' ? 'admin-tab-active' : ''} onClick={() => setActiveTab('courses')}>Courses</button>
          <button type="button" className={activeTab === 'site-content' ? 'admin-tab-active' : ''} onClick={() => setActiveTab('site-content')}>Site content</button>
          <button type="button" className={activeTab === 'enquiries' ? 'admin-tab-active' : ''} onClick={() => setActiveTab('enquiries')}>Enquiries</button>
          <button type="button" className={activeTab === 'security' ? 'admin-tab-active' : ''} onClick={() => setActiveTab('security')}>Password</button>
        </nav>

        {notice && (
          <p className={`admin-notice ${notice.type === 'error' ? 'admin-notice-error' : 'admin-notice-success'}`} role="status">
            {notice.text}
          </p>
        )}

        {activeTab === 'pages'
          ? <PageBuilderPanel />
          : activeTab === 'courses'
          ? <SiteContentPanel section="courses" />
          : activeTab === 'site-content'
          ? <SiteContentPanel section="site" />
          : activeTab === 'enquiries'
          ? <AdminEnquiriesPanel />
          : <section className="admin-security-section">
          <h2>Change admin password</h2>
          <p>Choose a password with at least 12 characters. It is stored as a secure hash.</p>
          <form className="admin-login-form" onSubmit={handlePasswordChange}>
            <label htmlFor="admin-current-password">Current password</label>
            <input
              id="admin-current-password"
              type="password"
              autoComplete="current-password"
              value={passwordForm.currentPassword}
              onChange={(event) => setPasswordForm((form) => ({ ...form, currentPassword: event.target.value }))}
              required
            />
            <label htmlFor="admin-new-password">New password</label>
            <input
              id="admin-new-password"
              type="password"
              autoComplete="new-password"
              minLength={12}
              value={passwordForm.newPassword}
              onChange={(event) => setPasswordForm((form) => ({ ...form, newPassword: event.target.value }))}
              required
            />
            <label htmlFor="admin-confirm-password">Confirm new password</label>
            <input
              id="admin-confirm-password"
              type="password"
              autoComplete="new-password"
              minLength={12}
              value={passwordForm.confirmPassword}
              onChange={(event) => setPasswordForm((form) => ({ ...form, confirmPassword: event.target.value }))}
              required
            />
            <button type="submit" disabled={busy || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}>
              <KeyRound size={16} /> {busy ? 'Saving…' : 'Change password'}
            </button>
          </form>
          </section>
        }
      </section>
    </div>
  )
}
