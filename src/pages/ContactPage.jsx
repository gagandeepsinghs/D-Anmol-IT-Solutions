import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { siteConfig } from '../config/siteConfig'
import EnquiryForm from '../components/EnquiryForm'

export default function ContactPage() {
  const whatsappNumber = siteConfig.whatsappNumber.replace(/\D/g, '')
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello, I would like to learn more about D-Anmol Enterprises training.')}`
    : null
  return <>
    <section className="page-hero contact-hero"><div className="page-wrap contact-hero-inner"><span className="eyebrow eyebrow-light">We’re here to help</span><h1>Let’s talk about<br />what’s next.</h1><p>Ask about a course, share a training goal or tell us what you’re hoping to learn.</p></div></section>
    <section className="section contact-main-section"><div className="page-wrap contact-main-layout"><div className="contact-details"><span className="eyebrow">Get in touch</span><h2>Start a conversation.</h2><p>These contact details are placeholders in this demo. Update them in the site configuration before publishing.</p><div className="contact-info-list"><a href={`mailto:${siteConfig.email}`}><span><Mail size={20} /></span><div><small>Email</small><strong>{siteConfig.email}</strong></div><ArrowUpRight size={17} /></a><a href={`tel:${siteConfig.phone.replace(/[^\d+]/g, '')}`}><span><Phone size={20} /></span><div><small>Phone</small><strong>{siteConfig.phone}</strong></div><ArrowUpRight size={17} /></a><div className="contact-address"><span><MapPin size={20} /></span><div><small>Address</small><strong>{siteConfig.address}</strong></div></div></div>{whatsappUrl ? <a className="whatsapp-button" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Chat on WhatsApp <ArrowUpRight size={16} /></a> : <p className="placeholder-note">WhatsApp contact is not configured yet. Add the business number in <code>src/config/siteConfig.js</code> before publishing.</p>}<div className="business-enquiry"><span className="business-enquiry-icon">01</span><div><strong>Business enquiry?</strong><p>Tell us about your team’s learning goals on our corporate training page.</p><a href="/corporate-training">Corporate training <ArrowUpRight size={14} /></a></div></div></div><EnquiryForm title="Send us a message" description="Fill in the form and we’ll confirm your demo request on screen." /></div></section>
  </>
}
