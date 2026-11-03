import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo.jsx'
import Icon from './Icon.jsx'

export const LINKS = [
  ['/how-it-works', 'How it works'],
  ['/application', 'Application'],
  ['/challenges', 'Challenges'],
  ['/vault', 'The Vault'],
  ['/parents', 'Parents'],
  ['/partners', 'Partners'],
  ['/faq', 'FAQ'],
]

export default function Nav({ light, onToggle }) {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => setOpen(false), [pathname])
  return (
    <header className={`nav ${solid || open ? 'solid' : ''}`}>
      <div className="wrap nav-in">
        <Link to="/" aria-label="KEYS home"><Logo height={18} color={light ? '#16140f' : '#fff'} small /></Link>
        <nav className="nav-links">{LINKS.map(([to, l]) => <NavLink key={to} to={to}>{l}</NavLink>)}</nav>
        <div className="nav-cta">
          <Link className="btn btn-line btn-sm" to="/contact">Contact us</Link>
          <Link className="btn btn-red btn-sm" to="/apply">Apply now</Link>
          <button className="theme-btn" onClick={onToggle} aria-label={light ? 'Switch to dark theme' : 'Switch to light theme'} title={light ? 'Dark theme' : 'Light theme'}>
            <Icon name={light ? 'moon' : 'sun'} size={22} weight="bold" />
          </button>
        </div>
        <button className="theme-btn nav-theme-m" onClick={onToggle} aria-label="Switch theme"><Icon name={light ? 'moon' : 'sun'} size={18} weight="bold" /></button>
        <button className="nav-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}</svg>
        </button>
      </div>
      <div className={`nav-mobile ${open ? 'open' : ''}`}>
        {LINKS.map(([to, l]) => <Link key={to} to={to}>{l}</Link>)}
        <Link to="/contact">Contact us</Link>
        <Link className="btn btn-red" to="/apply">Apply now</Link>
      </div>
    </header>
  )
}
