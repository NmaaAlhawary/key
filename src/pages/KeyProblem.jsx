import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { asset } from '../asset.js'
import { useSettings } from '../useSettings.js'
import { TRACKS } from '../shared/rules.js'
import { KEY_PROBLEMS, KEY_RULES, KEY_CHECKS, KEY_FORMATS } from '../content.js'

const TRACK_IC = { research: 'search', design: 'pencil', tech: 'cpu', money: 'coin', story: 'mic' }
const Card = ({ ic, title, children, className = '' }) => (
  <article className={`gcard chal-card ${className}`}><h3><span className="chip-ic"><Icon name={ic} size={34} /></span>{title}</h3>{children}</article>
)

// One Key Challenge problem (A or B), from the Pilot Playbook: the problem, five tracks, two rules.
export default function KeyProblem({ p }) {
  const s = useSettings()
  const other = KEY_PROBLEMS.find(x => x.slug !== p.slug)
  return (
    <>
      <section className="chal-hero">
        <img src={asset(p.img)} alt="" />
        <div className="wrap chal-hero-in">
          <Link to="/challenges" className="chal-back">← All challenges</Link>
          <span className="chal-pill"><Icon name="key" size={16} />The Key Challenge · Problem {p.letter}</span>
          <h1 className="chal-title">KEYS Challenge 2027<br /><em>Problem {p.letter}</em></h1>
          <div className="chal-facts"><span><b>1</b> problem</span><span><b>5</b> tracks</span><span><b>1</b> minute</span><span>Applications {s.call_dates}</span></div>
        </div>
      </section>
      <section className="sec chal">
        <div className="wrap">
          <div className="chal-stack">
            <article className="chal-q-card">
              <div className="chal-k">The challenge</div>
              <h2 className="chal-q">{p.problem}</h2>
              <p className="chal-q-sub">{p.q}</p>
            </article>

            <div className="gcards chal-cols">
              <Card ic="search" title="Why it matters"><p>{p.why}</p></Card>
              <Card ic="people" title="Who feels it"><ul>{p.who.map(w => <li key={w}>{w}</li>)}</ul></Card>
            </div>

            <Card ic="key" title="Pick your track" className="chal-wide">
              <p style={{ marginBottom: 18 }}>Pick the one track that fits you best. The track you pick is our first clue to your natural role in a team.</p>
              <div className="tgrid">
                {TRACKS.map(t => (
                  <div className="tcard" key={t.key}>
                    <span className="tcard-ic"><Icon name={TRACK_IC[t.key]} size={30} /></span>
                    <b>{t.name}</b><small>{t.tag}</small>
                    <p>{t.ask}</p>
                    <div className="tcard-five"><span>A 5 looks like</span>{t.five}.</div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="gcards chal-cols">
              <Card ic="check" title="Two rules for every track">
                <ul className="chal-steps">{KEY_RULES.map(([b, t]) => <li key={b}><b>{b}</b> · {t}</li>)}</ul>
              </Card>
              <Card ic="camera" title="How to send it">
                <p>Answer in the form, in any one of these:</p>
                <div className="chal-tags" style={{ marginTop: 12 }}>{KEY_FORMATS.map(k => <span key={k}>{k}</span>)}</div>
              </Card>
            </div>

            <Card ic="shield" title="Every answer is also checked for" className="chal-wide">
              <div className="kchecks">{KEY_CHECKS.map(([b, t], n) => <div key={b}><i>{n + 1}</i><b>{b}</b><p>{t}</p></div>)}</div>
              <p className="chal-note" style={{ fontSize: 14.5 }}>At the Key Trial, you explain your answer in 1 minute. If you can't explain it, it isn't yours.</p>
            </Card>
          </div>

          <div className="chal-foot">
            <Link to="/apply" className="btn btn-red arrow">Answer it in the form</Link>
            <Link to={`/challenges/${other.slug}`} className="chal-next">Or try Problem {other.letter} →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
