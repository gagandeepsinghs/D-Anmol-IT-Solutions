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
          'Enquiry submissions are stored in the website database so authorized administrators can review and manage requests. The website copy remains until an administrator deletes it.',
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
  terms: {
    title: 'Terms and Conditions',
    intro: 'These terms describe the use of the D-Anmol Academy website and its course enquiry services.',
    sections: [
      {
        heading: 'Course information and admissions',
        paragraphs: [
          'Course descriptions on this website are general information. Course availability, format, duration, schedule, fees, and any prerequisites should be confirmed directly with the academy before enrolment.',
          'Submitting an enquiry or requesting a demo is not an admission, enrolment, or guarantee that a particular course or schedule is available.',
        ],
      },
      {
        heading: 'Website use',
        paragraphs: [
          'Please provide accurate information when using an enquiry form and do not use the website to submit unlawful, misleading, or harmful content.',
          'Website content may be updated to correct or clarify information. Contact the academy to confirm current course and service details.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          'For questions about these terms or course information, contact the academy using the details on the Contact page.',
        ],
      },
    ],
  },
  refund: {
    title: 'Refund and Cancellation Policy',
    intro: 'Contact D-Anmol Academy directly to confirm the terms that apply to a course before enrolment or payment.',
    sections: [
      {
        heading: 'Before enrolment',
        paragraphs: [
          'Course availability, fees, schedules, cancellations, and any applicable refund terms are confirmed by the academy as part of the enrolment process. Please request and review the terms that apply to your course before making a payment.',
        ],
      },
      {
        heading: 'Requesting a cancellation or refund',
        paragraphs: [
          'To discuss a cancellation or refund, contact the academy using the details on the Contact page and include your name, course, and enrolment details. The academy will review the request under the terms confirmed for that enrolment.',
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
