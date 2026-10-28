import { ArrowUpRight, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CourseCard({ course, showTopics = false }) {
  const topics = (course.modules || []).slice(0, 3).map((module) => typeof module === 'string' ? module : module.title)
  return (
    <article className="course-card">
      <Link to={`/courses/${course.slug}`} className="course-image-link" aria-label={`View ${course.title}`}>
        <img className="course-image" src={course.image} alt="" loading="lazy" />
        <span className="course-category">{course.category}</span>
      </Link>
      <div className="course-card-content">
        <div className="course-card-meta">
          {course.duration && <span><Clock3 size={14} />{course.duration}</span>}
          <span className="meta-dot" aria-hidden="true">•</span>
          <span>{course.mode || 'Flexible learning'}</span>
        </div>
        <h3><Link to={`/courses/${course.slug}`}>{course.title}</Link></h3>
        <p>{course.description}</p>
        {showTopics && topics.length > 0 && <div className="course-topic-preview"><strong>Key modules</strong><span>{topics.join(' · ')}</span></div>}
        <div className="course-card-actions">
          <Link to={`/contact?course=${encodeURIComponent(course.title)}`} className="text-link course-enquire-link">Enquire <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </article>
  )
}
