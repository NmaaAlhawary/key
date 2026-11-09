import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { asset } from '../asset.js'
import { PROBLEMS, GOOD_PROBLEM, KEY_PROBLEMS, KEY_RULES } from '../content.js'
import { TRACKS } from '../shared/rules.js'

export default function Challenges() {
  return (
    <>
      <section className="sec center" style={{ paddingTop: 150 }}>
        <div className="pattern-corner" />
        <div className="wrap">
          <h1 className="h2 h2-bar">The KEYS Challenges</h1>
          <p className="lead">Every KEYS student starts with the Key Challenge: one open problem, five ways to answer it. Pick one of the two problems, then the track that fits you best, and answer it in the application form.</p>
          <div className="chgrid two">
            {KEY_PROBLEMS.map(p => (
              <Link className="chcard big" to={`/challenges/${p.slug}`} key={p.slug}>
                <div className="chcard-img"><img src={asset(p.img)} alt="" loading="lazy" /><span className="chcard-team">Problem {p.letter}</span></div>
                <div className="chcard-body">
                  <span className="chcard-sec"><Icon name="key" size={16} />The Key Challenge</span>
                  <h3>{p.problem}</h3>
                  <p>{p.q}</p>
                  <div className="chcard-foot"><span>{TRACKS.map(t => t.name).join(' · ')}</span><b>Open →</b></div>
                </div>
              </Link>
            ))}
          </div>
          <div className="krules">{KEY_RULES.map(([b, t], n) => <div key={b}><i>{n + 1}</i><span><b>{b}</b>{t}</span></div>)}</div>
          <p className="krules-note">Problems are open on purpose. There is no single right answer, so no two answers should look the same.</p>

          <h2 className="h2 h2-bar" style={{ marginTop: 96 }}>After you are picked</h2>
          <p className="lead">For eight weeks, four teams of five each work on a real problem set by their Lock Partner. The four companies are announced with the teams. These are the kind of problems a team could crack.</p>
          <div className="chgrid">
            {PROBLEMS.slice(0, 4).map((p, i) => (
              <Link className="chcard" to={`/challenges/${p.slug}`} key={p.slug}>
                <div className="chcard-img">{p.img ? <img src={asset(p.img)} alt="" loading="lazy" /> : <span className="chcard-art" />}<span className="chcard-team">Team {i + 1}</span></div>
                <div className="chcard-body">
                  <span className="chcard-sec"><Icon name={p.ic} size={16} />{p.sector}</span>
                  <h3>{p.problem}.</h3>
                  <p>Build: {p.build.charAt(0).toLowerCase() + p.build.slice(1)}.</p>
                  <div className="chcard-foot"><span>Lock Partner: to be announced</span><b>Open →</b></div>
                </div>
              </Link>
            ))}
          </div>
          <h3 className="subhead">Backup problems</h3>
          <div className="chgrid small">
            {PROBLEMS.slice(4).map(p => (
              <Link className="chcard" to={`/challenges/${p.slug}`} key={p.slug}>
                <div className="chcard-img">{p.img ? <img src={asset(p.img)} alt="" loading="lazy" /> : <span className="chcard-art" />}</div>
                <div className="chcard-body">
                  <span className="chcard-sec"><Icon name={p.ic} size={16} />{p.sector}</span>
                  <h3>{p.problem}</h3>
                  <p>{p.build}.</p>
                  <div className="chcard-foot"><span>Backup</span><b>Open →</b></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="sec glow-sec center">
        <div className="wrap">
          <div className="ctabox" style={{ maxWidth: 760 }}>
            <h2>What makes a good KEYS problem?</h2>
            <div className="gcards" style={{ marginTop: 18 }}>
              {GOOD_PROBLEM.map((g, i) => <div className="gcard" key={g}><h3><span className="chip-ic">{i + 1}</span></h3><p>{g}</p></div>)}
            </div>
            <Link to="/partners" className="btn btn-red arrow" style={{ marginTop: 24 }}>Bring your problem</Link>
          </div>
        </div>
      </section>
    </>
  )
}
