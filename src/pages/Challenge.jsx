import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import StitchKey from '../components/StitchKey.jsx'
import NotFound from './NotFound.jsx'
import { asset } from '../asset.js'
import KeyProblem from './KeyProblem.jsx'
import { PROBLEMS, KEYS, HANDOVER, DOOR_VISIT, KEY_PROBLEMS } from '../content.js'

const Card = ({ ic, title, children, className = '' }) => (
  <article className={`gcard chal-card ${className}`}>
    <h3><span className="chip-ic"><Icon name={ic} size={34} /></span>{title}</h3>
    {children}
  </article>
)

// One challenge on its own page: the question first, then two columns of detail
// (left: the problem, right: the team's side), the six keys and the start of the season.
export default function Challenge() {
  const { slug } = useParams()
  const kp = KEY_PROBLEMS.find(p => p.slug === slug)
  if (kp) return <KeyProblem p={kp} />
  const i = PROBLEMS.findIndex(p => p.slug === slug)
  if (i < 0) return <NotFound />
  const p = PROBLEMS[i], main = i < 4
  const next = PROBLEMS[(i + 1) % PROBLEMS.length]
  return (
    <>
    <section className={`chal-hero ${p.img ? '' : 'art'}`}>
      {p.img && <img src={asset(p.img)} alt="" />}
      <div className="wrap chal-hero-in">
        <Link to="/challenges" className="chal-back">← All challenges</Link>
        <span className="chal-pill"><Icon name={p.ic} size={16} />{main ? `Team ${i + 1}` : 'Backup problem'} · {p.sector}</span>
        <h1 className="chal-title">KEYS Challenge 2027<br /><em>{p.sector}</em></h1>
        <div className="chal-facts"><span><b>5</b> students</span><span><b>8</b> weeks</span><span><b>6</b> keys</span><span><b>1</b> Vault night</span></div>
      </div>
    </section>
    <section className="sec chal">
      <div className="wrap">

        <div className="chal-stack">
          <article className="chal-q-card">
            <div className="chal-k">The challenge</div>
            <h2 className="chal-q">{p.q}</h2>
          </article>

          <div className="gcards chal-cols">
            <Card ic="search" title="Why it matters"><p>{p.why}</p></Card>
            <Card ic="idea" title="What your team could build">
              <ul>{p.ideas.map(w => <li key={w}>{w}</li>)}</ul>
              <small className="chal-note">Just ideas. Your team picks its own answer.</small>
            </Card>
            <Card ic="people" title="Who it is for"><ul>{p.who.map(w => <li key={w}>{w}</li>)}</ul></Card>
            {p.skills
              ? <Card ic="cpu" title="Skills you will use"><div className="chal-tags">{p.skills.map(k => <span key={k}>{k}</span>)}</div></Card>
              : <Card ic="cpu" title="Skills you will use"><p>Sensors, a microcontroller and a simple app, picked by your team once you know the problem.</p></Card>}
          </div>

          <Card ic="hand" title="Lock Partner" className="chal-wide">
            <p>{main ? 'Announced with the teams in early April 2027. A mentor from the company reviews your prototype in Week 6, and its leader holds a golden key at the Vault.' : 'A backup problem, used if a partner\'s problem changes before the season.'}</p>
          </Card>

          <div className="gcards chal-cols">
            <Card ic="box" title="Week 0 · The handover">
              <ul className="chal-steps">{HANDOVER.map(([b, t]) => <li key={b}><b>{b}</b> · {t}</li>)}</ul>
            </Card>
            <Card ic="door" title="Week 1 · The Door Visit">
              <ul className="chal-steps">{DOOR_VISIT.map(([b, t]) => <li key={b}><b>{b}</b> · {t}</li>)}</ul>
            </Card>
          </div>

          <Card ic="key" title="Six keys to crack it" className="chal-keys-card">
            <ol className="chal-keys">
              {KEYS.map((k, n) => (
                <li key={k.n}>
                  <StitchKey teeth={n + 1} size={88} animate={false} />
                  <div><b>{k.name}</b><small>{k.week}</small><p>{k.challenge}</p></div>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="chal-foot">
          <Link to="/apply" className="btn btn-red arrow">Apply now</Link>
          <Link to={`/challenges/${next.slug}`} className="chal-next">Next: {next.sector} →</Link>
        </div>
      </div>
    </section>
    </>
  )
}
