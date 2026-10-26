import { ArrowRight, Compass, Handshake, Lightbulb, Target } from 'lucide-react'
import { Button } from '../components/Button'
import classroomImage from '../assets/images/classroom-learning.jpg'

const principles = [
  { icon: Target, title: 'Start with the goal', body: 'Learning is more relevant when it begins with what someone wants to understand, make or do.' },
  { icon: Lightbulb, title: 'Make room for practice', body: 'We value guided exercises and practical projects that help turn new ideas into useful skills.' },
  { icon: Handshake, title: 'Learn together', body: 'Questions, feedback and shared problem solving are an important part of the learning experience.' },
  { icon: Compass, title: 'Keep moving forward', body: 'Technology changes. Building the confidence to keep learning matters just as much as any one tool.' },
]

export default function AboutPage() {
  return <>
    <section className="page-hero about-hero"><div className="page-wrap about-hero-grid"><div><span className="eyebrow eyebrow-light">About D-Anmol Enterprises</span><h1>Practical learning<br />for a changing world.</h1><p>We offer training in AI, analytics, programming and digital technology—with a focus on learning by doing.</p><Button to="/courses" variant="light" icon>Explore our courses</Button></div><div className="about-hero-image"><img src={classroomImage} alt="Learners taking part in a collaborative classroom session" /></div></div></section>
    <section className="section section-white"><div className="page-wrap about-intro"><div className="about-intro-label"><span className="eyebrow">What we do</span><span className="about-mark">D-A.</span></div><div><h2>Helping people build skills they can put into practice.</h2><p>D-Anmol Enterprises provides learning programmes across areas including artificial intelligence, data analytics, programming and digital technology. Our courses are designed to combine clear explanations with opportunities to practice, ask questions and apply ideas through projects.</p><p>We also work with organisations to explore team training needs and discuss programmes shaped around their goals and working context.</p></div></div></section>
    <section className="section principles-section"><div className="page-wrap"><div className="section-heading section-heading-center"><span className="eyebrow">How we approach learning</span><h2>Useful skills grow<br />through useful practice.</h2><p>Our approach keeps the learner and the reason for learning in view.</p></div><div className="principles-grid">{principles.map(({ icon: Icon, title, body }) => <article className="principle-card" key={title}><span><Icon size={22} /></span><h3>{title}</h3><p>{body}</p></article>)}</div></div></section>
    <section className="about-cta"><div className="page-wrap about-cta-inner"><div><span className="eyebrow eyebrow-light">Make your next move</span><h2>Find a learning path that fits.</h2><p>Explore available topics or talk with us about team training.</p></div><Button to="/contact" variant="light" icon>Get in touch</Button></div></section>
  </>
}
