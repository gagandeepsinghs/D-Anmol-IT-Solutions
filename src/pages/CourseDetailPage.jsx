import { ArrowLeft, ArrowRight, BookOpenCheck, Check, Clock3, GraduationCap, Lightbulb, MonitorPlay } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import NotFoundPage from './NotFoundPage'
import { Button } from '../components/Button'
import CourseCard from '../components/CourseCard'
import EnquiryForm from '../components/EnquiryForm'
import CourseSyllabus from '../components/CourseSyllabus'
import TechBadge from '../components/TechBadge'
import { useAppData } from '../context/AppDataContext'
import { courseSyllabusFolders } from '../data/courseSyllabi'
import courseImageFallback from '../assets/images/courses/covers/optimized/course-image-fallback.webp'
import CoursePdfBanner from '../components/CoursePdfBanner'

export default function CourseDetailPage() {
  const { slug } = useParams()
  const { courses, courseSyllabi, siteSettings } = useAppData()
  const course = courses.find((item) => item.slug === slug && item.published !== false)
  if (!course) return <NotFoundPage />
  const syllabusFolder = courseSyllabusFolders[course.id] || (courseSyllabi[course.id] ? course.id : null)
  const syllabusOverride = courseSyllabi[course.id] || (course.id === 'data-science'
    ? {
        modules: course.modules.map((module, index) => ({
          number: index + 1,
          title: module.title,
          topics: [],
          activity: module.description,
        })),
        buildItems: (course.projects || []).map((project) => project.title),
        workflow: ['Learn concepts', 'Practise skills', 'Build projects', 'Show portfolio'],
      }
    : undefined)
  const otherCourses = courses.filter((item) => item.id !== course.id && item.published !== false)
  const sameCategory = otherCourses.filter((item) => item.category === course.category)
  const related = (sameCategory.length ? sameCategory : otherCourses).slice(0, 3)
  const outcomes = course.outcomes || course.skills || []
  const durationSummary = course.duration === '6 Months'
    ? '6 months'
    : 'Standard: 3–6 months; 45-day options for selected courses. Confirm availability.'
  const trainingModeSummary = 'Online training is available across India. Offline training targets Mohali, Chandigarh, and Panchkula; contact us to confirm this course’s availability.'
  const startingLevelSummary = 'Contact us to confirm any recommended background or preparation for this course.'

  return <>
    <section className="detail-hero"><div className="page-wrap detail-hero-grid"><div className="detail-hero-copy"><Link to="/courses" className="back-link"><ArrowLeft size={15} /> All courses</Link><span className="detail-category">{course.category}</span><h1>{course.title}</h1><p>{course.description}</p><div className="detail-facts"><span><Clock3 size={17} />{durationSummary}</span><span><MonitorPlay size={17} />{trainingModeSummary}</span><span><GraduationCap size={17} />Starting level confirmed on enquiry</span></div><Button to={`/contact?course=${encodeURIComponent(course.title)}`} icon>Request course information</Button> <Button to={`/contact?request=demo&course=${encodeURIComponent(course.title)}#enquiry-form`} variant="quiet">Book a Free Demo</Button></div><div className="detail-hero-image"><img src={course.image} alt={`${course.title} course cover illustration`} fetchpriority="high" onError={(event) => { if (!event.currentTarget.dataset.fallbackApplied) { event.currentTarget.dataset.fallbackApplied = 'true'; event.currentTarget.src = courseImageFallback } }} /></div></div></section>
    <section className="section section-white">
      <div className="page-wrap detail-layout">
          <div className="detail-content">
            <section className="detail-block detail-block-overview"><span className="eyebrow">Course overview</span><h2>Inside {course.title}</h2><p>{course.overview || course.description}</p>{course.technologies?.length > 0 && <div className="course-tech-detail"><strong>Tools and topics you’ll explore</strong><div className="technology-list">{course.technologies.map((technology, index) => <TechBadge key={technology} name={technology} index={index} />)}</div></div>}</section>
            <section className="detail-block detail-block-audience"><div className="detail-block-title"><span className="detail-section-icon"><GraduationCap size={19} /></span><div><span className="eyebrow">Who it’s for</span><h2>Who is this course designed for?</h2></div></div><p>{course.suitableFor || 'Contact us to discuss your learning goals and whether this course is a suitable starting point.'}</p><div className="learner-prerequisite"><strong>Before you start</strong><p>{startingLevelSummary}</p></div></section>
            <section className="detail-block detail-block-outcomes"><div className="detail-block-title"><span className="detail-section-icon"><BookOpenCheck size={19} /></span><div><span className="eyebrow">Learning outcomes</span><h2>What you’ll learn to do</h2></div></div><ul className="course-outcome-list">{outcomes.map((outcome) => <li key={outcome}><Check size={17} />{outcome}</li>)}</ul></section>
            <section className="detail-block detail-block-projects"><div className="detail-block-title"><span className="detail-section-icon"><Lightbulb size={19} /></span><div><span className="eyebrow">Practical project ideas</span><h2>Put your new skills into practice</h2></div></div><div className="course-project-grid">{(course.projects || []).map((project, index) => <article key={project}><span>Project {String(index + 1).padStart(2, '0')}</span><p>{project}</p></article>)}</div><p className="course-project-note">These are sample learning activities. Final exercises may vary based on the confirmed course plan.</p></section>
            {syllabusFolder && <CourseSyllabus
              folder={syllabusFolder}
              courseTitle={course.title}
              image={course.image}
              enquiryHref={`/contact?course=${encodeURIComponent(course.title)}`}
              syllabusOverride={syllabusOverride}
              embedded
            />}
          </div>
          <aside className="detail-sidebar">
            <div className="course-summary"><span className="eyebrow">Course at a glance</span><h3>{course.title}</h3><div><Clock3 size={16} /><span>Duration<strong>{durationSummary}</strong></span></div><div><GraduationCap size={17} /><span>Suggested level<strong>Confirm with the academy</strong></span></div><Button to={`/contact?course=${encodeURIComponent(course.title)}`} className="summary-button" icon>Request course information</Button><p>Contact us for current fee and schedule details.</p></div>
            <EnquiryForm compact kind="course" initialCourse={course.title} title="Have a question?" description="Send us your question about this course." />
          </aside>
      </div>
      <div className="page-wrap detail-pdf-wrap">
        <CoursePdfBanner
          courseTitle={course.title}
          courseImage={course.image}
          email={siteSettings.email}
        />
      </div>
    </section>
    {related.length > 0 && <section className="section related-section"><div className="page-wrap"><div className="section-heading"><div><span className="eyebrow">Keep exploring</span><h2>Related courses</h2></div><Link className="text-link" to="/courses">See all courses <ArrowRight size={16} /></Link></div><div className="course-grid">{related.map((item) => <CourseCard key={item.id} course={item} />)}</div></div></section>}
  </>
}
