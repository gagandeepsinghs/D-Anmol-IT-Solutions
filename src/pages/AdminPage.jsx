import { useMemo, useState } from 'react'
import { Archive, Eye, EyeOff, Pencil, Plus, Save, Trash2 } from 'lucide-react'
import { categories } from '../data/categories'
import { courses as defaultCourses } from '../data/courses'
import { useAppData } from '../context/AppDataContext'

const freshCourse = () => ({ id: '', slug: '', title: '', category: categories[0], description: '', duration: '', mode: 'Online or classroom', image: '', overview: '', modules: 'Course foundations\nGuided practice\nPractical project', skills: 'Practical skills', projects: 'A guided practical project', prerequisites: 'No prior experience required.', published: true })
const formatModules = (modules = [], fallbackModules = []) => modules.map((module, index) => {
  if (typeof module !== 'string') return `${module.title} — ${module.description}`
  const defaultModule = fallbackModules.find((item) => item.title === module) || fallbackModules[index]
  return defaultModule ? `${defaultModule.title} — ${defaultModule.description}` : `${module} — Explore this topic through guided examples and practical exercises.`
}).join('\n')
const parseModules = (value) => value.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
  const separator = line.indexOf(' — ')
  if (separator < 0) {
    return { title: line, description: `Explore ${line.toLowerCase()} through guided examples and practical exercises.` }
  }
  return { title: line.slice(0, separator).trim(), description: line.slice(separator + 3).trim() }
})

