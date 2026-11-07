import {
  ArrowRight,
  BookOpen,
  Compass,
  GraduationCap,
  Handshake,
  Lightbulb,
  Target,
  UsersRound,
  Workflow,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import classroomImage from '../assets/images/modules/classroom-learning.jpg'
import teamPlanningImage from '../assets/images/modules/team-planning.jpg'

const strengths = [
  {
    icon: Workflow,
    title: 'Practice as you learn',
    body: 'Build understanding through guided exercises and practical project work.',
  },
  {
    icon: BookOpen,
    title: 'Clear learning paths',
    body: 'Explore courses across AI, analytics, programming and everyday digital skills.',
  },
  {
    icon: Handshake,
    title: 'Support along the way',
    body: 'Learn in a supportive environment where questions and steady progress matter.',
  },
  {
    icon: UsersRound,
    title: 'Learning for people and teams',
    body: 'Find individual learning options or discuss training for your organisation.',
  },
]

const learningSteps = [
  {
    number: '01',
    title: 'Start with your goal',
    body: 'Choose a subject or skill that connects with what you want to learn next.',
  },
  {
    number: '02',
    title: 'Build the foundations',
    body: 'Work through key ideas with clear explanations and a guided learning path.',
  },
  {
    number: '03',
    title: 'Put ideas into practice',
    body: 'Strengthen your understanding with exercises and practical project work.',
  },
  {
    number: '04',
    title: 'Keep moving forward',
    body: 'Use what you have learned as a starting point for your next challenge.',
  },
]

const values = [
  {
    icon: Lightbulb,
    title: 'Curiosity',
    body: 'Stay open to new ideas, tools and ways to solve problems.',
  },
  {
    icon: Target,
    title: 'Purpose',
    body: 'Keep learning connected to clear goals and practical outcomes.',
  },
  {
    icon: Handshake,
    title: 'Support',
    body: 'Make room for questions, guidance and learning at a steady pace.',
  },
  {
    icon: Compass,
    title: 'Progress',
    body: 'Treat every new skill as a foundation for what comes next.',
  },
]

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="page-hero about-hero">
        <div className="page-wrap about-hero-grid">
          <div className="about-hero-copy">
            <span className="eyebrow eyebrow-light">About D-Anmol Enterprises</span>
            <h1>Practical skills.<br />Ready to grow.</h1>
            <p>
              We help people and teams build useful digital skills through clear
              instruction, hands-on learning and supportive guidance.
            </p>
            <div className="about-hero-actions">
              <Button to="/courses" variant="light" icon>Explore our courses</Button>
              <Link to="/contact" className="about-hero-link">
                Talk to our team <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <figure className="about-hero-image">
            <img
              src={teamPlanningImage}
              alt="A team working together on ideas around a table"
              fetchpriority="high"
            />
            <figcaption>
              <span><GraduationCap size={19} aria-hidden="true" /></span>
              <div>
                <strong>Learn by doing</strong>
                <small>Build understanding through practice</small>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="about-highlights" aria-label="Our learning focus">
        <div className="page-wrap about-highlights-grid">
          <div><strong>Practical learning</strong><span>Exercises and project work</span></div>
          <div><strong>Useful digital skills</strong><span>Technology and everyday tools</span></div>
          <div><strong>People and teams</strong><span>Individual and organisational learning</span></div>
        </div>
      </section>

      <section className="section section-white about-story">
        <div className="page-wrap about-story-grid">
          <figure className="about-story-image">
            <img
              src={classroomImage}
              alt="Learners taking part in a collaborative classroom session"
              loading="lazy"
            />
            <figcaption>Learning grows through practice, questions and shared ideas.</figcaption>
          </figure>
          <div className="about-story-copy">
            <span className="eyebrow">Who we are</span>
            <h2>Technology learning, made practical and approachable.</h2>
            <p>
              Technology keeps changing. We believe learning should help people
              understand the tools in front of them and feel ready to keep
              learning as new ones emerge.
            </p>
            <p>
              D-Anmol Enterprises brings together courses in artificial
              intelligence, data analytics, programming, digital marketing and
              everyday computer skills. Our focus is on clear foundations,
              guided practice and useful projects—not just covering topics.
            </p>
            <p>
              We also work with organisations to discuss training that reflects
              their team’s goals and learning needs.
            </p>
            <Link to="/courses" className="text-link">
              Find a course to explore <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="about-purpose">
        <div className="page-wrap about-purpose-grid">
          <article className="about-purpose-card about-mission">
            <span className="about-purpose-icon"><Target size={21} aria-hidden="true" /></span>
            <span className="about-card-kicker">Our mission</span>
            <h2>Make useful technology skills easier to learn.</h2>
            <p>
              We aim to make learning practical and approachable through clear
              guidance, hands-on exercises and opportunities to apply new ideas.
            </p>
          </article>
          <article className="about-purpose-card about-vision">
            <span className="about-purpose-icon"><Compass size={21} aria-hidden="true" /></span>
            <span className="about-card-kicker">Our vision</span>
            <h2>Help every learner take their next step with confidence.</h2>
            <p>
              We want people to feel equipped to keep building skills and
              adapting as technology and their goals evolve.
            </p>
          </article>
        </div>
      </section>

      <section className="section section-white about-strengths">
        <div className="page-wrap">
          <div className="section-heading section-heading-center">
            <span className="eyebrow">Why learn with us</span>
            <h2>A thoughtful approach to building skills.</h2>
            <p>
              Good learning combines a clear direction with time to practise,
              ask questions and connect ideas to real tasks.
            </p>
          </div>
          <div className="about-strength-grid">
            {strengths.map(({ icon: Icon, title, body }) => (
              <article className="about-strength-card" key={title}>
                <span><Icon size={22} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-learning">
        <div className="page-wrap">
          <div className="about-learning-heading">
            <div>
              <span className="eyebrow">How learning takes shape</span>
              <h2>From your first question to practical progress.</h2>
            </div>
            <p>
              Learning is more rewarding when each step has a purpose. Our
              courses bring ideas and practice together so you can build on what
              you learn.
            </p>
          </div>
          <ol className="about-learning-steps">
            {learningSteps.map(({ number, title, body }) => (
              <li key={number}>
                <span className="about-step-number">{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-white about-values">
        <div className="page-wrap">
          <div className="section-heading section-heading-center">
            <span className="eyebrow">What guides us</span>
            <h2>Principles behind the learning experience.</h2>
          </div>
          <div className="about-values-grid">
            {values.map(({ icon: Icon, title, body }) => (
              <article className="about-value-card" key={title}>
                <span><Icon size={19} aria-hidden="true" /></span>
                <div><h3>{title}</h3><p>{body}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="page-wrap about-cta-inner">
          <div>
            <span className="eyebrow eyebrow-light">Your next step starts here</span>
            <h2>Let’s find a learning path that fits.</h2>
            <p>Explore a course or talk with us about training for your team.</p>
          </div>
          <div className="about-cta-actions">
            <Button to="/courses" variant="light" icon>Explore courses</Button>
            <Link to="/contact" className="about-cta-link">
              Contact us <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
