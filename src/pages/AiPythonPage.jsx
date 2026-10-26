import { ArrowRight, ArrowUpRight, Bot, BrainCircuit, Braces, Clock3, Database, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import AiPythonEnquiryForm from '../components/AiPythonEnquiryForm'
import TechBadge from '../components/TechBadge'
import { aiPythonCourses } from '../data/aiPythonCourses'

const icons = [Braces, Database, BrainCircuit, Sparkles, Bot]

export default function AiPythonPage() {
  return <>
    <section className="ai-python-hero">
      <div className="page-wrap ai-python-hero-grid">
        <div className="ai-python-hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> Practical AI & Python training</span>
          <h1>Learn AI &amp; Python.<br /><span>Build Your Future.</span></h1>
          <p>Build practical skills through guided training, real-world project ideas and learning paths shaped around today’s AI and Python tools.</p>
          <div className="hero-actions">
            <Button href="#ai-python-courses" icon>Explore programmes</Button>
            <Button href="#request-information" variant="quiet">Request course information <ArrowUpRight size={16} /></Button>
          </div>
          <div className="ai-python-hero-note"><span><Sparkles size={17} /></span><p><strong>Learn by building</strong><br />A practical path from foundations to applied projects</p></div>
        </div>
        <div className="ai-python-hero-visual">
          <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85" alt="Abstract artificial intelligence visualization" fetchpriority="high" />
          <div className="ai-python-visual-shade" />
          <div className="ai-python-visual-tag"><span /> Python · Data · AI</div>
          <div className="ai-python-visual-card"><BrainCircuit size={20} /><span><strong>Explore. Practice.</strong><small>Turn concepts into prototypes</small></span></div>
        </div>
      </div>
      <div className="ai-python-hero-bottom"><span>Python foundations</span><i /><span>Data and machine learning</span><i /><span>Generative AI and automation</span></div>
    </section>

    <section className="section section-white ai-python-courses" id="ai-python-courses">
      <div className="page-wrap">
        <div className="section-heading">
          <div><span className="eyebrow">Explore the programmes</span><h2>Build skills one project<br className="desktop-break" /> at a time.</h2></div>
          <p className="section-heading-description">Choose a starting point, explore the curriculum and discover the technologies used in each learning path.</p>
        </div>
        <div className="ai-python-course-grid">
          {aiPythonCourses.map((course, index) => {
            const Icon = icons[index]
            return (
              <article className="ai-python-course-card" key={course.slug}>
                <Link className="ai-python-card-image" to={`/ai-python/${course.slug}`} aria-label={`View ${course.title} course details`}>
                  <img src={course.image} alt="" loading="lazy" />
                  <span className="ai-python-card-category">{course.category}</span>
                  <span className="ai-python-card-icon"><Icon size={19} /></span>
                </Link>
                <div className="ai-python-card-body">
                  <div className="ai-python-card-duration"><Clock3 size={14} />{course.duration}</div>
                  <h3><Link to={`/ai-python/${course.slug}`}>{course.title}</Link></h3>
                  <p>{course.description}</p>
                  <div className="technology-list" aria-label={`Technologies covered: ${course.technologies.join(', ')}`}>
                    {course.technologies.map((technology, techIndex) => <TechBadge key={technology} name={technology} index={techIndex} />)}
                  </div>
                  <div className="ai-python-card-footer"><Link className="text-link" to={`/ai-python/${course.slug}`}>View Course <ArrowRight size={16} /></Link><span>{course.level}</span></div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>

    <section className="ai-python-approach">
      <div className="page-wrap ai-python-approach-layout">
        <div className="ai-python-approach-image"><img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1100&q=85" alt="A team collaborating on a practical technology project" loading="lazy" /></div>
        <div className="ai-python-approach-copy">
          <span className="eyebrow">Learn through practice</span>
          <h2>Build understanding by making things.</h2>
          <p>Each learning path combines core ideas with guided exercises and project prompts. Explore a topic, test what you learn and practice explaining your approach.</p>
          <div className="ai-python-points">
            <div><span>01</span><p><strong>Clear foundations</strong><small>Start with the concepts and tools behind the subject.</small></p></div>
            <div><span>02</span><p><strong>Guided application</strong><small>Practice workflows with structured examples and feedback.</small></p></div>
            <div><span>03</span><p><strong>Project thinking</strong><small>Apply ideas to sample projects and scoped challenges.</small></p></div>
          </div>
        </div>
      </div>
    </section>

    <section className="ai-python-request" id="request-information">
      <div className="page-wrap ai-python-request-layout">
        <div className="ai-python-request-copy">
          <span className="eyebrow eyebrow-light">Take the next step</span>
          <h2>Request course information.</h2>
          <p>Share the course you’re interested in and the team can provide details. Duration, schedule and other unconfirmed information are available on request.</p>
          <div className="ai-python-request-note"><span><Sparkles size={17} /></span><p><strong>No fees or outcomes assumed.</strong><br />Contact us for details about course availability and format.</p></div>
        </div>
        <div className="ai-python-request-form">
          <h3>What would you like to learn?</h3>
          <p>All fields are required. The form is a browser-only demo.</p>
          <AiPythonEnquiryForm />
        </div>
      </div>
    </section>
  </>
}
