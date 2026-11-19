const palettes = {
  ai: ['#10295f', '#3156a8', '#57dcff', '#ffd166'],
  analytics: ['#102d50', '#167b9c', '#43d9c2', '#ffc857'],
  browser: ['#15345b', '#2678ad', '#64d8ff', '#ffc857'],
  code: ['#14264e', '#4b4acb', '#71e2ce', '#ffd166'],
  database: ['#13385b', '#2865a2', '#59d6cb', '#ffbd69'],
  document: ['#17345c', '#476cb2', '#ffb454', '#7ce0cd'],
  keyboard: ['#172d55', '#4c4a91', '#69d9ce', '#ffbf69'],
  marketing: ['#45264e', '#b94f59', '#ffba69', '#7ee0c3'],
  spreadsheet: ['#123b57', '#187e83', '#5be0b6', '#ffd166'],
  team: ['#183653', '#386a9f', '#73d9ce', '#ffc66d'],
  workflow: ['#172d5a', '#4c48a8', '#59ded3', '#ffbf69'],
}

const escapeXml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;')

function getIllustration(type, variant) {
  const shift = (variant % 3) * 18

  if (type === 'keyboard') {
    const rows = [10, 11, 10, 8]
    return `<g transform="translate(255 145)">
      <rect x="0" y="0" width="690" height="250" rx="26" fill="#ffffff" fill-opacity=".12" stroke="#ffffff" stroke-opacity=".3" stroke-width="3"/>
      ${rows.map((count, row) => Array.from({ length: count }, (_, key) => {
        const keyWidth = row === 3 && key === count - 1 ? 82 : 46
        const x = 25 + key * 61 + (row === 1 ? 14 : row === 2 ? 28 : row === 3 ? 62 : 0)
        const y = 25 + row * 53
        return `<rect x="${x}" y="${y}" width="${keyWidth}" height="37" rx="8" fill="${(key + row + variant) % 5 === 0 ? 'var(--accent)' : '#ffffff'}" fill-opacity="${(key + row + variant) % 5 === 0 ? '.95' : '.84'}"/>`
      }).join('')).join('')}
      <rect x="250" y="224" width="190" height="13" rx="6" fill="#ffffff" fill-opacity=".5"/>
    </g>`
  }

  if (type === 'analytics' || type === 'spreadsheet') {
    const bars = Array.from({ length: 7 }, (_, index) => {
      const height = 72 + ((index * 37 + variant * 23) % 120)
      return `<rect x="${340 + index * 64}" y="${370 - height}" width="37" height="${height}" rx="7" fill="${index % 2 ? 'var(--accent)' : 'var(--highlight)'}"/>`
    }).join('')
    const table = Array.from({ length: 4 }, (_, row) => Array.from({ length: 5 }, (_, column) =>
      `<rect x="${300 + column * 120}" y="${185 + row * 42}" width="103" height="29" rx="5" fill="#ffffff" fill-opacity="${row === 0 ? '.34' : '.13'}"/>`,
    ).join('')).join('')
    return `<g>
      <rect x="265" y="125" width="670" height="320" rx="28" fill="#ffffff" fill-opacity=".1" stroke="#ffffff" stroke-opacity=".3" stroke-width="3"/>
      <circle cx="305" cy="158" r="7" fill="var(--accent)"/><circle cx="331" cy="158" r="7" fill="var(--highlight)"/><circle cx="357" cy="158" r="7" fill="#ffffff" fill-opacity=".7"/>
      ${type === 'spreadsheet' ? table : `<path d="M330 365h510M330 215v150" stroke="#ffffff" stroke-opacity=".35" stroke-width="3"/>${bars}<path d="M355 290l105-38 105 27 105-75 105 22" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`}
      ${type === 'spreadsheet' ? `<rect x="350" y="390" width="500" height="18" rx="9" fill="var(--highlight)" fill-opacity=".8"/>` : ''}
    </g>`
  }

  if (type === 'workflow') {
    const vertical = variant % 2 === 1
    const points = vertical
      ? [[600, 145], [430, 250], [770, 250], [600, 365]]
      : [[350, 260], [510, 175], [690, 345], [850, 260]]
    const connectors = points.slice(1).map(([x, y], i) => {
      const [fromX, fromY] = points[i]
      return `<path d="M${fromX} ${fromY} Q${(fromX + x) / 2 + (i % 2 ? 40 : -40)} ${(fromY + y) / 2} ${x} ${y}" fill="none" stroke="#ffffff" stroke-opacity=".62" stroke-width="8" stroke-linecap="round"/>`
    }).join('')
    return `<g>
      ${connectors}
      ${points.map(([x, y], i) => `<g><circle cx="${x}" cy="${y}" r="53" fill="${i % 2 ? 'var(--accent)' : 'var(--highlight)'}"/><circle cx="${x}" cy="${y}" r="24" fill="#102950"/><path d="M${x - 11} ${y}h22M${x} ${y - 11}v22" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/></g>`).join('')}
      <rect x="${535 + shift}" y="245" width="130" height="54" rx="16" fill="#ffffff" fill-opacity=".18"/>
    </g>`
  }

  if (type === 'marketing') {
    return `<g>
      <circle cx="600" cy="275" r="150" fill="#ffffff" fill-opacity=".08" stroke="#ffffff" stroke-opacity=".4" stroke-width="4"/>
      <circle cx="600" cy="275" r="103" fill="none" stroke="var(--highlight)" stroke-width="17"/>
      <circle cx="600" cy="275" r="55" fill="var(--accent)"/>
      <path d="M365 265l120-60v140l-120-55z" fill="#ffffff" fill-opacity=".88"/>
      <rect x="330" y="260" width="50" height="84" rx="14" fill="var(--highlight)"/>
      <path d="M470 295l36 100h-40l-42-92" fill="var(--accent)"/>
      <path d="M730 210q70 65 0 130M765 175q110 100 0 200" fill="none" stroke="#ffffff" stroke-opacity=".7" stroke-width="9" stroke-linecap="round"/>
    </g>`
  }

  if (type === 'team') {
    return `<g>
      <path d="M285 405q16-126 115-126t115 126M485 405q16-161 115-161t115 161M685 405q16-126 115-126t115 126" fill="#ffffff" fill-opacity=".16" stroke="#ffffff" stroke-opacity=".7" stroke-width="5"/>
      <circle cx="400" cy="220" r="59" fill="var(--highlight)"/>
      <circle cx="600" cy="185" r="67" fill="var(--accent)"/>
      <circle cx="800" cy="220" r="59" fill="var(--highlight)"/>
      <path d="M495 115h210q24 0 24 24v45q0 24-24 24h-70l-35 33v-33h-105q-24 0-24-24v-45q0-24 24-24z" fill="#ffffff" fill-opacity=".9"/>
      <circle cx="555" cy="161" r="8" fill="var(--primary)"/><circle cx="600" cy="161" r="8" fill="var(--primary)"/><circle cx="645" cy="161" r="8" fill="var(--primary)"/>
    </g>`
  }

  if (type === 'document') {
    return `<g>
      <path d="M420 105h245l130 130v245H420q-24 0-24-24V129q0-24 24-24z" fill="#ffffff" fill-opacity=".92"/>
      <path d="M665 105v106q0 24 24 24h106" fill="none" stroke="var(--primary)" stroke-opacity=".25" stroke-width="8"/>
      <rect x="455" y="275" width="230" height="19" rx="9" fill="var(--accent)"/>
      <rect x="455" y="320" width="295" height="12" rx="6" fill="var(--primary)" fill-opacity=".3"/>
      <rect x="455" y="351" width="260" height="12" rx="6" fill="var(--primary)" fill-opacity=".22"/>
      <rect x="455" y="382" width="285" height="12" rx="6" fill="var(--primary)" fill-opacity=".22"/>
      <rect x="455" y="425" width="88" height="34" rx="10" fill="var(--highlight)"/>
    </g>`
  }

  if (type === 'database') {
    return `<g>
      <ellipse cx="600" cy="155" rx="180" ry="55" fill="var(--accent)"/>
      <path d="M420 155v235c0 31 81 56 180 56s180-25 180-56V155" fill="#ffffff" fill-opacity=".18" stroke="#ffffff" stroke-opacity=".75" stroke-width="5"/>
      <path d="M420 235c0 31 81 56 180 56s180-25 180-56M420 315c0 31 81 56 180 56s180-25 180-56" fill="none" stroke="#ffffff" stroke-opacity=".75" stroke-width="5"/>
      <ellipse cx="600" cy="155" rx="180" ry="55" fill="none" stroke="#ffffff" stroke-opacity=".75" stroke-width="5"/>
      <circle cx="742" cy="200" r="12" fill="var(--highlight)"/>
    </g>`
  }

  if (type === 'browser') {
    return `<g>
      <rect x="260" y="125" width="680" height="330" rx="26" fill="#ffffff" fill-opacity=".94"/>
      <path d="M260 151q0-26 26-26h628q26 0 26 26v43H260z" fill="var(--accent)"/>
      <circle cx="300" cy="160" r="8" fill="#fff"/><circle cx="331" cy="160" r="8" fill="#fff" fill-opacity=".72"/><circle cx="362" cy="160" r="8" fill="#fff" fill-opacity=".5"/>
      <rect x="305" y="220" width="245" height="190" rx="16" fill="var(--primary)" fill-opacity=".12"/>
      <path d="M335 370l60-65 47 39 74-90" fill="none" stroke="var(--accent)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="585" y="230" width="290" height="19" rx="9" fill="var(--primary)" fill-opacity=".65"/>
      <rect x="585" y="275" width="250" height="13" rx="6" fill="var(--primary)" fill-opacity=".24"/>
      <rect x="585" y="305" width="270" height="13" rx="6" fill="var(--primary)" fill-opacity=".24"/>
      <rect x="585" y="355" width="135" height="42" rx="13" fill="var(--highlight)"/>
    </g>`
  }

  if (type === 'ai') {
    return `<g>
      <path d="M600 120v70M600 410v70M395 300h70M735 300h70M455 155l50 50M695 395l50 50M745 155l-50 50M505 395l-50 50" stroke="#ffffff" stroke-opacity=".65" stroke-width="7" stroke-linecap="round"/>
      <circle cx="600" cy="300" r="145" fill="#ffffff" fill-opacity=".1" stroke="#ffffff" stroke-opacity=".55" stroke-width="5"/>
      <rect x="490" y="190" width="220" height="220" rx="35" fill="var(--accent)"/>
      <rect x="515" y="215" width="170" height="170" rx="24" fill="var(--primary)" fill-opacity=".78"/>
      <text x="600" y="316" text-anchor="middle" fill="#ffffff" font-family="Arial,sans-serif" font-size="68" font-weight="800">AI</text>
      ${Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const x = 600 + Math.cos(angle) * 205
        const y = 300 + Math.sin(angle) * 205
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="${i % 2 ? 'var(--highlight)' : '#ffffff'}"/>`
      }).join('')}
    </g>`
  }

  return `<g>
    <rect x="315" y="145" width="570" height="300" rx="32" fill="#ffffff" fill-opacity=".14" stroke="#ffffff" stroke-opacity=".42" stroke-width="4"/>
    <circle cx="${600 + shift}" cy="285" r="104" fill="var(--accent)"/>
    <circle cx="${600 + shift}" cy="285" r="58" fill="var(--primary)"/>
    <path d="M${600 + shift - 28} 285h56M${600 + shift} 257v56" stroke="#ffffff" stroke-width="12" stroke-linecap="round"/>
  </g>`
}

export function createCourseIllustration(title, type = 'code', variant = 0) {
  const [primary, secondary, highlight, accent] = palettes[type] || palettes.code
  const safeTitle = escapeXml(title)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600">
    <defs>
      <linearGradient id="background" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${primary}"/><stop offset="1" stop-color="${secondary}"/></linearGradient>
      <pattern id="grid" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M34 0H0V34" fill="none" stroke="#ffffff" stroke-opacity=".08" stroke-width="1"/></pattern>
      <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset=".58" stop-color="#081b3c" stop-opacity="0"/><stop offset="1" stop-color="#081b3c" stop-opacity=".85"/></linearGradient>
    </defs>
    <rect width="1200" height="600" fill="url(#background)"/>
    <rect width="1200" height="600" fill="url(#grid)"/>
    <circle cx="${1000 - (variant % 4) * 80}" cy="80" r="210" fill="${accent}" fill-opacity=".14"/>
    <circle cx="170" cy="480" r="180" fill="${highlight}" fill-opacity=".1"/>
    <g style="--primary:${primary};--accent:${accent};--highlight:${highlight}">${getIllustration(type, variant)}</g>
    <rect x="0" y="430" width="1200" height="170" fill="url(#shade)"/>
    <text x="64" y="488" fill="${highlight}" font-family="Arial,sans-serif" font-size="17" font-weight="700" letter-spacing="4">${type.toUpperCase()}</text>
    <text x="64" y="548" fill="#ffffff" font-family="Arial,sans-serif" font-size="34" font-weight="800" textLength="1070" lengthAdjust="spacingAndGlyphs">${safeTitle}</text>
    <text x="1135" y="550" text-anchor="end" fill="#ffffff" fill-opacity=".65" font-family="Arial,sans-serif" font-size="16" font-weight="700">${String(variant + 1).padStart(2, '0')}</text>
  </svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
