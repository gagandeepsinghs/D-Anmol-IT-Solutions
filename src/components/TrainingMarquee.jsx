const highlights = [
  'Practical, industry-relevant training',
  'AI and machine learning',
  'Guided project practice',
  'Python and programming',
  'Learning for individuals and teams',
]

function HighlightItems() {
  return highlights.map((highlight) => (
    <span className="training-marquee-item" key={highlight}>
      <span className="training-marquee-dot" aria-hidden="true" />
      {highlight}
    </span>
  ))
}

export default function TrainingMarquee() {
  return (
    <div className="training-marquee" role="region" aria-label="Training highlights">
      <div className="training-marquee-track">
        <div className="training-marquee-group"><HighlightItems /></div>
        <div className="training-marquee-group" aria-hidden="true"><HighlightItems /></div>
      </div>
    </div>
  )
}
