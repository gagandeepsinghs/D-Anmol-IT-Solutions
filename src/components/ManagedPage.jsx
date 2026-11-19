import { Link } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'
import CourseCard from './CourseCard'

export default function ManagedPage({ page }) {
  const { courses } = useAppData()

  return (
    <div className="managed-page">
      {page.sections.map((section) => {
        if (section.type === 'hero') {
          return (
            <section className="hero section" key={section.id}>
              <div className="page-wrap">
                {section.eyebrow && <span className="eyebrow">{section.eyebrow}</span>}
                <h1>{section.heading}</h1>
                {section.body && <p>{section.body}</p>}
                {section.buttonText && section.buttonUrl && (
                  <Link className="button button-primary" to={section.buttonUrl}>{section.buttonText}</Link>
                )}
              </div>
            </section>
          )
        }

        if (section.type === 'text' || section.type === 'cta') {
          return (
            <section className={`section ${section.type === 'cta' ? 'contact-cta-section' : ''}`} key={section.id}>
              <div className="page-wrap">
                {section.eyebrow && <span className="eyebrow">{section.eyebrow}</span>}
                {section.heading && <h2>{section.heading}</h2>}
                {section.body && <p>{section.body}</p>}
                {section.buttonText && section.buttonUrl && (
                  <Link className="button button-outline" to={section.buttonUrl}>{section.buttonText}</Link>
                )}
              </div>
            </section>
          )
        }

        if (section.type === 'image') {
          return (
            <section className="section" key={section.id}>
              <div className="page-wrap managed-image-section">
                {section.imageUrl && <img src={section.imageUrl} alt={section.imageAlt || ''} loading="lazy" />}
                <div>
                  {section.eyebrow && <span className="eyebrow">{section.eyebrow}</span>}
                  {section.heading && <h2>{section.heading}</h2>}
                  {section.body && <p>{section.body}</p>}
                </div>
              </div>
            </section>
          )
        }

        if (section.type === 'courses') {
          const visibleCourses = courses.filter((course) => course.published !== false)
          return (
            <section className="section" key={section.id}>
              <div className="page-wrap">
                {section.heading && <h2>{section.heading}</h2>}
                {section.body && <p>{section.body}</p>}
                <div className="course-grid">{visibleCourses.map((course) => <CourseCard key={course.id} course={course} />)}</div>
              </div>
            </section>
          )
        }

        if (section.type === 'faq') {
          return (
            <section className="section" key={section.id}>
              <div className="page-wrap">
                {section.heading && <h2>{section.heading}</h2>}
                {section.body && <p>{section.body}</p>}
                <div className="managed-faq-list">
                  {(section.body || '').split('\n').filter(Boolean).map((line, index) => {
                    const [question, ...answer] = line.split('|')
                    return <details key={`${index}-${question}`}><summary>{question}</summary><p>{answer.join('|').trim()}</p></details>
                  })}
                </div>
              </div>
            </section>
          )
        }

        return null
      })}
    </div>
  )
}
