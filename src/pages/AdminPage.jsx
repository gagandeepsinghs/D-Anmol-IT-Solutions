import { useEffect, useMemo, useState } from 'react'
import { ImageUp, KeyRound, LogOut, Trash2, Upload } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { getCourseModuleImage } from '../data/courseModuleImages'
import syllabusData, { corporateSyllabusFolder, courseSyllabusFolders } from '../data/courseSyllabi'
import PageBuilderPanel from './PageBuilderPanel'
import SiteContentPanel from './SiteContentPanel'
import AdminEnquiriesPanel from './AdminEnquiriesPanel'
import { prepareImageUpload } from '../lib/prepareImageUpload'
import './AdminPage.css'

async function readJsonResponse(response) {
  const result = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(result.error || 'The request could not be completed.')
  return result
}

export default function AdminPage() {
  const { courses: courseCatalog, courseSyllabi } = useAppData()
  const [authenticated, setAuthenticated] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [password, setPassword] = useState('')
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [selectedCourseId, setSelectedCourseId] = useState(courseCatalog[0]?.id || '')
  const [selectedModuleNumber, setSelectedModuleNumber] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [localPreview, setLocalPreview] = useState('')
  const [remotePreview, setRemotePreview] = useState('')
  const [imageLoadError, setImageLoadError] = useState('')
  const [hasCurrentImage, setHasCurrentImage] = useState(true)
  const [previewVersion, setPreviewVersion] = useState(0)
  const [activeTab, setActiveTab] = useState('pages')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(null)

  const imageCourses = useMemo(() => [
    ...courseCatalog.map((course) => {
      const folder = courseSyllabusFolders[course.id] || course.id
      const savedSyllabus = courseSyllabi[course.id]
      const builtInSyllabus = courseSyllabusFolders[course.id] && syllabusData[folder]?.['3_Months']
      const syllabusModules = savedSyllabus?.modules || builtInSyllabus?.modules
      const modules = syllabusModules?.length
        ? syllabusModules
        : (course.modules || []).map((module, index) => ({
            number: index + 1,
            title: typeof module === 'string' ? module : module.title,
          }))

      return { id: course.id, title: course.title, folder, modules }
    }),
    {
      id: 'corporate-training',
      title: 'Corporate Training',
      folder: corporateSyllabusFolder,
      modules: syllabusData[corporateSyllabusFolder]?.['3_Months']?.modules || [],
    },
  ].filter((course) => course.modules.length > 0), [courseCatalog, courseSyllabi])

  const selectedCourse = imageCourses.find((course) => course.id === selectedCourseId)
  const selectedModule = selectedCourse?.modules.find((module, index) => (
    String(module.number || index + 1).padStart(2, '0') === selectedModuleNumber
  ))
  const selectedModuleIndex = selectedCourse?.modules.findIndex((module, index) => (
    String(module.number || index + 1).padStart(2, '0') === selectedModuleNumber
  )) ?? -1
  const defaultModulePreview = selectedCourse && selectedModule
    ? getCourseModuleImage(selectedCourse.folder, selectedModuleIndex, selectedModule.title)
    : ''
  const moduleImageUrl = useMemo(() => {
    if (!selectedCourse || !selectedModuleNumber) return ''
    const params = new URLSearchParams({
      folder: selectedCourse.folder,
      module: selectedModuleNumber,
      v: String(previewVersion),
    })
    return `/api/module-image?${params.toString()}`
  }, [selectedCourse, selectedModuleNumber, previewVersion])

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

  useEffect(() => {
    if (!selectedCourse && imageCourses.length > 0) setSelectedCourseId(imageCourses[0].id)
  }, [selectedCourse, imageCourses])

  useEffect(() => {
    if (!selectedCourse?.modules.length) {
      setSelectedModuleNumber('')
      return
    }
    const currentExists = selectedCourse.modules.some((module, index) => (
      String(module.number || index + 1).padStart(2, '0') === selectedModuleNumber
    ))
    if (!currentExists) {
      const firstModule = selectedCourse.modules[0]
      setSelectedModuleNumber(String(firstModule.number || 1).padStart(2, '0'))
    }
  }, [selectedCourse, selectedModuleNumber])

  useEffect(() => {
    setSelectedFile(null)
    setHasCurrentImage(false)
    setRemotePreview('')
    setImageLoadError('')
    setNotice(null)
  }, [selectedCourseId, selectedModuleNumber])

  useEffect(() => {
    let active = true
    let objectUrl
    if (!moduleImageUrl) return undefined

    fetch(moduleImageUrl, { credentials: 'same-origin', cache: 'no-store' })
      .then(async (response) => {
        if (response.status === 404) return
        if (!response.ok) {
          const result = await response.json().catch(() => ({}))
          throw new Error(result.error || 'Unable to load the current module image.')
        }
        objectUrl = URL.createObjectURL(await response.blob())
        if (active) {
          setRemotePreview(objectUrl)
          setHasCurrentImage(true)
        } else {
          URL.revokeObjectURL(objectUrl)
        }
      })
      .catch((error) => {
        if (active) {
          setImageLoadError(error.message)
          setNotice({ type: 'error', text: error.message })
        }
      })

    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [moduleImageUrl])

  useEffect(() => {
    if (!selectedFile) {
      setLocalPreview('')
      return undefined
    }
    const objectUrl = URL.createObjectURL(selectedFile)
    setLocalPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

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

  async function handleUpload(event) {
    event.preventDefault()
    if (!selectedFile || !selectedCourse || !selectedModuleNumber) return
    setBusy(true)
    setNotice(null)
    try {
      const image = await prepareImageUpload(selectedFile)
      await readJsonResponse(await fetch(moduleImageUrl, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(image),
      }))
      setSelectedFile(null)
      setRemotePreview('')
      setHasCurrentImage(true)
      setPreviewVersion(Date.now())
      setNotice({ type: 'success', text: 'Module image saved and is now available on the course page.' })
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setBusy(false)
    }
  }

  async function handleRemoveImage() {
    if (!selectedCourse || !selectedModuleNumber) return
    setBusy(true)
    setNotice(null)
    try {
      await readJsonResponse(await fetch(moduleImageUrl, {
        method: 'DELETE',
        credentials: 'same-origin',
      }))
      setSelectedFile(null)
      setRemotePreview('')
      setHasCurrentImage(false)
      setPreviewVersion(Date.now())
      setNotice({ type: 'success', text: 'Uploaded image removed. The course page will use its built-in illustration.' })
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
  }

  if (checkingSession) {
    return     <div className="admin-page"><div className="admin-panel"><p>Checking admin access…</p></div></div>
  }

  if (!authenticated) {
    return (
      <div className="admin-page">
        <section className="admin-panel admin-login-panel">
          <span className="admin-eyebrow">D-Anmol Academy</span>
          <h1>Admin sign in</h1>
          <p>Sign in to manage pages, site content, course images and incoming enquiries.</p>
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
            <p>Manage page layouts, course photos and modules, website details, and incoming enquiries. Original pages remain available until a managed version is published.</p>
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
          <button type="button" className={activeTab === 'images' ? 'admin-tab-active' : ''} onClick={() => setActiveTab('images')}>Module images</button>
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
          : activeTab === 'security'
          ? <section className="admin-security-section">
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
          : <div>
          <p className="admin-image-help">The full current image is shown in the preview. For the best fit on course pages, use <strong>1200 × 675 pixels (16:9)</strong>. Keep important subjects near the centre; other sizes may be cropped.</p>
          <div className="admin-image-layout">
          <form className="admin-image-form" onSubmit={handleUpload}>
            <label htmlFor="admin-course">Course</label>
            <select id="admin-course" value={selectedCourseId} onChange={(event) => setSelectedCourseId(event.target.value)}>
              {imageCourses.map((course) => <option value={course.id} key={course.id}>{course.title}</option>)}
            </select>

            <label htmlFor="admin-module">Module</label>
            <select
              id="admin-module"
              value={selectedModuleNumber}
              onChange={(event) => setSelectedModuleNumber(event.target.value)}
              disabled={!selectedCourse}
            >
              {selectedCourse?.modules.map((module, index) => {
                const number = String(module.number || index + 1).padStart(2, '0')
                return <option value={number} key={number}>{number} — {module.title}</option>
              })}
            </select>

            <label htmlFor="admin-image-file">Choose a replacement image</label>
            <input
              key={`${selectedCourseId}-${selectedModuleNumber}-${previewVersion}`}
              id="admin-image-file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                const file = event.target.files?.[0] || null
                setSelectedFile(file)
                setNotice(null)
              }}
            />
            <p className="admin-help">Recommended: 1200 × 675 px (16:9) · JPEG, PNG or WebP under 20 MB; larger images are optimized before upload</p>

            <button type="submit" className="admin-upload-button" disabled={busy || !selectedFile}>
              <Upload size={17} /> {busy ? 'Saving…' : 'Replace module image'}
            </button>
            <button type="button" className="admin-remove-button" onClick={handleRemoveImage} disabled={busy || !hasCurrentImage}>
              <Trash2 size={16} /> Remove uploaded image
            </button>
          </form>

          <div className="admin-preview">
            <div className="admin-preview-image">
              {(localPreview || remotePreview || defaultModulePreview) && (
                <img
                  src={localPreview || remotePreview || defaultModulePreview}
                  alt={selectedModule ? `${selectedModule.title} preview` : 'Module image preview'}
                />
              )}
              {!localPreview && !remotePreview && !defaultModulePreview && (
                <div className="admin-empty-preview">
                  <ImageUp size={34} />
                  <span>{imageLoadError ? 'Image preview unavailable' : 'Choose a module'}</span>
                </div>
              )}
            </div>
            <div className="admin-preview-caption">
              <strong>{selectedModule?.title || 'Select a module'}</strong>
              <span>{selectedCourse?.title || 'Course module'}</span>
            </div>
          </div>
          </div>
        </div>}
      </section>
    </div>
  )
}
