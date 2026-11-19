import { useEffect, useMemo, useState } from 'react'
import { Plus, Save, Trash2, Upload } from 'lucide-react'
import { siteConfig } from '../config/siteConfig'
import { aiPythonCourses } from '../data/aiPythonCourses'
import { courseSyllabusFolders } from '../data/courseSyllabusFolders'
import syllabusData from '../data/courseSyllabi'
import { courses, filterRetiredCourses, filterRetiredCourseSyllabi, includeNewDefaultCourses } from '../data/courses'
import { faqs } from '../data/faqs'
import { sitePhotoFields } from '../data/sitePhotos'
import { prepareImageUpload } from '../lib/prepareImageUpload'
import courseImageFallback from '../assets/images/courses/covers/optimized/course-image-fallback.webp'
import './PageBuilder.css'

const settingFields = [
  ['name', 'Academy name'],
  ['tagline', 'Tagline'],
  ['phone', 'Phone'],
  ['email', 'Email'],
  ['secondaryEmail', 'Secondary email'],
  ['whatsappNumber', 'WhatsApp number'],
  ['trainingAreas', 'Training areas'],
]

function getDefaultCourseSyllabi() {
  return Object.fromEntries(courses.flatMap((course) => {
    const folder = courseSyllabusFolders[course.id]
    const syllabus = folder && syllabusData[folder]?.['3_Months']
    const sourceModules = syllabus?.modules || course.modules || []
    if (sourceModules.length === 0) return []
    const modules = sourceModules.map((module, index) => ({
      number: index + 1,
      title: module.title,
      topics: [...(module.topics || [])],
      activity: module.activity || module.description || '',
    }))
    return [[course.id, {
      modules,
      nextModuleNumber: modules.length + 1,
      workflow: [...(syllabus?.workflow || [])],
      buildItems: [...(syllabus?.buildItems || course.projects || []).map((item) => typeof item === 'string' ? item : item.title)],
    }]]
  }))
}

const initialContent = {
  settings: { ...siteConfig },
  courses,
  aiPythonCourses,
  faqs,
  courseSyllabi: getDefaultCourseSyllabi(),
}
const defaultSitePhotoByKey = new Map(sitePhotoFields.map(({ key, defaultImage }) => [key, defaultImage]))

async function readJsonResponse(response) {
  const result = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(result.error || 'The request could not be completed.')
  return result
}

