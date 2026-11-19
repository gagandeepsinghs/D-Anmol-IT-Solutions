import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'

export default function FaqPage() {
  const { faqs } = useAppData()
  const [openFaq, setOpenFaq] = useState(0)

  const questionList = faqs?.length ? faqs : [
    {
      question: 'Do I need prior experience to join a course?',
      answer: 'No. Many beginner-friendly courses are designed for students and professionals starting from scratch. We can guide you to the most suitable option based on your background.',
    },
    {
      question: 'Are courses available online and in person?',
      answer: 'Yes. We offer both online and offline training depending on the programme, training mode, and current batch availability. Contact us for the options available for your course.',
    },
    {
      question: 'Can you create a training programme for our team?',
      answer: 'Absolutely. We design customised corporate training programmes based on your team’s goals, current skill levels, and the tools or workflows you use in your organisation.',
    },
    {
      question: 'How do I find out about fees and upcoming batches?',
      answer: 'Submit an enquiry and our team will share the current fees, batch schedules, and the best available option for your needs.',
    },
    {
      question: 'Which course should I choose?',
      answer: 'The best course depends on your goals, background, and career interests. Speak with an advisor and we will help you choose the right programme.',
    },
    {
      question: 'Do you offer weekend or flexible batches?',
      answer: 'Yes. Weekend and flexible batch options are available for selected courses. Please contact the team to check the current schedule.',
    },
    {
      question: 'Are projects and practical assignments included?',
      answer: 'Yes. Our courses include hands-on tasks and projects so learners can practice real-world applications and build confidence.',
    },
    {
      question: 'Will I receive a certificate after completion?',
      answer: 'Yes, certificates are typically provided after successful completion of the course and any required assessments.',
    },
    {
      question: 'Can I get course details before enrolling?',
      answer: 'Yes. You can request the syllabus, course structure, module breakdown, delivery format, and project details before you decide to enrol.',
    },
    {
      question: 'Do you provide job support or career guidance?',
      answer: 'We offer career guidance, interview preparation, resume support, and placement assistance where applicable. Employment is not guaranteed, but we help you become job-ready.',
    },
    {
      question: 'How do I request a free demo or counselling session?',
      answer: 'Use the enquiry form on the website or contact our team directly. We will help you understand your goals and suggest the best course path.',
    },
    {
      question: 'Can I change batches or ask about a refund?',
      answer: 'Batch changes and refund requests are handled according to policy and are reviewed case by case. Please contact the academy team for the latest information.',
    },
  ]

  return (
    <section className="section faq-section faq-page">
      <div className="page-wrap faq-page-inner">
        <nav className="faq-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>FAQs</span>
        </nav>

        <div className="faq-page-heading">
          <span className="eyebrow">Good to know</span>
          <h1>Frequently asked questions</h1>
          <p>Quick answers about our courses, learning formats, fee details, batch schedules, and team training.</p>
        </div>

        <div className="faq-list">
          {questionList.map((faq, index) => (
            <article className={`faq-item ${openFaq === index ? 'faq-open' : ''}`} key={`${faq.question}-${index}`}>
              <button
                type="button"
                aria-expanded={openFaq === index}
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
              >
                <span>{faq.question}</span>
                <span className="faq-plus" aria-hidden="true">{openFaq === index ? '−' : '+'}</span>
              </button>
              <div className="faq-answer" aria-hidden={openFaq !== index}>
                <p>{faq.answer}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="faq-page-footer">
          <div>
            <span className="eyebrow">Still have a question?</span>
            <h2>Let’s find the right next step.</h2>
            <p>Contact our team to discuss your course goals, schedule, and learning path.</p>
          </div>
          <Link to="/contact" className="button button-primary">
            Talk to an advisor <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
