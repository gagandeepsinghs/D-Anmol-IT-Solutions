import { ArrowRight, ArrowUpRight, BriefcaseBusiness, Bot, ChartNoAxesCombined, Code2, Lightbulb, Sparkles, Workflow } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import CourseCard from '../components/CourseCard'
import { useAppData } from '../context/AppDataContext'
import TrainingMarquee from '../components/TrainingMarquee'
import TechBadge from '../components/TechBadge'
import homeTeamImage from '../assets/images/modules/home-team-learning.jpg'
import classroomImage from '../assets/images/modules/classroom-learning.jpg'

const technologyRows = [
  ['LangChain', 'LangGraph', 'GitHub Copilot', 'Notion AI', 'Canva AI', 'TensorFlow', 'PyTorch', 'OpenCV', 'n8n'],
  ['CSS3', 'React', 'Next.js', 'Node.js', 'Express.js', 'Django', 'MongoDB', 'SQL', 'Git'],
]
const reasons = [
  { icon: Lightbulb, title: 'Learn by doing', body: 'Build practical skills through guided exercises and projects.' },
  { icon: Workflow, title: 'Skills for real work', body: 'Practice with tools and workflows you can use with confidence.' },
  { icon: BriefcaseBusiness, title: 'Made for your goals', body: 'Choose a learning path that fits your next step.' },
]
const testimonials = [
  ['The hands-on exercises helped me connect the concepts to the kind of work I want to do.', 'Sample learner', 'Data Analytics'],
  ['I appreciated learning at a pace that made room for questions and practice.', 'Sample learner', 'Python Programming'],
  ['The team sessions gave us a useful starting point for discussing where automation could help.', 'Sample team participant', 'Corporate Training'],
]

export default function HomePage() {
  const { courses } = useAppData()
  const featuredCourses = courses.filter((course) => course.published !== false)

  return <>
    <section className="hero">
      <div className="hero-grid page-wrap">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> Learn. Innovate. Grow.</span>
          <h1>D-Anmol<br /><span>Enterprises</span></h1>
          <h2 className="hero-subheading">Your one-stop destination for IT &amp; skill development.</h2>
          <p className="hero-lede">Build a smarter career with practical courses, guided projects and supportive training.</p>
          <div className="hero-actions">
            <Button to="/courses" icon>Explore courses</Button>
            <Button to="/contact" variant="quiet">Talk to an advisor <ArrowUpRight size={16} /></Button>
          </div>
        </div>
        <div className="hero-visual">
          <img src={homeTeamImage} alt="Learners collaborating around a table" fetchpriority="high" />
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
    <section className="section section-white home-about">
      <div className="page-wrap home-about-inner">
        <div className="home-about-image">
          <img src={classroomImage} alt="Learners taking part in a training session" loading="lazy" />
        </div>
        <div className="home-about-copy">
          <span className="eyebrow">About D-Anmol Enterprises</span>
          <h2>Learning that moves with you.</h2>
          <p>We help individuals and teams build useful digital skills through practical, supportive training. Our learning paths focus on real-world practice, clear guidance and the confidence to take your next step.</p>
          <Link to="/about" className="text-link">Read more about us <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
    <section className="section home-reasons">
      <div className="page-wrap home-reasons-inner">
        <h2>Why choose<br />D-Anmol Enterprises?</h2>
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
          <span className="eyebrow">Student testimonials</span>
          <h2>Small steps. New possibilities.</h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map(([quote, name, track]) => <article className="testimonial-card" key={track}>
            <div className="quote-mark">“</div>
            <blockquote>“{quote}”</blockquote>
            <div className="testimonial-person">
              <span className="avatar">{name.startsWith('Sample team') ? 'ST' : 'SL'}</span>
              <div><strong>{name}</strong><small>{track} · Sample content</small></div>
            </div>
          </article>)}
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
        <Button to="/contact" variant="light" icon>Contact us / Enrol now</Button>
      </div>
    </section>
  </>
}
