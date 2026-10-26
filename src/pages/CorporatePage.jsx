import { ArrowRight, Bot, ChartNoAxesCombined, Code2, Sparkles, Workflow } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import EnquiryForm from '../components/EnquiryForm'

const topics = [
  { icon: Bot, title: 'AI and Machine Learning', text: 'Build shared foundations and explore practical ways AI can support your team’s work.' },
  { icon: ChartNoAxesCombined, title: 'Data Analytics and Reporting', text: 'Help teams make sense of data, develop analytical habits and communicate insights.' },
  { icon: Code2, title: 'Python and software development', text: 'Develop coding confidence through structured practice and relevant project work.' },
  { icon: Sparkles, title: 'Generative AI and automation', text: 'Explore responsible AI usage and useful workflow automation for everyday processes.' },
  { icon: Workflow, title: 'Programmes shaped around you', text: 'Bring together topics and exercises that respond to your tools, goals and team context.' },
]
const process = [
  ['01', 'Discovery conversation', 'We learn about your team, existing experience, tools and the outcomes you want to work toward.'],
  ['02', 'A tailored learning outline', 'We prepare a proposed programme and practical learning approach for your team to review.'],
  ['03', 'Learning that fits your team', 'Discuss online or in-person delivery and a format that works for your team’s schedule.'],
  ['04', 'Practice and next steps', 'Wrap up with practical exercises, a review of learning goals and suggestions for continued practice.'],
]

export default function CorporatePage() {
  return <>
    <section className="page-hero corporate-hero"><div className="page-wrap corporate-hero-grid"><div><span className="eyebrow eyebrow-light">Corporate learning, made practical</span><h1>Help your team<br />grow with change.</h1><p>Customised technology training starts with what your people need to do—not a stock syllabus.</p><div className="hero-actions"><Button href="#corporate-enquiry" variant="light" icon>Talk about your team</Button><Link className="hero-text-link" to="/courses">Explore course topics <ArrowRight size={16} /></Link></div></div><div className="corporate-hero-image"><img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85" alt="Colleagues collaborating during a team learning session" /><div className="corporate-image-tag"><span className="tag-dot" /> Practical learning, your way</div></div></div></section>
    <section className="section section-white"><div className="page-wrap"><div className="section-heading"><div><span className="eyebrow">What we can cover</span><h2>Skills that connect<br />to your team’s work.</h2></div><p className="section-heading-description">Explore a subject area or combine topics into a programme shaped around your organisation’s learning priorities.</p></div><div className="corporate-topic-grid">{topics.map(({ icon: Icon, title, text }, i) => <article className="topic-card" key={title}><span className="topic-icon"><Icon size={21} /></span><span className="topic-count">0{i + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="section process-section"><div className="page-wrap"><div className="section-heading section-heading-center"><span className="eyebrow">A thoughtful process</span><h2>From a first conversation<br />to practical learning.</h2><p>We’ll work with you to understand the need and agree a helpful next step.</p></div><div className="process-grid">{process.map(([number, title, text]) => <article className="process-step" key={number}><span className="process-number">{number}</span><span className="process-line" /><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="section section-white"><div className="page-wrap format-layout"><div className="format-copy"><span className="eyebrow">Designed for your context</span><h2>Learning should fit the team doing the work.</h2><p>Discuss your team size, experience levels and delivery preferences with us. Programme length, content and learning mode are agreed as part of the planning conversation.</p><ul className="check-list"><li>Online or in-person options to discuss</li><li>Learning outlines tailored to agreed goals</li><li>Examples and exercises relevant to the team</li></ul><Button href="#corporate-enquiry" variant="outline" icon>Start with a conversation</Button></div><div className="format-image"><img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1100&q=85" alt="Team members sharing ideas around a table" loading="lazy" /><span>Every team brings a different perspective.</span></div></div></section>
    <section className="section corporate-enquiry-section" id="corporate-enquiry"><div className="page-wrap corporate-form-layout"><div className="corporate-form-intro"><span className="eyebrow eyebrow-light">Start with discovery</span><h2>Tell us what your team needs to learn.</h2><p>Share a little about your goals and we can use that as a starting point for a discovery conversation.</p><div className="enquiry-promise"><span><CheckMark /></span><p><strong>No stock syllabus.</strong><br />Your programme starts with your team’s context.</p></div></div><EnquiryForm kind="corporate" title="Let’s discuss your team" description="Complete this demo form with a few details about the programme you have in mind." /></div></section>
  </>
}

function CheckMark() {
  return <span className="checkmark-small">✓</span>
}
