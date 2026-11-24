import { ArrowRight, ArrowUpRight, BookOpenText, BriefcaseBusiness, Bot, ChartNoAxesCombined, Code2, Compass, Lightbulb, MessageCircle, Phone, Sparkles, Target, Workflow } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import CourseCard from '../components/CourseCard'
import { useAppData } from '../context/AppDataContext'
import TrainingMarquee from '../components/TrainingMarquee'
import TechBadge from '../components/TechBadge'
import homeTeamImage from '../assets/images/sections/optimized/home-team-learning.webp'

const technologyRows = [
  ['LangChain', 'LangGraph', 'GitHub Copilot', 'Notion AI', 'Canva AI', 'TensorFlow', 'PyTorch', 'OpenCV', 'n8n'],
  ['CSS3', 'React', 'Next.js', 'Node.js', 'Express.js', 'Django', 'MongoDB', 'SQL', 'Git'],
]
const reasons = [
  { icon: Lightbulb, title: 'Step-by-step teaching', body: 'Beginner-friendly instruction helps learners build understanding one step at a time.' },
  { icon: Workflow, title: 'Practical, industry-relevant learning', body: 'Apply course topics through hands-on exercises and practical projects.' },
  { icon: BriefcaseBusiness, title: 'Personal attention and support', body: 'Small batches, doubt-solving, and career guidance support learners along the way.' },
]
const learningSteps = [
  { icon: BookOpenText, number: '01', title: 'Choose your learning path', body: 'Explore course outlines and ask about the available duration for your chosen course.' },
  { icon: Code2, number: '02', title: 'Learn through practice', body: 'Build your understanding with guided exercises and course projects.' },
  { icon: BriefcaseBusiness, number: '03', title: 'Plan your next step', body: 'Ask our team about course fit, learning format and upcoming schedules.' },
]
const careerGuidanceCards = [
  {
    icon: Lightbulb,
    title: 'Non-technical background?',
    body: 'Start with practical computer, data, or digital skills—no technical background needed.',
    href: '/courses',
    tone: 'orange',
  },
  {
    icon: Code2,
    title: 'Coding se shuruaat nahi karni?',
    body: 'Explore automation and no-code tools, then build technical skills at your own pace.',
    href: '/ai-python',
    tone: 'blue',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Next step ko lekar confusion hai?',
    body: 'Tell us about your goals and we’ll help you plan a practical learning path.',
    href: '/contact?request=demo#enquiry-form',
    tone: 'green',
  },
]
const careerGuidanceSteps = [
  { icon: Target, title: 'Understand your goal', href: '/contact?request=demo#enquiry-form' },
  { icon: Compass, title: 'Choose a path', href: '/courses' },
  { icon: BookOpenText, title: 'Learn with guidance', href: '/ai-python' },
  { icon: BriefcaseBusiness, title: 'Plan your next step', href: '/contact' },
]
const careerDirections = [
  { icon: ChartNoAxesCombined, title: 'Data Analytics', href: '/courses/data-analytics' },
  { icon: Workflow, title: 'AI & Automation', href: '/courses/ai-automation' },
  { icon: Code2, title: 'Full Stack Development', href: '/courses/full-stack-development-course-in-chandigarh' },
  { icon: Lightbulb, title: 'Digital Marketing', href: '/courses/digital-marketing-course-in-chandigarh' },
]

