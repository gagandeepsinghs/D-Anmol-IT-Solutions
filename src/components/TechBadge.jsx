const marks = {
  Python: 'Py',
  Django: 'dj',
  'HTML & CSS': '</>',
  Pandas: 'pd',
  NumPy: 'np',
  'Scikit-learn': 'sk',
  TensorFlow: 'tf',
  PyTorch: 'pt',
  LangChain: 'LC',
  'LLM APIs': 'API',
  'Prompt engineering': '✳',
  n8n: 'n8n',
  'APIs and tool calling': '{ }',
}

export default function TechBadge({ name, index = 0 }) {
  const mark = marks[name] || name.slice(0, 2)
  const brandClass = `tech-mark-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return (
    <span className="tech-badge" style={{ '--badge-index': index }}>
      <span className={`tech-badge-mark ${brandClass}`} aria-hidden="true">{mark}</span>
      <span className="tech-badge-name">{name}</span>
    </span>
  )
}
