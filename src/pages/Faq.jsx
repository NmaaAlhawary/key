import { Link } from 'react-router-dom'
import { FAQ } from '../content.js'
import { useSettings } from '../useSettings.js'

export default function Faq() {
  const s = useSettings()
  return (
    <section className="sec center" style={{ paddingTop: 150, minHeight: '80vh' }}>
      <div className="pattern-corner" />
      <div className="wrap">
        <h1 className="h2 h2-bar">Frequently Asked Questions</h1>
        <div className="faq" style={{ textAlign: 'left' }}>
          {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a.replace('400 JOD', s.seat_price)}</p></details>)}
        </div>
        <p className="lead" style={{ margin: '30px auto 0' }}>Still have a question? <Link to="/contact" className="hi-link">Contact us</Link>.</p>
      </div>
    </section>
  )
}