export default function HomePage() {
  const { courses, siteSettings } = useAppData()
  const featuredCourses = courses.filter((course) => course.published !== false)
  const whatsappNumber = siteSettings.whatsappNumber.replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello, mujhe apne career ke next step ke baare mein guidance chahiye.')}`
  const phoneUrl = `tel:${siteSettings.phone.replace(/[^\d+]/g, '')}`

  return <>
    <section className="hero">
      <div className="hero-grid page-wrap">
        <div className="hero-copy">
          <h1>D-Anmol<br /><span>Academy</span></h1>
          <h2 className="hero-subheading">Beginner-friendly technology and digital skills training.</h2>
          <p className="hero-lede">Learn step by step with experienced trainers, hands-on projects, and personal support. Online training is available across India; offline training targets Mohali, Chandigarh, and Panchkula.</p>
          <div className="hero-actions">
            <Button to="/courses" icon>Explore courses</Button>
            <Button to="/contact?request=demo#enquiry-form" variant="quiet">Book a Free Demo <ArrowUpRight size={16} /></Button>
          </div>
        </div>
        <div className="hero-visual">
          <img src={siteSettings.homeHeroImage || homeTeamImage} alt="Learners collaborating around a table" fetchpriority="high" onError={(event) => { event.currentTarget.src = homeTeamImage }} />
          <div className="hero-tech-icons" aria-hidden="true">
            <span><Bot size={22} /></span><span><Code2 size={20} /></span>
            <span><ChartNoAxesCombined size={20} /></span><span><Sparkles size={18} /></span>
          </div>
          <div className="hero-image-shade" />
          <div className="hero-float-card">
            <span className="float-icon"><Sparkles size={18} /></span>
            <div><strong>Learn it. Build it.</strong><span>Practical projects, step by step</span></div>
            <ArrowUpRight size={17} />
          </div>
        </div>
      </div>
    </section>
    <TrainingMarquee />
    <section className="section home-technologies">
      <div className="page-wrap">
        <div className="section-heading section-heading-center">
          <span className="eyebrow">Learn with tools used in the industry</span>
          <h2>Tools &amp; <span>Technologies You’ll Study</span></h2>
          <p>Hands-on practice with the platforms and frameworks used in modern tech teams.</p>
        </div>
        <div className="home-tech-marquee" aria-label="Technologies covered in our courses">
          {technologyRows.map((row, rowIndex) => <div className={`home-tech-track ${rowIndex % 2 ? 'home-tech-track-reverse' : ''}`} key={rowIndex}>
            {[0, 1].map((copy) => <div className="home-tech-group" aria-hidden={copy === 1 ? 'true' : undefined} key={copy}>
              {row.map((name, index) => <TechBadge name={name} index={index} key={name} />)}
            </div>)}
          </div>)}
        </div>
        <div className="section-action-center">
          <Link to="/courses" className="button button-outline">Explore all courses <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
    <section className="section home-career-guidance">
      <div className="page-wrap career-guidance-layout">
        <div className="career-guidance-main">
          <span className="career-guidance-eyebrow"><span aria-hidden="true" /> Confused about your next step?</span>
          <h2>Career ki shuruaat<br /><span>kahan se karein?</span></h2>
          <p className="career-guidance-lede">Aapko abhi sab kuch decide karne ki zaroorat nahi. Apne interests aur goals par humse baat karein—hum aapko suitable learning path samjhayenge.</p>
          <div className="career-guidance-cards">
            {careerGuidanceCards.map(({ icon: Icon, title, body, href, tone }, index) => (
              <Link className={`career-guidance-card career-guidance-card-${tone}`} to={href} key={title} style={{ '--card-index': index }}>
                <span className="career-guidance-card-icon"><Icon size={22} aria-hidden="true" /></span>
                <span className="career-guidance-card-copy"><strong>{title}</strong><span>{body}</span></span>
                <ArrowUpRight className="career-guidance-card-arrow" size={18} aria-hidden="true" />
              </Link>
            ))}
          </div>
          <ol className="career-guidance-steps" aria-label="Your learning journey">
            {careerGuidanceSteps.map(({ icon: Icon, title, href }) => (
              <li key={title}>
                <Link to={href}>
                  <span className="career-guidance-step-icon"><Icon size={24} aria-hidden="true" /></span>
                  <strong>{title}</strong>
                </Link>
              </li>
            ))}
          </ol>
          <div className="career-guidance-actions">
            <a className="career-guidance-action career-guidance-action-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={18} aria-hidden="true" /> WhatsApp par baat karein
            </a>
            <a className="career-guidance-action career-guidance-action-call" href={phoneUrl}>
              <Phone size={18} aria-hidden="true" /> Call karein
            </a>
          </div>
        </div>
        <aside className="career-guidance-directions" aria-labelledby="career-guidance-directions-title">
          <div className="career-guidance-directions-heading">
            <span className="career-guidance-compass"><Compass size={25} aria-hidden="true" /></span>
            <span><small>Find your direction</small><strong id="career-guidance-directions-title">Explore a path</strong></span>
          </div>
          <p>Start with the subject that interests you. We’ll help you take it one step at a time.</p>
          <nav aria-label="Popular learning paths">
            {careerDirections.map(({ icon: Icon, title, href }, index) => (
              <Link className={`career-guidance-direction-link career-guidance-direction-${index + 1}`} to={href} key={title}>
                <Icon size={19} aria-hidden="true" />
                <span>{title}</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            ))}
            <Link className="career-guidance-all-paths" to="/courses">And more courses <ArrowRight size={16} aria-hidden="true" /></Link>
          </nav>
          <span className="career-guidance-directions-note">Not sure yet? That’s a good place to start.</span>
        </aside>
      </div>
    </section>
    <section className="section home-reasons">
      <div className="page-wrap home-reasons-inner">
        <h2>Why choose<br />D Anmol Enterprises?</h2>
        {reasons.map(({ icon: Icon, title, body }) => <article className="home-reason" key={title}>
          <Icon size={25} aria-hidden="true" />
          <div><h3>{title}</h3><p>{body}</p></div>
        </article>)}
      </div>
    </section>
    <section className="section section-white home-course-list" id="popular-courses">
      <div className="page-wrap">
        <div className="section-heading courses-section-heading">
          <div>
            <span className="eyebrow">Our training courses</span>
            <h2>Find your next direction.</h2>
            <p className="section-heading-description">Focused learning paths designed to help you build useful skills with confidence.</p>
          </div>
          <Link to="/courses" className="text-link view-all-courses">View all courses <ArrowRight size={16} /></Link>
        </div>
        {featuredCourses.length > 0
          ? <div className="course-grid">{featuredCourses.map((course) => <CourseCard key={course.id} course={course} />)}</div>
          : <p className="empty-state">Courses are being updated. Please check back soon.</p>}
      </div>
    </section>
    <section className="section section-white">
      <div className="page-wrap">
        <div className="section-heading section-heading-center">
          <span className="eyebrow">A practical way to learn</span>
          <h2>From learning goals to practical skills.</h2>
          <p>Explore a clear path from choosing a course to planning what comes next.</p>
        </div>
        <div className="learning-step-grid">
          {learningSteps.map(({ icon: Icon, number, title, body }) => <article className="learning-step-card" key={number}>
            <div className="learning-step-icon"><Icon size={22} aria-hidden="true" /></div>
            <span className="learning-step-number">{number}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>)}
        </div>
        <div className="section-action-center">
          <Link to="/courses" className="button button-outline">Explore courses <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
    <section className="section contact-cta-section">
      <div className="page-wrap contact-cta">
        <div>
          <span className="eyebrow eyebrow-light">Ready to begin?</span>
          <h2>Take your next step with confidence.</h2>
          <p>Tell us what you want to learn and we’ll help you find the right path.</p>
        </div>
        <Button to="/contact" variant="light" icon>Contact Academy</Button>
      </div>
    </section>
  </>
}
