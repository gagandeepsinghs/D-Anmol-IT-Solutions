import { Link } from 'react-router-dom'

const policies = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'This page explains how information submitted through D-Anmol Academy’s website enquiries is used.',
    sections: [
      {
        heading: 'Information you provide',
        paragraphs: [
          'When you submit a course enquiry or demo request, the form may ask for your name, phone number, optional email address, course interest, preferred demo mode, preferred contact method, and an optional message.',
          'Enquiry submissions are forwarded to the academy’s Google Sheet and a copy is stored in the website database so authorized administrators can review and manage requests. The website copy remains until an administrator deletes it; retention in the Google Sheet is managed separately by the academy.',
          'If you contact the academy directly by phone, email, or WhatsApp, you choose what information to include in that communication.',
        ],
      },
      {
        heading: 'How enquiry information is used',
        paragraphs: [
          'The information you provide is used to respond to your enquiry, discuss course information, and follow up about a demo request. The academy may contact you using the contact method you select or provide.',
        ],
      },
      {
        heading: 'Questions',
        paragraphs: [
          'For questions about this policy or an enquiry you submitted, contact the academy using the details on the Contact page.',
        ],
      },
    ],
  },
}

export default function LegalPage({ kind = 'privacy' }) {
  const policy = policies[kind] || policies.privacy

  return (
    <>
      <section className="page-hero policy-hero">
        <div className="page-wrap page-hero-inner">
          <span className="eyebrow eyebrow-light">D-Anmol Academy</span>
          <h1>{policy.title}</h1>
          <p>{policy.intro}</p>
        </div>
      </section>
      <section className="section policy-section">
        <div className="page-wrap policy-content">
          {policy.sections.map(({ heading, paragraphs }) => (
            <section className="policy-block" key={heading}>
              <h2>{heading}</h2>
              {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
          <Link className="text-link policy-back-link" to="/contact">Contact Academy</Link>
        </div>
      </section>
    </>
  )
}
