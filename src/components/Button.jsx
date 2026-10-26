import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function Button({ children, to, href, variant = 'primary', className = '', type = 'button', icon = false, ...props }) {
  const classes = `button button-${variant} ${className}`.trim()
  const content = <>{children}{icon && <ArrowRight size={16} aria-hidden="true" />}</>
  if (to) return <Link className={classes} to={to} {...props}>{content}</Link>
  if (href) return <a className={classes} href={href} {...props}>{content}</a>
  return <button className={classes} type={type} {...props}>{content}</button>
}
