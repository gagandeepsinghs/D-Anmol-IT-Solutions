import { ArrowLeft, ArrowRight, BookOpenCheck, Check, Clock3, GraduationCap, Lightbulb, MonitorPlay, NotebookTabs } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import CourseCard from '../components/CourseCard'
import EnquiryForm from '../components/EnquiryForm'
import TechBadge from '../components/TechBadge'
import { useAppData } from '../context/AppDataContext'
import { courses as defaultCourses } from '../data/courses'
import { getModuleTechnologies } from '../data/moduleTechnologies'

export default function CourseDetailPage() {
  const { slug } = useParams()
  const { courses } = useAppData()
  const course = courses.find((item) => item.slug === slug && item.published !== false)
  if (!course) return <Navigate to="/courses" replace />
  const defaultCourse = defaultCourses.find((item) => item.id === course.id)
  const modules = (course.modules || defaultCourse?.modules || []).map((module, index) => {
    if (typeof module !== 'string') return module
    const defaultModule = defaultCourse?.modules?.[index]
    return typeof defaultModule === 'object' && defaultModule.title === module
      ? defaultModule
      : { title: module, description: 'Work through this topic with guided examples and practical exercises connected to the course.' }
  })
  const otherCourses = courses.filter((item) => item.id !== course.id && item.published !== false)
  const sameCategory = otherCourses.filter((item) => item.category === course.category)
  const related = (sameCategory.length ? sameCategory : otherCourses).slice(0, 3)
  const outcomes = course.outcomes || course.skills || []
  const moduleStages = ['Foundations', 'Core concepts', 'Guided practice', 'Applied skills', 'Project work', 'Review & next steps']
  const firstModule = modules[0]?.title
  const lastModule = modules[modules.length - 1]?.title

  return <>
    <section className="detail-hero"><div className="page-wrap detail-hero-grid"><div className="detail-hero-copy"><Link to="/courses" className="back-link"><ArrowLeft size={15} /> All courses</Link><span className="detail-category">{course.category}</span><h1>{course.title}</h1><p>{course.description}</p><div className="detail-facts"><span><Clock3 size={17} />{course.duration || 'Contact us for details'}</span><span><MonitorPlay size={17} />{course.mode || 'Contact us for details'}</span><span><GraduationCap size={17} />{course.level || 'Learner level discussed'}</span></div><Button to={`/contact?course=${encodeURIComponent(course.title)}`} icon>Request course information</Button></div><div className="detail-hero-image"><img src={course.image} alt="" /></div></div></section>
    <section className="section section-white"><div className="page-wrap detail-layout"><main className="detail-content">
      <section className="detail-block detail-block-overview"><span className="eyebrow">Course overview</span><h2>Inside {course.title}</h2><p>{course.overview || course.description}</p>{course.technologies?.length > 0 && <div className="course-tech-detail"><strong>Tools and topics you’ll explore</strong><div className="technology-list">{course.technologies.map((technology, index) => <TechBadge key={technology} name={technology} index={index} />)}</div></div>}</section>
      <section className="detail-block detail-block-audience"><div className="detail-block-title"><span className="detail-section-icon"><GraduationCap size={19} /></span><div><span className="eyebrow">Who it’s for</span><h2>Who is this course designed for?</h2></div></div><p>{course.suitableFor || 'Contact us to discuss your learning goals and whether this course is a suitable starting point.'}</p><div className="learner-prerequisite"><strong>Before you start</strong><p>{course.prerequisites || 'Contact us to discuss any recommended background or preparation.'}</p></div></section>
      <section className="detail-block detail-block-curriculum"><div className="detail-block-title"><span className="detail-section-icon"><NotebookTabs size={19} /></span><div><span className="eyebrow">Course curriculum</span><h2>A step-by-step learning roadmap</h2></div></div>{modules.length > 0 && <p className="course-curriculum-intro">Follow {modules.length} modules, starting with {firstModule} and building toward {lastModule}.</p>}<ol className="module-list ai-python-module-list course-module-list">{modules.map((module, index) => {
        const technologies = getModuleTechnologies(course.id, index, course.technologies || [], module.title)
        return <li key={`${module.title}-${index}`} aria-label={`Module ${index + 1}: ${module.title}`}><span className="module-index">{String(index + 1).padStart(2, '0')}</span><span className="ai-python-module-copy"><span className="course-module-stage">Module {String(index + 1).padStart(2, '0')} · {moduleStages[Math.min(index, moduleStages.length - 1)]}</span><strong>{module.title}</strong><small>{module.description}</small><span className="module-tech-heading">Tools &amp; technologies for this module</span><span className="module-tech-grid">{technologies.map((technology, technologyIndex) => <span className="module-tech-card" key={technology}><TechBadge name={technology} index={technologyIndex} /></span>)}</span></span><Check size={16} aria-hidden="true" /></li>
      })}</ol></section>
      <section className="detail-block detail-block-outcomes"><div className="detail-block-title"><span className="detail-section-icon"><BookOpenCheck size={19} /></span><div><span className="eyebrow">Learning outcomes</span><h2>What you’ll learn to do</h2></div></div><ul className="course-outcome-list">{outcomes.map((outcome) => <li key={outcome}><Check size={17} />{outcome}</li>)}</ul></section>
      <section className="detail-block detail-block-projects"><div className="detail-block-title"><span className="detail-section-icon"><Lightbulb size={19} /></span><div><span className="eyebrow">Practical project ideas</span><h2>Put your new skills into practice</h2></div></div><div className="course-project-grid">{(course.projects || []).map((project, index) => <article key={project}><span>Project {String(index + 1).padStart(2, '0')}</span><p>{project}</p></article>)}</div><p className="course-project-note">These are sample learning activities. Final exercises may vary based on the confirmed course plan.</p></section>
    </main><aside className="detail-sidebar"><div className="course-summary"><span className="eyebrow">Course at a glance</span><h3>{course.title}</h3><div><Clock3 size={16} /><span>Duration<strong>{course.duration || 'Contact us for details'}</strong></span></div><div><MonitorPlay size={16} /><span>Learning mode<strong>{course.mode || 'Contact us for details'}</strong></span></div><div><GraduationCap size={17} /><span>Suggested level<strong>{course.level || 'Discuss with us'}</strong></span></div><Button to={`/contact?course=${encodeURIComponent(course.title)}`} className="summary-button" icon>Request course information</Button><p>Fees and schedule: contact us for details.</p></div><EnquiryForm compact kind="course" title="Have a question?" description="Send a demo enquiry about this course." /></aside></div></section>
    {related.length > 0 && <section className="section related-section"><div className="page-wrap"><div className="section-heading"><div><span className="eyebrow">Keep exploring</span><h2>Related courses</h2></div><Link className="text-link" to="/courses">See all courses <ArrowRight size={16} /></Link></div><div className="course-grid">{related.map((item) => <CourseCard key={item.id} course={item} />)}</div></div></section>}
  </>
}
