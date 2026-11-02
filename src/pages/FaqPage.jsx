import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function FaqPage() {
  const [activeTopic, setActiveTopic] = useState(0)
  const [openFaq, setOpenFaq] = useState(-1)
  const topics = [
    { title: 'Courses', description: 'What we teach, who it suits, and how to choose a path.', questions: [
      ['Which courses do you offer?', 'We offer practical training in AI, data analytics, Python, full stack development, digital marketing, computer skills, typing, and AI Automation.'],
      ['Who can join a course?', 'Students, job seekers, working professionals, entrepreneurs, and beginners can join a course that matches their goals.'],
      ['Do I need coding experience?', 'No. Many courses start from the basics, and each course page explains its recommended starting level.'],
      ['How long do courses take?', 'Duration depends on the selected course and training plan; current duration is shown on each course card and detail page.'],
      ['Which course should I choose?', 'Choose based on your goals, current skills, and preferred work area, or contact an advisor for guidance.'],
      ['What tools will I learn?', 'Tools vary by course and may include Python, Excel, Power BI, SQL, JavaScript, React, AI tools, and digital marketing platforms.'],
      ['Are projects included?', 'Yes. Courses focus on guided practice and projects that help you apply the skills you learn.'],
      ['Can I view the course outline?', 'Yes. Open any course detail page to view its overview, modules, technologies, outcomes, and project ideas.'],
    ].map(([question, answer]) => ({ question, answer })) },
    { title: 'Fees & payment', description: 'How to ask about fees, payment options, and enrolment.', questions: [
      ['How much does a course cost?', 'Fees depend on the course, duration, and delivery format. Contact us for the current fee details.'],
      ['Do online and classroom courses have the same fee?', 'The fee can vary by delivery format and programme, so the team confirms it during your enquiry.'],
      ['What is included in the fee?', 'Your confirmed programme may include training, practical work, course resources, project guidance, and completion support.'],
      ['Can I pay in instalments?', 'Instalment options can be discussed with the team when you enquire about a course.'],
      ['Is there a refund policy?', 'Refund and cancellation terms depend on the programme; ask the team for the applicable policy before enrolling.'],
    ].map(([question, answer]) => ({ question, answer })) },
    { title: 'Batches & classroom', description: 'Where training happens, available formats, and batch timing.', questions: [
      ['Where are classes held?', 'Training may be available online or in a classroom format, depending on the selected course and current batch.'],
      ['Are courses online or in person?', 'Many programmes can be discussed for online or classroom delivery; contact us to confirm availability.'],
      ['How far in advance should I enquire?', 'Enquire early so the team can share the next suitable batch, available timing, and course format.'],
      ['When do batches start?', 'Upcoming batch dates are shared by the team after you submit an enquiry.'],
      ['Can I learn while working or studying?', 'Yes. Ask about available timings and weekend or flexible options for your course.'],
    ].map(([question, answer]) => ({ question, answer })) },
    { title: 'Demo class', description: 'Try the experience, understand the course, and ask questions first.', questions: [
      ['How do I book a demo or consultation?', 'Use the enquiry form or contact an advisor and share the course or learning area you are interested in.'],
      ['Is the demo class free?', 'The team will confirm the available demo or consultation option when you enquire.'],
      ['Can I see the course before enrolling?', 'Yes. You can ask for course details, module information, delivery format, and project examples before deciding.'],
      ['What should I ask during the demo?', 'Ask about the syllabus, duration, timings, fees, projects, support, and whether the course fits your goals.'],
    ].map(([question, answer]) => ({ question, answer })) },
    { title: 'Career support', description: 'How practical learning connects to confidence and next steps.', questions: [
      ['What career support do you provide?', 'Support may include practical projects, guidance on presenting your work, resume advice, and interview preparation.'],
      ['Do you guarantee placement?', 'No placement outcome can be guaranteed; career results depend on your skills, projects, preparation, and the job market.'],
      ['Can I get a job after completing a course?', 'A course can help you build relevant skills and a portfolio, but employment depends on your preparation and individual opportunities.'],
      ['Which roles can the courses prepare me for?', 'Depending on the course, pathways may include data analyst, Python developer, web developer, digital marketer, or AI-related roles.'],
      ['Do I receive a certificate?', 'Certificate details depend on the selected programme and are confirmed before enrolment.'],
      ['Can teams receive support too?', 'Yes. Corporate training can be shaped around your team’s tools, goals, and practical challenges.'],
    ].map(([question, answer]) => ({ question, answer })) },
  ]
  const topic = topics[activeTopic]
  const selectTopic = (index) => {
    setActiveTopic(index)
    setOpenFaq(-1)
  }

  return (
    <section className="section faq-section faq-page">
      <div className="page-wrap faq-page-inner">
        <nav className="faq-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><span>FAQs</span></nav>
        <div className="faq-page-heading">
          <span className="eyebrow">Good to know</span>
          <h1>Frequently asked questions</h1>
          <p>Quick answers about our courses, learning formats, team training, fees, and upcoming batches.</p>
        </div>
        <div className="faq-topic-nav" role="tablist" aria-label="FAQ topics">
          {topics.map((item, index) => <button className={activeTopic === index ? 'is-active' : ''} key={item.title} type="button" role="tab" aria-selected={activeTopic === index} onClick={() => selectTopic(index)}><strong>{item.title}</strong><span>{item.questions.length} questions</span></button>)}
        </div>
        <div className="faq-topic-heading"><span>Topic {activeTopic + 1} of {topics.length}</span><h2>{topic.title}</h2><p>{topic.description}</p></div>
        <div className="faq-list">
          {topic.questions.map((faq, index) => (
            <article className={`faq-item ${openFaq === index ? 'faq-open' : ''}`} key={faq.question}>
              <button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                <span>{faq.question}</span>
                <span className="faq-plus">{openFaq === index ? '−' : '+'}</span>
              </button>
              <div className="faq-answer" aria-hidden={openFaq !== index}><p>{faq.answer}</p></div>
            </article>
          ))}
        </div>
        <div className="faq-page-footer"><div><span className="eyebrow">Still have a question?</span><h2>Let’s find the right next step.</h2><p>Contact our team or ask about a free consultation.</p></div><Link to="/contact" className="button button-primary">Talk to an advisor <ArrowRight size={16} /></Link></div>
      </div>
    </section>
  )
}
