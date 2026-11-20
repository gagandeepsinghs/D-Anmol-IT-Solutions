import { useEffect, useState } from 'react'
import { RefreshCw, Trash2 } from 'lucide-react'
import './PageBuilder.css'

async function readJsonResponse(response) {
  const result = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(result.error || 'The request could not be completed.')
  return result
}

function formatDate(value) {
  if (!value) return 'Date unavailable'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString()
}

export default function AdminEnquiriesPanel() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState('')
  const [notice, setNotice] = useState(null)

  async function loadEnquiries() {
    setLoading(true)
    setNotice(null)
    try {
      const result = await readJsonResponse(await fetch('/api/admin/enquiries', { credentials: 'same-origin' }))
      setEnquiries(result.enquiries || [])
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEnquiries()
  }, [])

  async function updateStatus(enquiry, status) {
    setBusyId(enquiry._id)
    setNotice(null)
    try {
      await readJsonResponse(await fetch('/api/admin/enquiries', {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: enquiry._id, status }),
      }))
      setEnquiries((current) => current.map((item) => item._id === enquiry._id ? { ...item, status } : item))
      setNotice({ type: 'success', text: 'Enquiry status updated.' })
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setBusyId('')
    }
  }

  async function deleteEnquiry(enquiry) {
    if (!window.confirm(`Permanently delete the enquiry from ${enquiry.name}?`)) return
    setBusyId(enquiry._id)
    setNotice(null)
    try {
      await readJsonResponse(await fetch('/api/admin/enquiries', {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: enquiry._id }),
      }))
      setEnquiries((current) => current.filter((item) => item._id !== enquiry._id))
      setNotice({ type: 'success', text: 'Enquiry deleted from the website database.' })
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className="admin-enquiries-panel">
      {notice && <p className={`admin-notice ${notice.type === 'error' ? 'admin-notice-error' : 'admin-notice-success'}`} role="status">{notice.text}</p>}
      <div className="enquiries-toolbar">
        <p>Showing the latest {enquiries.length} website enquiries saved in this inbox.</p>
        <button type="button" className="page-builder-icon-button" onClick={loadEnquiries} disabled={loading}><RefreshCw size={16} /> Refresh</button>
      </div>
      {loading ? <p>Loading enquiries…</p> : enquiries.length === 0 ? <p className="page-builder-empty">No enquiries have been received yet.</p> : (
        <div className="enquiry-record-list">
          {enquiries.map((enquiry) => (
            <article className="enquiry-record" key={enquiry._id}>
              <div className="enquiry-record-heading">
                <div>
                  <span className="enquiry-record-type">{enquiry.formType}</span>
                  <h2>{enquiry.name}</h2>
                  <time>{formatDate(enquiry.receivedAt)}</time>
                </div>
                <span className="enquiry-inbox-status">Saved to inbox</span>
              </div>
              <div className="enquiry-record-contact">
                <a href={`tel:${String(enquiry.phone || '').replace(/[^\d+]/g, '')}`}>{enquiry.phone}</a>
                {enquiry.email && <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a>}
              </div>
              <dl className="enquiry-record-details">
                {enquiry.course && <><dt>Course</dt><dd>{enquiry.course}</dd></>}
                {enquiry.organization && <><dt>Organization</dt><dd>{enquiry.organization}</dd></>}
                {enquiry.preferredDemoMode && <><dt>Demo mode</dt><dd>{enquiry.preferredDemoMode}</dd></>}
                {enquiry.preferredContactMethod && <><dt>Contact preference</dt><dd>{enquiry.preferredContactMethod}</dd></>}
                {enquiry.preferredDate && <><dt>Preferred date</dt><dd>{enquiry.preferredDate}</dd></>}
                {enquiry.preferredTime && <><dt>Preferred time</dt><dd>{enquiry.preferredTime}</dd></>}
                {enquiry.referralSource && <><dt>Referral</dt><dd>{enquiry.referralSource}</dd></>}
                {enquiry.message && <><dt>Message</dt><dd>{enquiry.message}</dd></>}
              </dl>
              <div className="enquiry-record-actions">
                <label>
                  Status
                  <select value={enquiry.status || 'new'} onChange={(event) => updateStatus(enquiry, event.target.value)} disabled={busyId === enquiry._id}>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </label>
                <button type="button" className="page-builder-icon-button page-builder-delete-button" onClick={() => deleteEnquiry(enquiry)} disabled={busyId === enquiry._id}><Trash2 size={16} /> Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
