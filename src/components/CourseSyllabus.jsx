import { useState } from 'react'
import { ArrowRight, BookOpenCheck, Check, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import syllabusData from '../data/courseSyllabi'
import './CourseSyllabus.css'

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
  syllabusOverride,
  embedded = false,
}) {
  const durations = syllabusData[folder]
  const availableDurations = durationOptions.filter((option) => durations?.[option.key])
  const [selectedDuration, setSelectedDuration] = useState('3_Months')
  const activeDuration = availableDurations.some((option) => option.key === selectedDuration)
    ? selectedDuration
    : availableDurations.find((option) => option.key === '3_Months')?.key || availableDurations[0]?.key || '3_Months'
  const syllabus = activeDuration === '3_Months'
    ? syllabusOverride || durations?.[activeDuration]
    : durations?.[activeDuration] || syllabusOverride

  if (!syllabus) return null

  const hasDurationOptions = availableDurations.length > 1
  const workflow = syllabus.workflow.length
    ? syllabus.workflow
    : ['Learn concepts', 'Practise skills', 'Build projects', 'Show portfolio']

  return (
    <section
      className={`section course-pathway-section${embedded ? ' course-pathway-section-embedded' : ''}`}
      aria-labelledby={corporate ? 'course-pathway-heading' : `roadmap-${folder}-heading`}
    >
      <div className="page-wrap">
        {corporate && (
          <div className="course-pathway-intro">
            <div className="course-pathway-copy">
              <span className="eyebrow">Flexible team pathways</span>
              <h2 id="course-pathway-heading">{heading}</h2>
              <p>Explore a starting-point roadmap for your team. We can adapt the topics, pace and projects together during planning.</p>
            </div>
            <div className="course-pathway-visual">
              <img src={image} alt={`${courseTitle} learning pathway`} loading="lazy" />
              <span><BookOpenCheck size={17} /> Learn · practise · build</span>
            </div>
          </div>
        )}

        {hasDurationOptions && (
          <div className="course-duration-switcher" role="tablist" aria-label={`${courseTitle} course duration`}>
            {availableDurations.map((option) => (
              <button
                type="button"
                role="tab"
                id={`duration-${folder}-${option.key}`}
                aria-selected={activeDuration === option.key}
                aria-controls={`roadmap-${folder}`}
                key={option.key}
                onClick={() => setSelectedDuration(option.key)}
              >
                <span>{option.label}</span>
                <small>{option.note}</small>
              </button>
            ))}
          </div>
        )}

        <div
          className="course-pathway-panel"
          id={`roadmap-${folder}`}
          role={hasDurationOptions ? 'tabpanel' : undefined}
          aria-labelledby={hasDurationOptions ? `duration-${folder}-${activeDuration}` : undefined}
          tabIndex={hasDurationOptions ? 0 : undefined}
        >
          <div className="course-pathway-panel-heading">
            <div>
              <span className="eyebrow">{corporate ? 'Starting-point roadmap' : 'Illustrative course outline'}</span>
              <h3 id={`roadmap-${folder}-heading`}>{courseTitle}</h3>
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
              <li className="course-roadmap-card" key={`${index}-${module.number}-${module.title}`}>
                <div className="course-roadmap-heading">
                  <span className="course-roadmap-number">{String(module.number).padStart(2, '0')}</span>
                  <h4>{module.title}</h4>
                </div>
                {module.topics.length > 0 && (
                  <ul className="course-topic-chips" aria-label="Topics covered">
                    {module.topics.slice(0, 4).map((topic, index) => <li key={`${index}-${topic}`}>{topic}</li>)}
                    {module.topics.length > 4 && <li key={`more-${module.number}`}>+{module.topics.length - 4} more</li>}
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
                {syllabus.buildItems.map((project, index) => <li key={`${index}-${project}`}>{project}</li>)}
              </ul>
            </div>
            <div className="course-pathway-actions">
              <Link className="course-pathway-enquire" to={enquiryHref}>
                {corporate ? 'Discuss this pathway' : 'Ask about this course'} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
