import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="sec center" style={{ minHeight: '80vh', paddingTop: 170 }}>
      <div className="wrap">
        <div className="label red">404</div>
        <h1 className="h2">This door is locked.</h1>
        <p>We could not find that page.</p>
        <Link to="/" className="btn btn-red" style={{ marginTop: 28 }}>Back to the start</Link>
      </div>
    </section>
  )
}
