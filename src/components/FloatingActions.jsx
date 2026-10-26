import { useEffect, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../config/siteConfig'

export default function FloatingActions() {
  const [chatOpen, setChatOpen] = useState(false)
  const phone = siteConfig.whatsappNumber.replace(/\D/g, '')
  const whatsappUrl = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent('Hello, I would like to know more about your courses.')}`
    : null

  return (
    <div className="floating-actions">
      {!whatsappUrl && chatOpen && (
        <section className="whatsapp-panel" aria-label="Course enquiry contact options">
          <div className="whatsapp-panel-heading">
            <span className="whatsapp-panel-icon"><MessageCircle size={18} aria-hidden="true" /></span>
            <div><strong>Course questions?</strong><small>Choose how to get in touch</small></div>
            <button className="whatsapp-panel-close" type="button" aria-label="Close WhatsApp panel" onClick={() => setChatOpen(false)}><X size={17} /></button>
          </div>
          <p>WhatsApp contact is not configured yet. Send us a course question through the contact page.</p>
          <Link className="whatsapp-panel-link" to="/contact" onClick={() => setChatOpen(false)}>Go to contact page <MessageCircle size={16} aria-hidden="true" /></Link>
        </section>
      )}
      {whatsappUrl ? (
        <a className="whatsapp-fab" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Open WhatsApp course enquiry">
          <MessageCircle size={24} aria-hidden="true" />
        </a>
      ) : (
        <button
          className="whatsapp-fab"
          type="button"
          aria-label={chatOpen ? 'Close course enquiry contact options' : 'Open course enquiry contact options'}
          aria-expanded={chatOpen}
          onClick={() => setChatOpen((isOpen) => !isOpen)}
        >
          {chatOpen ? <X size={23} aria-hidden="true" /> : <MessageCircle size={24} aria-hidden="true" />}
        </button>
      )}
    </div>
  )
}