function makeSlug(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function LinesEditor({ id, label, value, onChange, help }) {
  return (
    <div className="page-builder-field">
      <label htmlFor={id}>{label}</label>
      {help && <p className="field-help">{help}</p>}
      <textarea id={id} rows={4} value={(value || []).join('\n')} onChange={(event) => (
        onChange(event.target.value.split('\n').map((item) => item.trim()).filter(Boolean))
      )} />
    </div>
  )
}

function PhotoEditor({
  image,
  title,
  onImageUpload,
  onReset,
  busy,
  label = 'Course cover photo',
  help = 'Recommended: 1200 × 675 pixels (16:9). Keep important content near the centre because the photo appears in different-size frames. JPEG, PNG or WebP under 20 MB; larger images are optimized before upload.',
  fallbackImage = courseImageFallback,
}) {
  const [uploadStatus, setUploadStatus] = useState('')

  return (
    <div className="course-editor-image-row">
      <img
        src={image || fallbackImage}
        alt={`${title} cover preview`}
        onError={(event) => { event.currentTarget.src = fallbackImage }}
      />
      <div>
        <strong>{label}</strong>
        <p>{help}</p>
        <label className="admin-file-button">
          <Upload size={16} /> {busy ? 'Uploading…' : 'Choose a new photo'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={busy}
            onChange={async (event) => {
              const input = event.currentTarget
              const file = input.files?.[0]
              input.value = ''
              if (!file) return

              setUploadStatus(`Uploading ${file.name}…`)
              try {
                const uploaded = await onImageUpload(file)
                setUploadStatus(uploaded === true
                  ? `${file.name} uploaded and published.`
                  : `Upload failed: ${uploaded || 'please try again.'}`)
              } catch (error) {
                setUploadStatus(`Upload failed: ${error.message}`)
              }
            }}
          />
        </label>
        {onReset && (
          <button
            type="button"
            className="editor-secondary-button"
            disabled={busy}
            onClick={async () => {
              if (!window.confirm(`Restore the default photo for ${title}?`)) return
              setUploadStatus('Restoring default photo…')
              try {
                const restored = await onReset()
                setUploadStatus(restored === true
                  ? 'Default photo restored.'
                  : `Could not restore the default photo: ${restored || 'please try again.'}`)
              } catch (error) {
                setUploadStatus(`Could not restore the default photo: ${error.message}`)
              }
            }}
          >
            Restore default photo
          </button>
        )}
        {uploadStatus && <p className="field-help" role="status">{uploadStatus}</p>}
      </div>
    </div>
  )
}

function CourseForm({ course, syllabus, onChange, onSyllabusChange, onDelete, onImageUpload, onImageReset, busy }) {
  if (!course) return <p className="editor-empty">Add a course to start editing your course catalogue.</p>

  function update(key, value) {
    onChange({ ...course, [key]: value })
  }

  function updateSyllabusModule(index, key, value) {
    const modules = syllabus.modules.map((module, itemIndex) => (
      itemIndex === index ? { ...module, [key]: value } : module
    ))
    onSyllabusChange({ ...syllabus, modules })
  }

  return (
    <div className="guided-editor">
      <section className="content-editor-section">
        <h2>Course details</h2>
        <p>Update what visitors see on the course page. Changes appear after you save.</p>
        <PhotoEditor
          image={course.image}
          title={course.title}
          onImageUpload={onImageUpload}
          onReset={course.image?.startsWith('/api/course-image?course=') ? onImageReset : undefined}
          busy={busy}
        />
        <div className="content-settings-grid">
          {[
            ['title', 'Course name'],
            ['category', 'Category'],
            ['duration', 'Duration'],
            ['mode', 'Learning format'],
            ['level', 'Experience level'],
          ].map(([key, label]) => (
            <div className="page-builder-field" key={key}>
              <label htmlFor={`course-${key}`}>{label}</label>
              <input id={`course-${key}`} value={course[key] || ''} onChange={(event) => update(key, event.target.value)} />
            </div>
          ))}
        </div>
        <p className="field-help">Renaming a course does not change its existing website page.</p>
        {[
          ['description', 'Short description'],
          ['overview', 'Course overview'],
          ['suitableFor', 'Who this course is for'],
          ['prerequisites', 'What learners need before starting'],
        ].map(([key, label]) => (
          <div className="page-builder-field" key={key}>
            <label htmlFor={`course-${key}`}>{label}</label>
            <textarea id={`course-${key}`} rows={3} value={course[key] || ''} onChange={(event) => update(key, event.target.value)} />
          </div>
        ))}
        <div className="content-settings-grid">
          <LinesEditor id="course-technologies" label="Tools and topics" value={course.technologies} onChange={(value) => update('technologies', value)} help="One item per line." />
          <LinesEditor id="course-skills" label="Skills learners gain" value={course.skills} onChange={(value) => update('skills', value)} help="One item per line." />
          <LinesEditor id="course-outcomes" label="Learning outcomes" value={course.outcomes} onChange={(value) => update('outcomes', value)} help="One item per line." />
          <LinesEditor id="course-projects" label="Project ideas" value={course.projects} onChange={(value) => update('projects', value)} help="One project per line." />
        </div>
      </section>

      <section className="content-editor-section">
        <div className="editor-section-heading">
          <div><h2>Course modules</h2><p>Edit these modules, topics and activities; they appear on the course page and course cards.</p></div>
          <button type="button" className="editor-secondary-button" disabled={(syllabus.nextModuleNumber || Math.max(0, ...syllabus.modules.map((module) => module.number)) + 1) > 99} onClick={() => {
            const number = syllabus.nextModuleNumber || Math.max(0, ...syllabus.modules.map((module) => module.number)) + 1
            onSyllabusChange({
              ...syllabus,
              nextModuleNumber: number + 1,
              modules: [...syllabus.modules, { number, title: '', topics: [], activity: '' }],
            })
          }}>
            <Plus size={16} /> Add module
          </button>
        </div>
        <div className="editor-item-list">
          {syllabus.modules.map((module, index) => (
            <fieldset className="editor-item" key={`${course.id}-module-${module.number}`}>
              <legend>Module {String(module.number).padStart(2, '0')}</legend>
              <button type="button" className="editor-delete-button" aria-label={`Remove module ${module.number}`} onClick={() => {
                if (!window.confirm(`Remove module ${module.number}? Other module photos will stay with their modules.`)) return
                onSyllabusChange({ ...syllabus, modules: syllabus.modules.filter((item) => item.number !== module.number) })
              }}>
                <Trash2 size={16} />
              </button>
              <div className="page-builder-field">
                <label htmlFor={`outline-title-${index}`}>Module name</label>
                <input id={`outline-title-${index}`} value={module.title || ''} onChange={(event) => updateSyllabusModule(index, 'title', event.target.value)} />
              </div>
              <LinesEditor
                id={`outline-topics-${index}`}
                label="Topics covered"
                help="One topic per line."
                value={module.topics}
                onChange={(topics) => updateSyllabusModule(index, 'topics', topics)}
              />
              <div className="page-builder-field">
                <label htmlFor={`outline-activity-${index}`}>Practice activity</label>
                <textarea id={`outline-activity-${index}`} rows={2} value={module.activity || ''} onChange={(event) => updateSyllabusModule(index, 'activity', event.target.value)} />
              </div>
            </fieldset>
          ))}
        </div>
        <div className="content-settings-grid">
          <LinesEditor id="course-workflow" label="Learning steps" value={syllabus.workflow} onChange={(workflow) => onSyllabusChange({ ...syllabus, workflow })} help="One step per line." />
          <LinesEditor id="course-build-items" label="Practical projects in the outline" value={syllabus.buildItems} onChange={(buildItems) => onSyllabusChange({ ...syllabus, buildItems })} help="One project per line." />
        </div>
      </section>
      <div className="page-builder-footer">
        <button type="button" className="editor-danger-button" onClick={onDelete}><Trash2 size={16} /> Delete course</button>
      </div>
    </div>
  )
}

export default function SiteContentPanel({ section = 'site' }) {
  const [content, setContent] = useState(initialContent)
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '')
  const [selectedProgramId, setSelectedProgramId] = useState(aiPythonCourses[0]?.id || '')
  const [newCourseName, setNewCourseName] = useState('')
  const [newProgramName, setNewProgramName] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(null)
  const [expandedSection, setExpandedSection] = useState('courses')
  const isSiteSection = section === 'site'
  const selectedCourse = useMemo(() => content.courses.find((course) => course.id === selectedCourseId), [content.courses, selectedCourseId])
  const selectedSyllabus = selectedCourse
    ? content.courseSyllabi[selectedCourse.id] || { modules: [], workflow: [], buildItems: [] }
    : null
  const selectedProgram = useMemo(() => content.aiPythonCourses.find((program) => program.id === selectedProgramId), [content.aiPythonCourses, selectedProgramId])

  useEffect(() => {
    let active = true
    fetch('/api/admin/content', { credentials: 'same-origin' })
      .then(readJsonResponse)
      .then((result) => {
        if (!active || !result.content) return
        const nextContent = {
          ...initialContent,
          ...result.content,
          courses: filterRetiredCourses(includeNewDefaultCourses(result.content.courses || initialContent.courses)),
          settings: { ...siteConfig, ...result.content.settings },
          courseSyllabi: {
            ...initialContent.courseSyllabi,
            ...filterRetiredCourseSyllabi(result.content.courseSyllabi || {}),
          },
        }
        setContent(nextContent)
        if (nextContent.courses[0]) setSelectedCourseId(nextContent.courses[0].id)
        if (nextContent.aiPythonCourses[0]) setSelectedProgramId(nextContent.aiPythonCourses[0].id)
      })
      .catch((error) => {
        if (active) setNotice({ type: 'error', text: error.message })
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  async function persistContent(nextContent, successMessage = 'Website content saved.') {
    const persistedContent = {
      ...nextContent,
      settings: Object.fromEntries(Object.entries(nextContent.settings)
        .filter(([key, value]) => defaultSitePhotoByKey.get(key) !== value)),
    }
    await readJsonResponse(await fetch('/api/admin/content', {
      method: 'PUT',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: persistedContent }),
    }))
    setContent(nextContent)
    window.dispatchEvent(new Event('managed-content-updated'))
    setNotice({ type: 'success', text: successMessage })
  }

  async function saveContent(event) {
    event.preventDefault()
    setBusy(true)
    setNotice(null)
    try {
      await persistContent(content, 'Website content saved and published.')
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setBusy(false)
    }
  }

  function updateSetting(key, value) {
    setContent((current) => ({ ...current, settings: { ...current.settings, [key]: value } }))
  }

  function updateCourse(updatedCourse) {
    setContent((current) => ({
      ...current,
      courses: current.courses.map((course) => course.id === updatedCourse.id ? updatedCourse : course),
    }))
  }

  function updateSyllabus(courseId, syllabus) {
    const modules = syllabus.modules.map((module) => ({
      title: module.title,
      description: module.activity || module.topics.join(', '),
    }))
    setContent((current) => ({
      ...current,
      courseSyllabi: { ...current.courseSyllabi, [courseId]: syllabus },
      courses: current.courses.map((course) => course.id === courseId ? { ...course, modules } : course),
    }))
  }

  function addCourse() {
    const slug = makeSlug(newCourseName)
    if (!slug) {
      setNotice({ type: 'error', text: 'Enter a course name first.' })
      return
    }
    if (content.courses.some((course) => course.id === slug || course.slug === slug)) {
      setNotice({ type: 'error', text: 'A course with that name or web address already exists.' })
      return
    }
    const course = {
      id: slug,
      slug,
      title: newCourseName.trim(),
      category: 'New course',
      description: '',
      duration: '',
      mode: '',
      image: courseImageFallback,
      overview: '',
      suitableFor: '',
      level: '',
      technologies: [],
      modules: [],
      skills: [],
      outcomes: [],
      projects: [],
      prerequisites: '',
    }
    setContent((current) => ({
      ...current,
      courses: [...current.courses, course],
      courseSyllabi: {
        ...current.courseSyllabi,
        [slug]: { modules: [], workflow: [], buildItems: [] },
      },
    }))
    setSelectedCourseId(slug)
    setNewCourseName('')
    setNotice(null)
  }

  function deleteCourse() {
    if (!selectedCourse || !window.confirm(`Delete “${selectedCourse.title}” from the course catalogue?`)) return
    const coursesAfterDelete = content.courses.filter((course) => course.id !== selectedCourse.id)
    const { [selectedCourse.id]: removedSyllabus, ...remainingSyllabi } = content.courseSyllabi
    setContent((current) => ({ ...current, courses: coursesAfterDelete, courseSyllabi: remainingSyllabi }))
    setSelectedCourseId(coursesAfterDelete[0]?.id || '')
    setNotice(null)
  }

  async function replaceContentImage(listName, itemId, file) {
    setBusy(true)
    setNotice(null)
    try {
      const image = await prepareImageUpload(file)
      const imageResult = await readJsonResponse(await fetch(`/api/course-image?course=${encodeURIComponent(itemId)}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(image),
      }))
      const nextContent = {
        ...content,
        [listName]: content[listName].map((item) => item.id === itemId
          ? { ...item, image: imageResult.image }
          : item),
      }
      await persistContent(nextContent, 'Course photo replaced.')
      return true
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
      return error.message
    } finally {
      setBusy(false)
    }
  }

  async function replaceSitePhoto(key, file) {
    setBusy(true)
    setNotice(null)
    try {
      const image = await prepareImageUpload(file)
      const imageResult = await readJsonResponse(await fetch(`/api/site-image?key=${encodeURIComponent(key)}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(image),
      }))
      const nextContent = {
        ...content,
        settings: { ...content.settings, [key]: imageResult.image },
      }
      await persistContent(nextContent, 'Site photo replaced.')
      return true
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
      return error.message
    } finally {
      setBusy(false)
    }
  }

  async function resetContentImage(listName, itemId) {
    const defaults = listName === 'courses' ? courses : aiPythonCourses
    const defaultImage = defaults.find((item) => item.id === itemId)?.image || courseImageFallback
    const nextContent = {
      ...content,
      [listName]: content[listName].map((item) => item.id === itemId
        ? { ...item, image: defaultImage }
        : item),
    }

    setBusy(true)
    setNotice(null)
    try {
      await persistContent(nextContent, 'Default course photo restored.')
      await readJsonResponse(await fetch(`/api/course-image?course=${encodeURIComponent(itemId)}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      }))
      return true
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
      return error.message
    } finally {
      setBusy(false)
    }
  }

  async function resetSitePhoto(key) {
    const nextContent = {
      ...content,
      settings: { ...content.settings, [key]: sitePhotoFields.find((photo) => photo.key === key)?.defaultImage },
    }

    setBusy(true)
    setNotice(null)
    try {
      await persistContent(nextContent, 'Default site photo restored.')
      await readJsonResponse(await fetch(`/api/site-image?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      }))
      return true
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
      return error.message
    } finally {
      setBusy(false)
    }
  }

  function addProgram() {
    const slug = makeSlug(newProgramName)
    if (!slug) {
      setNotice({ type: 'error', text: 'Enter a programme name first.' })
      return
    }
    if (content.aiPythonCourses.some((program) => program.id === slug || program.slug === slug)) {
      setNotice({ type: 'error', text: 'A programme with that name or web address already exists.' })
      return
    }
    const program = {
      id: slug,
      slug,
      title: newProgramName.trim(),
      category: '',
      description: '',
      overview: '',
      suitableFor: '',
      prerequisites: '',
      duration: '',
      level: '',
      image: courseImageFallback,
      technologies: [],
      curriculum: [],
      outcomes: [],
      projects: [],
    }
    setContent((current) => ({ ...current, aiPythonCourses: [...current.aiPythonCourses, program] }))
    setSelectedProgramId(slug)
    setNewProgramName('')
    setNotice(null)
  }

  function updateProgram(updatedProgram) {
    setContent((current) => ({
      ...current,
      aiPythonCourses: current.aiPythonCourses.map((program) => program.id === updatedProgram.id ? updatedProgram : program),
    }))
  }

  if (loading) return <p>Loading website content…</p>

  return (
    <form className="site-content-panel" onSubmit={saveContent}>
      {notice && <p className={`admin-notice ${notice.type === 'error' ? 'admin-notice-error' : 'admin-notice-success'}`} role="status">{notice.text}</p>}

      {isSiteSection && <>
        <section className="content-editor-section">
          <h2>Business and brand settings</h2>
          <p>These details appear across the public website.</p>
          <div className="content-settings-grid">
            {settingFields.map(([key, label]) => (
              <div className="page-builder-field" key={key}>
                <label htmlFor={`site-setting-${key}`}>{label}</label>
                {key === 'trainingAreas' ? (
                  <textarea id={`site-setting-${key}`} rows={3} value={content.settings[key] || ''} onChange={(event) => updateSetting(key, event.target.value)} />
                ) : (
                  <input id={`site-setting-${key}`} value={content.settings[key] || ''} onChange={(event) => updateSetting(key, event.target.value)} />
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="content-editor-section">
          <h2>Site photos and logos</h2>
          <p>Replace photos used across the home, About, AI &amp; data, and Corporate pages, as well as the header and footer logos.</p>
          <div className="site-photo-grid">
            {sitePhotoFields.map(({ key, title, defaultImage }) => (
              <PhotoEditor
                key={key}
                image={content.settings[key] || defaultImage}
                title={title}
                label={title}
                fallbackImage={defaultImage}
                help="JPEG, PNG or WebP under 20 MB; larger images are optimized before upload."
                onImageUpload={(file) => replaceSitePhoto(key, file)}
                onReset={content.settings[key]?.startsWith(`/api/site-image?key=${encodeURIComponent(key)}`)
                  ? () => resetSitePhoto(key)
                  : undefined}
                busy={busy}
              />
            ))}
          </div>
        </section>

        <section className="content-editor-section" aria-labelledby="site-faq-heading">
          <div className="editor-section-heading">
            <div><h2 id="site-faq-heading">Frequently asked questions</h2><p>Add, edit or remove the answers shown on the website.</p></div>
            <button type="button" className="editor-secondary-button" onClick={() => setContent((current) => ({ ...current, faqs: [...current.faqs, { question: '', answer: '' }] }))}><Plus size={16} /> Add question</button>
          </div>
          <div className="editor-item-list">
            {content.faqs.map((faq, index) => (
              <fieldset className="editor-item" key={`faq-${index}`}>
                <legend>Question {index + 1}</legend>
                <button type="button" className="editor-delete-button" aria-label={`Remove question ${index + 1}`} onClick={() => setContent((current) => ({ ...current, faqs: current.faqs.filter((_, itemIndex) => itemIndex !== index) }))}><Trash2 size={16} /></button>
                <label htmlFor={`faq-question-${index}`}>Question</label>
                <input id={`faq-question-${index}`} value={faq.question} onChange={(event) => setContent((current) => ({ ...current, faqs: current.faqs.map((item, itemIndex) => itemIndex === index ? { ...item, question: event.target.value } : item) }))} />
                <label htmlFor={`faq-answer-${index}`}>Answer</label>
                <textarea id={`faq-answer-${index}`} rows={3} value={faq.answer} onChange={(event) => setContent((current) => ({ ...current, faqs: current.faqs.map((item, itemIndex) => itemIndex === index ? { ...item, answer: event.target.value } : item) }))} />
              </fieldset>
            ))}
          </div>
        </section>
      </>}

      {!isSiteSection && <>
        <nav className="content-editor-nav" aria-label="Course content sections">
          {[
            ['courses', 'Courses and modules'],
            ['programmes', 'AI & Python programmes'],
          ].map(([value, label]) => (
            <button type="button" key={value} className={expandedSection === value ? 'editor-nav-active' : ''} onClick={() => setExpandedSection(value)}>
              {label}
            </button>
          ))}
        </nav>
      </>}

      {!isSiteSection && expandedSection === 'courses' && (
        <section className="content-editor-section">
          <div className="editor-section-heading">
            <div><h2>Courses and modules</h2><p>Choose a course to edit, or add a new course. Use the photo button to replace its current picture.</p></div>
          </div>
          <div className="course-picker">
            <div className="page-builder-field">
              <label htmlFor="managed-course">Choose a course</label>
              <select id="managed-course" value={selectedCourseId} onChange={(event) => setSelectedCourseId(event.target.value)}>
                {content.courses.map((course) => <option value={course.id} key={course.id}>{course.title}</option>)}
              </select>
            </div>
            <div className="add-course-control">
              <label htmlFor="new-course-name">Add a course</label>
              <div>
                <input id="new-course-name" value={newCourseName} onChange={(event) => setNewCourseName(event.target.value)} placeholder="For example, Excel for Business" />
                <button type="button" className="editor-secondary-button" onClick={addCourse}><Plus size={16} /> Add course</button>
              </div>
            </div>
          </div>
          <CourseForm
            course={selectedCourse}
            syllabus={selectedSyllabus}
            onChange={updateCourse}
            onSyllabusChange={(syllabus) => updateSyllabus(selectedCourse.id, syllabus)}
            onDelete={deleteCourse}
            onImageUpload={(file) => replaceContentImage('courses', selectedCourse.id, file)}
            onImageReset={() => resetContentImage('courses', selectedCourse.id)}
            busy={busy}
          />
        </section>
      )}

      {!isSiteSection && expandedSection === 'programmes' && (
        <section className="content-editor-section">
          <div className="editor-section-heading"><div><h2>AI & Python programmes</h2><p>Edit programme details and learning topics using the fields below.</p></div></div>
          <div className="course-picker">
            <div className="page-builder-field">
              <label htmlFor="managed-program">Choose a programme</label>
              <select id="managed-program" value={selectedProgramId} onChange={(event) => setSelectedProgramId(event.target.value)}>
                {content.aiPythonCourses.map((program) => <option value={program.id} key={program.id}>{program.title}</option>)}
              </select>
            </div>
            <div className="add-course-control">
              <label htmlFor="new-program-name">Add a programme</label>
              <div>
                <input id="new-program-name" value={newProgramName} onChange={(event) => setNewProgramName(event.target.value)} placeholder="Programme name" />
                <button type="button" className="editor-secondary-button" onClick={addProgram}><Plus size={16} /> Add programme</button>
              </div>
            </div>
          </div>
          {selectedProgram && (
            <div className="guided-editor">
              <div className="content-settings-grid">
                {[
                  ['title', 'Programme name'],
                  ['category', 'Category'],
                  ['duration', 'Duration'],
                  ['level', 'Experience level'],
                ].map(([key, label]) => (
                  <div className="page-builder-field" key={key}>
                    <label htmlFor={`program-${key}`}>{label}</label>
                    <input id={`program-${key}`} value={selectedProgram[key] || ''} onChange={(event) => updateProgram({ ...selectedProgram, [key]: event.target.value })} />
                  </div>
                ))}
                <PhotoEditor
                  image={selectedProgram.image}
                  title={selectedProgram.title}
                  onImageUpload={(file) => replaceContentImage('aiPythonCourses', selectedProgram.id, file)}
                  onReset={selectedProgram.image?.startsWith('/api/course-image?course=')
                    ? () => resetContentImage('aiPythonCourses', selectedProgram.id)
                    : undefined}
                  busy={busy}
                />
              </div>
              {[
                ['description', 'Short description'],
                ['overview', 'Programme overview'],
                ['suitableFor', 'Who this programme is for'],
                ['prerequisites', 'What learners need before starting'],
              ].map(([key, label]) => (
                <div className="page-builder-field" key={key}>
                  <label htmlFor={`program-${key}`}>{label}</label>
                  <textarea id={`program-${key}`} rows={3} value={selectedProgram[key] || ''} onChange={(event) => updateProgram({ ...selectedProgram, [key]: event.target.value })} />
                </div>
              ))}
              <LinesEditor id="program-technologies" label="Tools and topics" value={selectedProgram.technologies} onChange={(technologies) => updateProgram({ ...selectedProgram, technologies })} help="One item per line." />
              <LinesEditor id="program-outcomes" label="Learning outcomes" value={selectedProgram.outcomes} onChange={(outcomes) => updateProgram({ ...selectedProgram, outcomes })} help="One item per line." />
              <div className="editor-section-heading">
                <div><h2>Learning topics</h2><p>Add or change the topics included in this programme.</p></div>
                <button type="button" className="editor-secondary-button" onClick={() => updateProgram({ ...selectedProgram, curriculum: [...selectedProgram.curriculum, { title: '', description: '' }] })}><Plus size={16} /> Add topic</button>
              </div>
              <div className="editor-item-list">
                {selectedProgram.curriculum.map((item, index) => (
                  <fieldset className="editor-item" key={`${selectedProgram.id}-topic-${index}`}>
                    <legend>Topic {index + 1}</legend>
                    <button type="button" className="editor-delete-button" aria-label={`Remove topic ${index + 1}`} onClick={() => updateProgram({ ...selectedProgram, curriculum: selectedProgram.curriculum.filter((_, itemIndex) => itemIndex !== index) })}><Trash2 size={16} /></button>
                    <label htmlFor={`program-topic-title-${index}`}>Topic name</label>
                    <input id={`program-topic-title-${index}`} value={item.title || ''} onChange={(event) => updateProgram({ ...selectedProgram, curriculum: selectedProgram.curriculum.map((topic, topicIndex) => topicIndex === index ? { ...topic, title: event.target.value } : topic) })} />
                    <label htmlFor={`program-topic-description-${index}`}>What learners will cover</label>
                    <textarea id={`program-topic-description-${index}`} rows={3} value={item.description || ''} onChange={(event) => updateProgram({ ...selectedProgram, curriculum: selectedProgram.curriculum.map((topic, topicIndex) => topicIndex === index ? { ...topic, description: event.target.value } : topic) })} />
                  </fieldset>
                ))}
              </div>
              <div className="editor-section-heading">
                <div><h2>Project ideas</h2><p>Add or change the learning projects for this programme.</p></div>
                <button type="button" className="editor-secondary-button" onClick={() => updateProgram({ ...selectedProgram, projects: [...selectedProgram.projects, { title: '', description: '' }] })}><Plus size={16} /> Add project</button>
              </div>
              <div className="editor-item-list">
                {selectedProgram.projects.map((project, index) => (
                  <fieldset className="editor-item" key={`${selectedProgram.id}-project-${index}`}>
                    <legend>Project {index + 1}</legend>
                    <button type="button" className="editor-delete-button" aria-label={`Remove project ${index + 1}`} onClick={() => updateProgram({ ...selectedProgram, projects: selectedProgram.projects.filter((_, itemIndex) => itemIndex !== index) })}><Trash2 size={16} /></button>
                    <label htmlFor={`program-project-title-${index}`}>Project name</label>
                    <input id={`program-project-title-${index}`} value={project.title || ''} onChange={(event) => updateProgram({ ...selectedProgram, projects: selectedProgram.projects.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) })} />
                    <label htmlFor={`program-project-description-${index}`}>What learners will build</label>
                    <textarea id={`program-project-description-${index}`} rows={3} value={project.description || ''} onChange={(event) => updateProgram({ ...selectedProgram, projects: selectedProgram.projects.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item) })} />
                  </fieldset>
                ))}
              </div>
              <div className="page-builder-footer">
                <button type="button" className="editor-danger-button" onClick={() => {
                  if (!window.confirm(`Delete “${selectedProgram.title}” from the programme list?`)) return
                  const remainingPrograms = content.aiPythonCourses.filter((program) => program.id !== selectedProgram.id)
                  setContent((current) => ({ ...current, aiPythonCourses: remainingPrograms }))
                  setSelectedProgramId(remainingPrograms[0]?.id || '')
                }}><Trash2 size={16} /> Delete programme</button>
              </div>
            </div>
          )}
        </section>
      )}

      <div className="page-builder-footer">
        <button type="submit" disabled={busy}>{busy ? 'Saving…' : <><Save size={16} /> Save all changes</>}</button>
      </div>
    </form>
  )
}
