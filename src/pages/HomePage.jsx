import { useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Bot, BookOpenText, BriefcaseBusiness, ChartNoAxesCombined, Code2, Keyboard, Lightbulb, Sparkles, Workflow } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import CourseCard from '../components/CourseCard'
import EnquiryForm from '../components/EnquiryForm'
import { useAppData } from '../context/AppDataContext'
import { categories } from '../data/categories'
import { faqs } from '../data/faqs'
import TrainingMarquee from '../components/TrainingMarquee'

const categoryIcons = [Bot, Sparkles, ChartNoAxesCombined, Code2, Code2, Workflow, Lightbulb, BriefcaseBusiness, BookOpenText, Keyboard]
const reasons = [
  { icon: Lightbulb, title: 'Learn by doing', body: 'Work through guided exercises and practical projects, not just slides and theory.' },
  { icon: Workflow, title: 'Skills for real work', body: 'Build confidence with tools and workflows that connect to everyday tasks.' },
  { icon: BriefcaseBusiness, title: 'Made for your goals', body: 'Choose a learning path for your next step, or shape training around your team.' },
]

export default function HomePage() {
  const { courses } = useAppData()
  const [openFaq, setOpenFaq] = useState(0)
  const publishedCourses = courses.filter((course) => course.published !== false)
  const popular = publishedCourses
  return (
    <>
      <section className="hero">
        <div className="hero-grid page-wrap">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> Practical learning. Possibilities ahead.</span>
            <h1>Build skills.<br /><span>Create your future.</span></h1>
            <p className="hero-lede">Practical learning in AI, data analytics, programming and digital technology, with guided projects that help you put new skills into practice.</p>
            <div className="hero-actions">
              <Button to="/courses" icon>Explore courses</Button>
              <Button to="/contact" variant="quiet">Talk to an advisor <ArrowUpRight size={16} /></Button>
            </div>
            <div className="hero-proof">
              <div className="proof-icons" aria-hidden="true"><span>A</span><span>D</span><span>T</span></div>
              <p><strong>Learning built around practice</strong><br />For individuals and teams</p>
            </div>
          </div>
          <div className="hero-visual">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1500&q=90" alt="Learners collaborating around a table" fetchpriority="high" />
            <div className="hero-tech-icons" aria-hidden="true">
              <span><Bot size={22} /></span>
              <span><Code2 size={20} /></span>
              <span><ChartNoAxesCombined size={20} /></span>
              <span><Sparkles size={18} /></span>
            </div>
            <div className="hero-image-shade" />
            <div className="hero-float-card"><span className="float-icon"><Sparkles size={18} /></span><div><strong>Learn it. Build it.</strong><span>Practical projects, step by step</span></div><ArrowUpRight size={17} /></div>
            <div className="hero-side-note"><span /> Keep learning. Keep moving.</div>
          </div>
        </div>
        <a className="scroll-cue" href="#popular-courses"><ArrowDown size={15} /> Explore what you can learn</a>
      </section>

      <TrainingMarquee />

      <section className="section section-white" id="popular-courses">
        <div className="page-wrap">
          <div className="section-heading">
            <div><span className="eyebrow">Explore our courses</span><h2>Find the skills<br className="desktop-break" /> you want to build.</h2></div>
            <div className="heading-aside"><p>Browse all currently published programmes, from foundational digital skills to AI, programming and team training.</p><Link className="text-link" to="/courses">Search and filter courses <ArrowRight size={16} /></Link></div>
          </div>
          <div className="course-grid">
            {popular.map((course) => <CourseCard key={course.id} course={course} />)}
          </div>
          {popular.length === 0 && <p className="empty-state">Courses are being updated. Please check back soon.</p>}
        </div>
      </section>

      <section className="section categories-section">
        <div className="page-wrap">
          <div className="section-heading section-heading-center"><span className="eyebrow">A wide world of skills</span><h2>Choose a direction.<br />We’ll help you get there.</h2><p>Start with the skills you want to build. Find a course that fits your goals.</p></div>
          <div className="category-grid">
            {categories.map((category, index) => {
              const Icon = categoryIcons[index]
              return <Link to={`/courses?category=${encodeURIComponent(category)}`} className="category-tile" key={category}><span className="category-icon"><Icon size={20} aria-hidden="true" /></span><span className="category-watermark" aria-hidden="true"><Icon size={66} strokeWidth={1.2} /></span><span className="category-title">{category}</span><ArrowUpRight size={16} className="category-arrow" aria-hidden="true" /></Link>
            })}
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="page-wrap">
          <div className="section-heading section-heading-center"><span className="eyebrow">Why learn with us</span><h2>Good learning should<br />feel useful from day one.</h2><p>We focus on the practice, context and support that help new skills stick.</p></div>
          <div className="reason-grid">{reasons.map(({ icon: Icon, title, body }, i) => <article className="reason-card" key={title}><span className="reason-number">0{i + 1}</span><span className="reason-icon"><Icon size={23} /></span><h3>{title}</h3><p>{body}</p></article>)}</div>
        </div>
      </section>

      <section className="project-band">
        <div className="page-wrap project-layout">
          <div className="project-visual">
            <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85" alt="A team sharing ideas during a project workshop" loading="lazy" />
            <div className="project-note"><span><Code2 size={18} /></span><div><strong>Make ideas tangible.</strong><small>Practice with purposeful projects.</small></div></div>
          </div>
          <div className="project-copy"><span className="eyebrow">Make it real</span><h2>Turn new knowledge into something you can show.</h2><p>Projects give you space to experiment, solve problems and connect concepts to practical use—one meaningful step at a time.</p><ul className="check-list"><li>Build confidence through guided practice</li><li>Explore realistic examples and scenarios</li><li>Finish with work that reflects your learning</li></ul><Button to="/courses" variant="outline" icon>Find a hands-on course</Button></div>
        </div>
      </section>

      <section className="corporate-banner">
        <div className="page-wrap corporate-banner-inner">
          <div><span className="eyebrow eyebrow-light">For growing teams</span><h2>Build your team’s next capability.</h2><p>Bring a real team challenge. We’ll shape a practical learning programme around your people, tools and goals.</p></div>
          <Button to="/corporate-training" variant="light" icon>Explore corporate training</Button>
          <div className="banner-mark" aria-hidden="true"><BriefcaseBusiness size={124} strokeWidth={0.8} /></div>
        </div>
      </section>

      <section className="section section-white">
        <div className="page-wrap">
          <div className="section-heading section-heading-center"><span className="eyebrow">Words from learners</span><h2>Small steps. New possibilities.</h2><p>Sample testimonials for this website demo. They are illustrative, not verified learner reviews.</p></div>
          <div className="testimonial-grid">
            {[
              ['“The hands-on exercises helped me connect the concepts to the kind of work I want to do.”', 'Sample learner', 'Data Analytics'],
              ['“I appreciated learning at a pace that made room for questions and practice.”', 'Sample learner', 'Python Programming'],
              ['“The team sessions gave us a useful starting point for discussing where automation could help.”', 'Sample team participant', 'Corporate Training'],
            ].map(([quote, name, track]) => <article className="testimonial-card" key={track}><div className="quote-mark">“</div><blockquote>{quote}</blockquote><div className="testimonial-person"><span className="avatar">{name.startsWith('Sample team') ? 'ST' : 'SL'}</span><div><strong>{name}</strong><small>{track} · Sample content</small></div></div></article>)}
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="page-wrap faq-layout">
          <div className="faq-intro"><span className="eyebrow">Good to know</span><h2>Questions before you begin?</h2><p>Here are a few useful details to help you choose your next step.</p><Link to="/contact" className="text-link">Ask us a question <ArrowRight size={16} /></Link></div>
          <div className="faq-list">{faqs.map((faq, i) => <article className={`faq-item ${openFaq === i ? 'faq-open' : ''}`} key={faq.question}><button type="button" aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? -1 : i)}><span>{faq.question}</span><span className="faq-plus">{openFaq === i ? '−' : '+'}</span></button>{openFaq === i && <p>{faq.answer}</p>}</article>)}</div>
        </div>
      </section>

      <section className="section contact-cta-section"><div className="page-wrap contact-cta"><div><span className="eyebrow eyebrow-light">Your next chapter starts here</span><h2>Have a learning goal in mind?</h2><p>Let’s find a practical next step that makes sense for you.</p></div><Button to="/contact" variant="light" icon>Get in touch</Button></div></section>
      <section className="section section-white home-contact"><div className="page-wrap home-contact-inner"><div><span className="eyebrow">Let’s talk</span><h2>A question about a course?</h2><p>Tell us what you are looking for. The form is demo-only until a backend or email service is connected.</p></div><EnquiryForm compact title="Send a demo enquiry" /></div></section>
    </>
  )
}
