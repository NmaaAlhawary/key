import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { PROBLEMS, GOOD_PROBLEM } from '../content.js'

export default function Challenges() {
  return (
    <>
      <section className="sec center" style={{ paddingTop: 150 }}>
        <div className="pattern-corner" />
        <div className="wrap">
          <h1 className="h2 h2-bar">The KEYS Challenges</h1>
          <p className="lead">For eight weeks, four teams of five each work on a real problem set by their Lock Partner. The four companies are announced with the teams. These are the kind of problems a team could crack.</p>
          <div className="cgrid" style={{ textAlign: 'left' }}>
            {PROBLEMS.slice(0, 4).map((p, i) => (
              <div className="ccard" key={p.sector}>
                <span className="loc"><Icon name="pin" size={14} />Team {i + 1} · {p.sector}</span>
                <h3>{p.problem}.</h3>
                <p>Build: {p.build.charAt(0).toLowerCase() + p.build.slice(1)}.</p>
                <div className="who">Lock Partner: to be announced</div>
              </div>
            ))}
          </div>
          <h3 className="subhead">Backup problems</h3>
          <div className="cgrid" style={{ textAlign: 'left', marginTop: 18 }}>
            {PROBLEMS.slice(4).map(p => (
              <div className="ccard small" key={p.sector}><span className="loc"><Icon name="pin" size={14} />{p.sector}</span><h3 style={{ fontSize: 17 }}>{p.problem}</h3><p>{p.build}</p></div>
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
