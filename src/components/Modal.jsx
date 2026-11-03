import { useEffect } from 'react'

// Dark pop-up: closes on Esc, on the X, or by clicking outside.
export default function Modal({ open, onClose, title, sub, children }) {
  useEffect(() => {
    if (!open) return
    const on = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', on)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', on); document.body.style.overflow = '' }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="pop-bg" onMouseDown={onClose}>
      <div className="pop" role="dialog" aria-modal="true" aria-label={title} onMouseDown={e => e.stopPropagation()}>
        <button className="pop-x" aria-label="Close" onClick={onClose}>×</button>
        <h2>{title}</h2>
        {sub && <p className="pop-sub">{sub}</p>}
        {children}
      </div>
    </div>
  )
}
