import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="not-found page-wrap">
      <span className="eyebrow">404 · Page not found</span>
      <h1>This page went off the learning path.</h1>
      <p>Let’s get you back to somewhere useful.</p>
      <Link className="button button-primary" to="/">Back to home</Link>
    </section>
  )
}
