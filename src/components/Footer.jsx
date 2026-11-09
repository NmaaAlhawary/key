import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-top">
        <Link to="/" aria-label="KEYS home"><Logo height={16} color="#fff" small /></Link>
        <nav className="footer-links">
          <Link to="/application">Application</Link>
          <Link to="/status">Check my application</Link>
          <Link to="/partners">Partners</Link>
          <Link to="/parents">Safeguarding</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
      <div className="footer-bottom"><div className="wrap"><span>© {new Date().getFullYear()} KEYS · Amman, Jordan</span></div></div>
    </footer>
  )
}
