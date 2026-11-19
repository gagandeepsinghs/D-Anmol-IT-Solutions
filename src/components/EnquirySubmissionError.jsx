import { useSiteSettings } from '../context/AppDataContext'

export default function EnquirySubmissionError({ message = 'Something went wrong.' }) {
  const siteSettings = useSiteSettings()
  const phoneLink = siteSettings.phone.replace(/[^\d+]/g, '')
  const whatsappNumber = siteSettings.whatsappNumber.replace(/\D/g, '')
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello, I need help with an enquiry.')}`

  return (
    <p className="form-error form-submission-error" role="alert">
      {message} Please call or WhatsApp us instead.{' '}
      <a href={`tel:${phoneLink}`}>Call {siteSettings.phone}</a>
      {' · '}
      <a href={whatsappLink} target="_blank" rel="noreferrer">WhatsApp us</a>
    </p>
  )
}
