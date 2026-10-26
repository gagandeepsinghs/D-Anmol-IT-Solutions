import { ArrowLeft, ArrowRight, BookOpenCheck, Check, Clock3, GraduationCap, Layers3, Lightbulb } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import AiPythonEnquiryForm from '../components/AiPythonEnquiryForm'
import TechBadge from '../components/TechBadge'
import { aiPythonCourses } from '../data/aiPythonCourses'
import { getModuleTechnologies } from '../data/moduleTechnologies'

const moduleStages = ['Foundations', 'Core concepts', 'Guided practice', 'Applied skills', 'Project work', 'Review & next steps']

export default function AiPythonCoursePage() {
  const { slug } = useParams()
  const course = aiPythonCourses.find((item) => item.slug === slug)
  if (!course) return <Navigate to="/ai-python" replace />

  return <>
    <section className="ai-python-detail-hero">
      <div className="page-wrap ai-python-detail-grid">
        <div>
          <Link to="/ai-python" className="back-link"><ArrowLeft size={15} /> AI &amp; Python programmes</Link>
          <span className="detail-category">{course.category} training</span>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <div className="ai-python-detail-facts"><span><Clock3 size={16} />{course.duration}</span><span><GraduationCap size={17} />{course.level}</span></div>
          <a className="button button-light" href="#course-information">Request course information <ArrowRight size={16} /></a>
        </div>
        <div className="ai-python-detail-image"><img src={course.image} alt="" /></div>
      </div>
    </section>

    <section className="section section-white">
      <div className="page-wrap ai-python-detail-layout">
        <main className="ai-python-detail-content">
          <section className="detail-block">
            <span className="eyebrow">Course overview</span>
            <h2>What is this course?</h2>
            <p>{course.overview}</p>
            <div className="ai-python-tech-detail"><strong>Tools and technologies you’ll explore</strong><div className="technology-list">{course.technologies.map((technology, index) => <TechBadge key={technology} name={technology} index={index} />)}</div></div>
          </section>
          <section className="detail-block">
            <div className="detail-block-title"><span className="detail-section-icon"><GraduationCap size={19} /></span><div><span className="eyebrow">Who it’s for</span><h2>Is this a good fit for you?</h2></div></div>
            <p>{course.suitableFor}</p>
            <div className="learner-prerequisite"><strong>Before you start</strong><p>{course.prerequisites}</p></div>
          </section>
          <section className="detail-block">
            <div className="detail-block-title"><span className="detail-section-icon"><Layers3 size={19} /></span><div><span className="eyebrow">Curriculum outline</span><h2>Topics you’ll explore</h2></div></div>
            <ol className="module-list ai-python-module-list course-module-list">{course.curriculum.map((module, index) => {
              const technologies = getModuleTechnologies(course.id, index, course.technologies, module.title)
              return <li key={module.title}><span className="module-index">{String(index + 1).padStart(2, '0')}</span><span className="ai-python-module-copy"><span className="course-module-stage">Module {String(index + 1).padStart(2, '0')} · {moduleStages[Math.min(index, moduleStages.length - 1)]}</span><strong>{module.title}</strong><small>{module.description}</small><span className="module-tech-heading">Tools &amp; technologies for this module</span><span className="module-tech-grid">{technologies.map((technology, technologyIndex) => <span className="module-tech-card" key={technology}><TechBadge name={technology} index={technologyIndex} /></span>)}</span></span><Check size={16} /></li>
            })}</ol>
          </section>
          <section className="detail-block">
            <div className="detail-block-title"><span className="detail-section-icon"><BookOpenCheck size={19} /></span><div><span className="eyebrow">Learning outcomes</span><h2>What you can practice</h2></div></div>
            <p className="detail-supporting-copy">By the end, you’ll have practiced how to:</p>
            <ul className="ai-python-outcome-list">{course.outcomes.map((outcome) => <li key={outcome}><Check size={16} />{outcome}</li>)}</ul>
          </section>
          <section className="detail-block">
            <div className="detail-block-title"><span className="detail-section-icon"><Lightbulb size={19} /></span><div><span className="eyebrow">Project ideas</span><h2>Put learning into practice</h2></div></div>
            <div className="ai-python-project-grid">{course.projects.map((project) => <article key={project.title}><span className="project-index"><Lightbulb size={15} /></span><div><h3>{project.title}</h3><p>{project.description}</p></div></article>)}</div>
            <p className="ai-python-project-note">These are sample educational project ideas, not claimed client work or guaranteed course deliverables.</p>
          </section>
        </main>
        <aside className="ai-python-detail-aside">
          <div className="ai-python-summary">
            <span className="eyebrow">At a glance</span>
            <h2>{course.title}</h2>
            <div><Clock3 size={16} /><p><small>Duration</small><strong>{course.duration}</strong></p></div>
            <div><GraduationCap size={17} /><p><small>Suggested learner level</small><strong>{course.level}</strong></p></div>
            <div><Layers3 size={16} /><p><small>Fees, schedule and format</small><strong>Contact us for details</strong></p></div>
            <a className="button button-primary" href="#course-information">Request information <ArrowRight size={16} /></a>
          </div>
        </aside>
      </div>
    </section>

    <section className="ai-python-request ai-python-detail-request" id="course-information">
      <div className="page-wrap ai-python-request-layout">
        <div className="ai-python-request-copy">
          <span className="eyebrow eyebrow-light">Interested in this programme?</span>
          <h2>Ask us about {course.title}.</h2>
          <p>Request course information. Duration and delivery details remain subject to confirmation.</p>
        </div>
        <div className="ai-python-request-form">
          <h3>Request course information</h3>
          <AiPythonEnquiryForm initialCourse={course.title} />
        </div>
      </div>
    </section>
  </>
}