export default function AdminPage() {
  const { courses, setCourses, enquiries, storageNotice } = useAppData()
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(freshCourse())
  const [message, setMessage] = useState('')
  const visibleEnquiries = useMemo(() => [...enquiries].reverse(), [enquiries])

  const beginAdd = () => { setEditingId(null); setForm(freshCourse()); setMessage('') }
  const beginEdit = (course) => {
    setEditingId(course.id)
    setForm({
      ...freshCourse(),
      ...course,
      modules: formatModules(course.modules, defaultCourses.find((item) => item.id === course.id)?.modules),
      skills: (course.skills || []).join('\n'),
      projects: (course.projects || []).join('\n'),
    })
    setMessage('')
  }
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const saveCourse = (event) => {
    event.preventDefault()
    const title = form.title.trim()
    if (!title || !form.description.trim()) {
      setMessage('Course title and description are required.')
      return
    }
    const slug = (form.slug || title).toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    if (courses.some((item) => item.id !== editingId && (item.slug === slug || item.id === slug))) {
      setMessage('A course with this URL slug already exists.')
      return
    }
    const course = {
      ...form,
      title,
      slug,
      id: editingId || slug,
      image: form.image.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85',
      modules: parseModules(form.modules),
      skills: form.skills.split('\n').map((item) => item.trim()).filter(Boolean),
      projects: form.projects.split('\n').map((item) => item.trim()).filter(Boolean),
    }
    setCourses((current) => editingId ? current.map((item) => item.id === editingId ? course : item) : [course, ...current])
    setMessage(editingId ? 'Course updated in this browser demo.' : 'Course added to this browser demo.')
    setEditingId(course.id)
  }
  const removeCourse = (course) => {
    if (window.confirm(`Delete “${course.title}” from this browser demo?`)) {
      setCourses((current) => current.filter((item) => item.id !== course.id))
      if (editingId === course.id) beginAdd()
      setMessage('Course removed from this browser demo.')
    }
  }
  const togglePublished = (course) => {
    setCourses((current) => current.map((item) => item.id === course.id ? { ...item, published: item.published === false } : item))
  }

  return <section className="admin-page"><div className="page-wrap admin-wrap">
    <div className="admin-demo-warning"><span><Archive size={18} /></span><div><strong>Demo admin dashboard</strong><p>This interface has no secure authentication or production access control. Course changes and demo enquiries are stored only in this browser’s local storage. Do not enter sensitive information.</p></div></div>
    {storageNotice && <div className="storage-warning" role="alert">{storageNotice}</div>}
    <div className="admin-heading"><div><span className="eyebrow">Local demo controls</span><h1>Manage learning content.</h1><p>Changes appear on the public site in this browser only.</p></div><button type="button" className="button button-primary" onClick={beginAdd}><Plus size={17} /> Add course</button></div>
    <div className="admin-layout"><section className="admin-panel"><div className="admin-panel-heading"><div><span className="eyebrow">Course management</span><h2>Courses <span className="admin-count">{courses.length}</span></h2></div></div><div className="admin-course-list">{courses.map((course) => <article className={`admin-course-item ${editingId === course.id ? 'admin-course-selected' : ''}`} key={course.id}><div className="admin-course-image"><img src={course.image} alt="" loading="lazy" /></div><div className="admin-course-title"><strong>{course.title}</strong><span>{course.category}</span><span className={`publish-status ${course.published === false ? 'unpublished' : ''}`}>{course.published === false ? 'Unpublished' : 'Published'}</span></div><div className="admin-course-actions"><button type="button" aria-label={`Edit ${course.title}`} title="Edit course" onClick={() => beginEdit(course)}><Pencil size={16} /></button><button type="button" aria-label={`${course.published === false ? 'Publish' : 'Unpublish'} ${course.title}`} title={course.published === false ? 'Publish' : 'Unpublish'} onClick={() => togglePublished(course)}>{course.published === false ? <Eye size={17} /> : <EyeOff size={17} />}</button><button type="button" aria-label={`Delete ${course.title}`} title="Delete course" onClick={() => removeCourse(course)}><Trash2 size={16} /></button></div></article>)}</div></section>
    <section className="admin-panel admin-editor"><div className="admin-panel-heading"><div><span className="eyebrow">{editingId ? 'Edit course' : 'Create course'}</span><h2>{editingId ? 'Update course details' : 'Add a course'}</h2></div></div><form className="admin-course-form" onSubmit={saveCourse}>
      <label><span>Course title *</span><input name="title" value={form.title} onChange={update} required /></label>
      <label><span>URL slug</span><input name="slug" value={form.slug} onChange={update} placeholder="Generated from course title" /></label>
      <label><span>Category</span><select name="category" value={form.category} onChange={update}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>Duration</span><input name="duration" value={form.duration} onChange={update} placeholder="e.g. 8 weeks" /></label>
      <label><span>Learning mode</span><input name="mode" value={form.mode} onChange={update} /></label>
      <label><span>Image URL</span><input name="image" value={form.image} onChange={update} placeholder="Optional image URL" /></label>
      <label><span>Description *</span><textarea name="description" value={form.description} onChange={update} rows="3" required /></label>
      <label><span>Overview</span><textarea name="overview" value={form.overview} onChange={update} rows="3" /></label>
      <label><span>Suitable learners</span><textarea name="suitableFor" value={form.suitableFor} onChange={update} rows="3" /></label>
      <label><span>Tools and technologies <small>One per line</small></span><textarea name="technologies" value={form.technologies} onChange={update} rows="3" /></label>
      <label><span>Syllabus modules <small>One per line: title — explanation</small></span><textarea name="modules" value={form.modules} onChange={update} rows="6" /></label>
      <label><span>Learning outcomes <small>One per line</small></span><textarea name="outcomes" value={form.outcomes} onChange={update} rows="4" /></label>
      <label><span>Skills covered <small>One per line</small></span><textarea name="skills" value={form.skills} onChange={update} rows="3" /></label>
      <label><span>Practical projects <small>One per line</small></span><textarea name="projects" value={form.projects} onChange={update} rows="3" /></label>
      <label><span>Prerequisites</span><textarea name="prerequisites" value={form.prerequisites} onChange={update} rows="2" /></label>
      <label className="admin-publish-check"><input type="checkbox" checked={form.published !== false} onChange={(event) => setForm({ ...form, published: event.target.checked })} /> Publish on the public course page</label>
      {message && <p className={`admin-message ${message.includes('required') ? 'form-error' : ''}`} role="status">{message}</p>}
      <div className="admin-form-actions"><button className="button button-primary" type="submit"><Save size={16} /> Save course</button><button className="button button-quiet" type="button" onClick={beginAdd}>Clear form</button></div>
    </form></section></div>
    <section className="admin-panel enquiries-panel"><div className="admin-panel-heading"><div><span className="eyebrow">Browser-only demo data</span><h2>Demo enquiries <span className="admin-count">{enquiries.length}</span></h2></div></div>{visibleEnquiries.length ? <div className="enquiry-table-wrap"><table className="enquiry-table"><thead><tr><th>Name</th><th>Email</th><th>Type</th><th>Interest</th><th>Received</th></tr></thead><tbody>{visibleEnquiries.map((enquiry, index) => <tr key={`${enquiry.createdAt}-${index}`}><td>{enquiry.name}</td><td>{enquiry.email}</td><td>{enquiry.kind}</td><td>{enquiry.interest || '—'}</td><td>{new Date(enquiry.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div> : <div className="admin-empty"><p>No demo enquiries saved in this browser yet.</p><span>Public forms make sample submissions for testing only.</span></div>}</section>
  </div></section>
}
