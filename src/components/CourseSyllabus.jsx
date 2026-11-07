import { useState } from 'react'
import { ArrowDownToLine, ArrowRight, BookOpenCheck, Check, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import syllabusData from '../data/courseSyllabi'
import './CourseSyllabus.css'

const syllabusPdfUrls = import.meta.glob('../Courses/**/*.pdf', {
  eager: true,
  query: '?url',
  import: 'default',
})

const durationOptions = [
  { key: '45_Days', label: '45 Days', note: 'Fast-track foundation' },
  { key: '3_Months', label: '3 Months', note: 'Guided skill building' },
  { key: '6_Months', label: '6 Months', note: 'Extended practice' },
]

export default function CourseSyllabus({
  folder,
  courseTitle,
  image,
  heading = 'Choose a learning pathway',
  enquiryHref,
  corporate = false,
}) {
  const [selectedDuration, setSelectedDuration] = useState('3_Months')
  const durations = syllabusData[folder]
  const syllabus = durations?.[selectedDuration]
  const pdfUrl = syllabusPdfUrls[`../Courses/${folder}/${selectedDuration}_Detailed_Syllabus.pdf`]

  if (!syllabus) return null

  const workflow = syllabus.workflow.length
    ? syllabus.workflow
    : ['Learn concepts', 'Practise skills', 'Build projects', 'Show portfolio']

  return (
    <section className="section course-pathway-section" aria-labelledby="course-pathway-heading">
      <div className="page-wrap">
        <div className="course-pathway-intro">
          <div className="course-pathway-copy">
            <span className="eyebrow">{corporate ? 'Flexible team pathways' : 'Built from the course syllabus'}</span>
            <h2 id="course-pathway-heading">{heading}</h2>
            <p>
              {corporate
                ? 'Explore a starting-point roadmap for your team. We can adapt the topics, pace and projects together during planning.'
                : `Compare three ways to study ${courseTitle}, with step-by-step topics and practical activities taken from the supplied course syllabus.`}
            </p>
          </div>
          <div className="course-pathway-visual">
            <img src={image} alt={`${courseTitle} learning pathway`} loading="lazy" />
            <span><BookOpenCheck size={17} /> Learn · practise · build</span>
          </div>
        </div>

        <div className="course-duration-switcher" role="tablist" aria-label={`${courseTitle} course duration`}>
          {durationOptions.map((option) => (
            <button
              type="button"
              role="tab"
              id={`duration-${folder}-${option.key}`}
              aria-selected={selectedDuration === option.key}
              aria-controls={`roadmap-${folder}`}
              key={option.key}
              onClick={() => setSelectedDuration(option.key)}
            >
              <span>{option.label}</span>
              <small>{option.note}</small>
            </button>
          ))}
        </div>

        <div
          className="course-pathway-panel"
          id={`roadmap-${folder}`}
          role="tabpanel"
          aria-labelledby={`duration-${folder}-${selectedDuration}`}
          tabIndex={0}
        >
          <div className="course-pathway-panel-heading">
            <div>
              <span className="eyebrow">{syllabus.label} pathway</span>
              <h3>{courseTitle}</h3>
            </div>
            <span className="course-pathway-module-count"><Clock3 size={16} /> {syllabus.modules.length} learning steps</span>
          </div>

          <ol className="course-workflow" aria-label="Learning workflow">
            {workflow.map((stage, index) => (
              <li key={`${stage}-${index}`}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{stage}</strong>
                {index < workflow.length - 1 && <ArrowRight size={16} aria-hidden="true" />}
              </li>
            ))}
          </ol>

          <ol className="course-roadmap-grid">
            {syllabus.modules.map((module, index) => (
              <li className="course-roadmap-card" key={`${module.number}-${module.title}`}>
                <span className="course-roadmap-number">{String(module.number).padStart(2, '0')}</span>
                <div>
                  <span className="course-roadmap-step">Step {String(index + 1).padStart(2, '0')}</span>
                  <h4>{module.title}</h4>
                </div>
                {module.topics.length > 0 && (
                  <ul className="course-topic-chips" aria-label="Topics covered">
                    {module.topics.slice(0, 4).map((topic) => <li key={topic}>{topic}</li>)}
                    {module.topics.length > 4 && <li>+{module.topics.length - 4} more</li>}
                  </ul>
                )}
                {module.activity && <p className="course-roadmap-activity"><Check size={15} />{module.activity}</p>}
              </li>
            ))}
          </ol>

          <div className="course-pathway-footer">
            <div className="course-pathway-projects">
              <span className="eyebrow">{corporate ? 'Applied team exercises' : 'Project ideas in the syllabus'}</span>
              <ul>
                {syllabus.buildItems.map((project) => <li key={project}>{project}</li>)}
              </ul>
            </div>
            <div className="course-pathway-actions">
              {pdfUrl
                ? <a className="button button-outline" href={pdfUrl} download={`${folder}-${selectedDuration}-syllabus.pdf`}><ArrowDownToLine size={16} /> Download full syllabus</a>
                : <p className="course-pdf-unavailable">The full syllabus PDF is not available in this build.</p>}
              <Link className="course-pathway-enquire" to={enquiryHref}>
                {corporate ? 'Discuss this pathway' : 'Ask about this course'} <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {pdfUrl && (
            <details className="course-pdf-preview">
              <summary>Preview the complete {syllabus.label} syllabus</summary>
              <iframe
                src={`${pdfUrl}#view=FitH`}
                title={`${courseTitle} ${syllabus.label} full syllabus`}
                loading="lazy"
              />
            </details>
          )}
        </div>
      </div>
    </section>
  )
}
