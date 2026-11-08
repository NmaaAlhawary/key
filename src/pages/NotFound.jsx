import { Link } from 'react-router-dom'
import StitchKey from '../components/StitchKey.jsx'

export default function NotFound() {
  return (
    <section className="sec center" style={{ minHeight: '80vh', paddingTop: 170 }}>
      <div className="wrap">
        <StitchKey teeth={0} size={300} className="key-center" />
        <div className="label red" style={{ marginTop: 26 }}>404</div>
        <h1 className="h2">This door is locked.</h1>
        <p>We could not find that page. This key has no teeth yet.</p>
        <Link to="/" className="btn btn-red" style={{ marginTop: 28 }}>Back to the start</Link>
      </div>
    </section>
  )
}
