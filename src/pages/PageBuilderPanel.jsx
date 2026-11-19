import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from 'lucide-react'
import { publicSitePaths } from '../data/publicSitePaths'
import { pageSeoByPath } from '../data/seoMetadata'
import './PageBuilder.css'

const sectionTypes = [
  ['hero', 'Hero'],
  ['text', 'Text and content'],
  ['image', 'Image and text'],
  ['courses', 'Course list'],
  ['faq', 'FAQ list'],
  ['cta', 'Call to action'],
]

function createPage(path) {
  const seo = pageSeoByPath[path]
  return {
    path,
    title: seo?.title || 'New page',
    description: seo?.description || '',
    published: false,
    sections: [],
  }
}

function createSection(type) {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    eyebrow: '',
    heading: '',
    body: '',
    imageUrl: '',
    imageAlt: '',
    buttonText: '',
    buttonUrl: '',
  }
}

async function readJsonResponse(response) {
  const result = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(result.error || 'The request could not be completed.')
  return result
}

export default function PageBuilderPanel() {
  const [pages, setPages] = useState({})
  const [selectedPath, setSelectedPath] = useState('/')
  const [draft, setDraft] = useState(() => createPage('/'))
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(null)
  const [newPageSlug, setNewPageSlug] = useState('')
  const availablePaths = [...new Set([...publicSitePaths, ...Object.keys(pages), selectedPath])].sort()
  const selectedPage = useMemo(() => pages[selectedPath], [pages, selectedPath])

  useEffect(() => {
    let active = true
    fetch('/api/admin/pages', { credentials: 'same-origin' })
      .then(readJsonResponse)
      .then((result) => {
        if (!active) return
        const pageMap = Object.fromEntries((result.pages || []).map((page) => [page.path, page]))
        setPages(pageMap)
        setDraft(pageMap[selectedPath] || createPage(selectedPath))
      })
      .catch((error) => {
        if (active) setNotice({ type: 'error', text: error.message })
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  function choosePage(path) {
    setSelectedPath(path)
    setDraft(pages[path] || createPage(path))
    setNotice(null)
  }

  function createCustomPage() {
    const slug = newPageSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    if (!slug) {
      setNotice({ type: 'error', text: 'Enter a page name using letters or numbers.' })
      return
    }
    const path = `/pages/${slug}`
    setSelectedPath(path)
    setDraft(pages[path] || createPage(path))
    setNewPageSlug('')
    setNotice(null)
  }

  function updateSection(index, key, value) {
    setDraft((current) => ({
      ...current,
      sections: current.sections.map((section, sectionIndex) => (
        sectionIndex === index ? { ...section, [key]: value } : section
      )),
    }))
  }

  function moveSection(index, offset) {
    const nextIndex = index + offset
    if (nextIndex < 0 || nextIndex >= draft.sections.length) return
    const sections = [...draft.sections]
    ;[sections[index], sections[nextIndex]] = [sections[nextIndex], sections[index]]
    setDraft((current) => ({ ...current, sections }))
  }

  async function savePage(event) {
    event.preventDefault()
    setBusy(true)
    setNotice(null)
    try {
      const result = await readJsonResponse(await fetch('/api/admin/pages', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: draft }),
      }))
      const savedPage = result.page
      setPages((current) => ({ ...current, [selectedPath]: savedPage }))
      setDraft(savedPage)
      window.dispatchEvent(new Event('managed-pages-updated'))
      setNotice({ type: 'success', text: savedPage.published ? 'Page saved and published.' : 'Draft saved. Publish it when you are ready.' })
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setBusy(false)
    }
  }

  async function deletePage() {
    if (!selectedPage || !window.confirm(`Delete the managed version of ${selectedPath}? The original website page will be shown again.`)) return
    setBusy(true)
    setNotice(null)
    try {
      await readJsonResponse(await fetch('/api/admin/pages', {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: selectedPath }),
      }))
      setPages((current) => {
        const next = { ...current }
        delete next[selectedPath]
        return next
      })
      window.dispatchEvent(new Event('managed-pages-updated'))
      setDraft(createPage(selectedPath))
      setNotice({ type: 'success', text: 'Managed page deleted. The original website page is active again.' })
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <p>Loading website pages…</p>

  return (
    <div className="page-builder">
      {notice && <p className={`admin-notice ${notice.type === 'error' ? 'admin-notice-error' : 'admin-notice-success'}`} role="status">{notice.text}</p>}
      <form onSubmit={savePage}>
        <div className="page-builder-top">
          <div className="page-builder-field">
            <label htmlFor="managed-page-path">Page to edit</label>
            <select id="managed-page-path" value={selectedPath} onChange={(event) => choosePage(event.target.value)} disabled={busy}>
              {availablePaths.map((path) => <option value={path} key={path}>{path === '/' ? 'Home page' : path}</option>)}
            </select>
          </div>
          <label className="page-publish-toggle">
            <input type="checkbox" checked={draft.published} onChange={(event) => setDraft((current) => ({ ...current, published: event.target.checked }))} />
            Publish managed version
          </label>
        </div>
        <div className="page-builder-create">
          <label htmlFor="new-managed-page">Create a new page</label>
          <div>
            <input id="new-managed-page" value={newPageSlug} onChange={(event) => setNewPageSlug(event.target.value)} placeholder="for example, summer-workshop" disabled={busy} />
            <button type="button" onClick={createCustomPage} disabled={busy}>Create page</button>
          </div>
          <p>New pages use the address <code>/pages/your-page-name</code>.</p>
        </div>

        <div className="page-builder-field">
          <label htmlFor="managed-page-title">Page title (SEO)</label>
          <input id="managed-page-title" maxLength={160} value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} required />
        </div>
        <div className="page-builder-field">
          <label htmlFor="managed-page-description">Search description</label>
          <textarea id="managed-page-description" maxLength={320} rows={2} value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} />
        </div>

        <div className="page-builder-sections-heading">
          <div><h2>Page sections</h2><p>Add blocks, edit their content, and change their order.</p></div>
          <label className="page-builder-add">
            <Plus size={16} />
            Add section
            <select value="" onChange={(event) => {
              if (!event.target.value) return
              setDraft((current) => ({ ...current, sections: [...current.sections, createSection(event.target.value)] }))
              event.target.value = ''
            }}>
              <option value="">Choose a section</option>
              {sectionTypes.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select>
          </label>
        </div>

        {draft.sections.length === 0 && <p className="page-builder-empty">No sections yet. Add sections to build this page. Publishing an empty page will replace the original page with a blank one.</p>}

        <div className="page-builder-section-list">
          {draft.sections.map((section, index) => (
            <fieldset className="page-builder-section" key={section.id}>
              <legend>{sectionTypes.find(([value]) => value === section.type)?.[1] || section.type}</legend>
              <div className="page-builder-section-actions">
                <button type="button" className="page-builder-icon-button" aria-label="Move section up" onClick={() => moveSection(index, -1)} disabled={busy || index === 0}><ArrowUp size={16} /></button>
                <button type="button" className="page-builder-icon-button" aria-label="Move section down" onClick={() => moveSection(index, 1)} disabled={busy || index === draft.sections.length - 1}><ArrowDown size={16} /></button>
                <button type="button" className="page-builder-icon-button page-builder-delete-button" aria-label="Remove section" onClick={() => setDraft((current) => ({ ...current, sections: current.sections.filter((_, itemIndex) => itemIndex !== index) }))} disabled={busy}><Trash2 size={16} /></button>
              </div>
              {section.type !== 'courses' && <div className="page-builder-field"><label>Small heading</label><input maxLength={180} value={section.eyebrow || ''} onChange={(event) => updateSection(index, 'eyebrow', event.target.value)} /></div>}
              {section.type !== 'courses' && <div className="page-builder-field"><label>Heading</label><input maxLength={240} value={section.heading || ''} onChange={(event) => updateSection(index, 'heading', event.target.value)} /></div>}
              {section.type !== 'courses' && <div className="page-builder-field"><label>{section.type === 'faq' ? 'Questions and answers (one per line: Question | Answer)' : 'Text'}</label><textarea rows={section.type === 'faq' ? 6 : 4} maxLength={5000} value={section.body || ''} onChange={(event) => updateSection(index, 'body', event.target.value)} /></div>}
              {section.type === 'image' && <>
                <div className="page-builder-field"><label>Image URL</label><input type="text" maxLength={5000} value={section.imageUrl || ''} onChange={(event) => updateSection(index, 'imageUrl', event.target.value)} /></div>
                <div className="page-builder-field"><label>Image description</label><input maxLength={240} value={section.imageAlt || ''} onChange={(event) => updateSection(index, 'imageAlt', event.target.value)} /></div>
              </>}
              {['hero', 'text', 'image', 'cta'].includes(section.type) && <>
                <div className="page-builder-field"><label>Button label (optional)</label><input maxLength={120} value={section.buttonText || ''} onChange={(event) => updateSection(index, 'buttonText', event.target.value)} /></div>
                <div className="page-builder-field"><label>Button link (optional)</label><input maxLength={500} value={section.buttonUrl || ''} onChange={(event) => updateSection(index, 'buttonUrl', event.target.value)} placeholder="/contact" /></div>
              </>}
            </fieldset>
          ))}
        </div>

        <div className="page-builder-footer">
          <button type="submit" disabled={busy}>{busy ? 'Saving…' : <><Save size={16} /> Save page</>}</button>
          {selectedPage && <button type="button" className="page-builder-icon-button page-builder-delete-button" onClick={deletePage} disabled={busy}><Trash2 size={16} /> Delete managed version</button>}
        </div>
      </form>
    </div>
  )
}
