import { Link } from 'react-router-dom'
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useSiteSettings } from '../context/AppDataContext'

export default function Footer() {
  const siteSettings = useSiteSettings()
  const whatsappNumber = siteSettings.whatsappNumber.replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello, I would like to learn more about D Anmol Enterprises training.')}`

  return (
    <footer className="site-footer">
      <div className="footer-main page-wrap">
        <div className="footer-brand">
          <img src={siteSettings.logo} alt={siteSettings.name} />
          <p>Practical technology learning for people and teams ready to move forward.</p>
        </div>
        <div className="footer-column">
          <h3>Explore</h3>
          <Link to="/courses">All courses</Link>
          <Link to="/ai-python">AI, data &amp; automation training</Link>
          <Link to="/corporate-training">Corporate training</Link>
          <Link to="/about">About us</Link>
          <Link to="/faq">FAQs</Link>
        </div>
        <div className="footer-column">
          <h3>Get in touch</h3>
          <a href={`mailto:${siteSettings.email}`}><Mail size={16} />{siteSettings.email}</a>
          <a href={`tel:${siteSettings.phone.replace(/[^\d+]/g, '')}`}><Phone size={16} />{siteSettings.phone}</a>
          <a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={16} />WhatsApp us</a>
          <span><MapPin size={16} />{siteSettings.trainingAreas}</span>
        </div>
        <div className="footer-invite">
          <span className="eyebrow eyebrow-light">Your next step</span>
          <h3>Make learning practical.</h3>
          <Link className="footer-link" to="/contact?request=demo#enquiry-form">Book a Free Demo <ArrowUpRight size={17} /></Link>
          <Link className="footer-link" to="/contact">Contact Academy <ArrowUpRight size={17} /></Link>
        </div>
      </div>
      <div className="footer-bottom page-wrap">
        <span>© 2025 D Anmol Enterprises</span>
        <span>Built around practical learning.</span>
      </div>
    </footer>
  )
}
