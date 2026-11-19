export function validateEnquiryFields({ name, phone, email = '' }) {
  const errors = {}
  const trimmedName = name.trim()
  const trimmedPhone = phone.trim()
  const phoneDigits = trimmedPhone.replace(/\D/g, '')

  if (!trimmedName) errors.name = 'Please enter your name.'
  if (!trimmedPhone) {
    errors.phone = 'Please enter your phone number.'
  } else if (!/^\+?[\d -]+$/.test(trimmedPhone) || phoneDigits.length < 8 || phoneDigits.length > 15) {
    errors.phone = 'Enter 8–15 digits; spaces, + and hyphens are allowed.'
  }
  if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  return errors
}
