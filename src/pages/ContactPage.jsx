import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import EnquiryForm from '../components/EnquiryForm'
import { useSiteSettings } from '../context/AppDataContext'

export default function ContactPage() {
  const { search } = useLocation()
  const siteSettings = useSiteSettings()
  const isDemoRequest = new URLSearchParams(search).get('request') === 'demo'
  const whatsappNumber = siteSettings.whatsappNumber.replace(/\D/g, '')
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello, I would like to learn more about D-Anmol Academy training.')}`
    : null
  return <>
    <section className="page-hero contact-hero"><div className="page-wrap contact-hero-inner"><span className="eyebrow eyebrow-light">We’re here to help</span><h1>Let’s talk about<br />what’s next.</h1><p>Ask about our courses and available schedules. Online training is available across India; offline training targets Mohali, Chandigarh, and Panchkula.</p></div></section>
    <section className="section contact-main-section"><div className="page-wrap contact-main-layout"><div className="contact-details"><span className="eyebrow">Get in touch</span><h2>Start a conversation.</h2><p>Call, email or message us on WhatsApp and we’ll be happy to discuss your learning goals.</p><div className="contact-info-list"><a href={`mailto:${siteSettings.email}`}><span><Mail size={20} /></span><div><small>Email</small><strong>{siteSettings.email}</strong></div><ArrowUpRight size={17} /></a><a href={`tel:${siteSettings.phone.replace(/[^\d+]/g, '')}`}><span><Phone size={20} /></span><div><small>Phone</small><strong>{siteSettings.phone}</strong></div><ArrowUpRight size={17} /></a><div className="contact-address"><span><MapPin size={20} /></span><div><small>Training areas</small><strong>{siteSettings.trainingAreas}</strong></div></div></div>
      <div className="contact-action-buttons">
        <Link className="button button-primary" to="/contact?request=demo#enquiry-form">Book a Free Demo</Link>
        {whatsappUrl && <a className="button button-outline" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp Us</a>}
        <a className="button button-outline" href={`tel:${siteSettings.phone.replace(/[^\d+]/g, '')}`}><Phone size={17} /> Call Now</a>
        <a className="button button-outline" href={`mailto:${siteSettings.email}`}><Mail size={17} /> Email Us</a>
      </div>
      <div className="business-enquiry"><span className="business-enquiry-icon">01</span><div><strong>Business enquiry?</strong><p>Tell us about your team’s learning goals on our corporate training page.</p><Link to="/corporate-training">Corporate training <ArrowUpRight size={14} /></Link></div></div></div>
      <EnquiryForm id="enquiry-form" kind={isDemoRequest ? 'demo' : 'contact'} title={isDemoRequest ? 'Request a free demo' : 'Send a course enquiry'} description={isDemoRequest ? 'Share your details and preferred demo mode. The academy will contact you to confirm.' : 'Share your details and course interest, and our team will be in touch.'} /></div></section>
  </>
}
