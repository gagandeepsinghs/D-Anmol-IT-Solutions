import { Link } from 'react-router-dom'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { siteConfig } from '../config/siteConfig'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main page-wrap">
        <div className="footer-brand">
          <img src={siteConfig.logo} alt="D-Anmol Enterprises" />
          <p>Practical technology learning for people and teams ready to move forward.</p>
        </div>
        <div className="footer-column">
          <h3>Explore</h3>
          <Link to="/courses">All courses</Link>
          <Link to="/ai-python">AI &amp; Python training</Link>
          <Link to="/corporate-training">Corporate training</Link>
          <Link to="/about">About us</Link>
        </div>
        <div className="footer-column">
          <h3>Get in touch</h3>
          <a href={`mailto:${siteConfig.email}`}><Mail size={16} />{siteConfig.email}</a>
          <a href={`tel:${siteConfig.phone.replace(/[^\d+]/g, '')}`}><Phone size={16} />{siteConfig.phone}</a>
          <span><MapPin size={16} />{siteConfig.address}</span>
        </div>
        <div className="footer-invite">
          <span className="eyebrow eyebrow-light">Your next step</span>
          <h3>Make learning practical.</h3>
          <Link className="footer-link" to="/contact">Talk with our team <ArrowUpRight size={17} /></Link>
        </div>
      </div>
      <div className="footer-bottom page-wrap">
        <span>© {new Date().getFullYear()} D-Anmol Enterprises</span>
        <span>Built around practical learning.</span>
        <Link to="/admin">Demo admin</Link>
      </div>
    </footer>
  )
}
