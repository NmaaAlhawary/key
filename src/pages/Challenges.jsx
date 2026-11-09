import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { asset } from '../asset.js'
import { PROBLEMS, KEY_PROBLEMS, KEY_RULES } from '../content.js'
import { TRACKS } from '../shared/rules.js'

export default function Challenges() {
  return (
    <>
      <section className="sec center" style={{ paddingTop: 150 }}>
        <div className="pattern-corner" />
        <div className="wrap">
          <h1 className="h2 h2-bar">The KEYS Challenges</h1>
          <p className="lead">Two challenges, both open on purpose. Start with the Key Challenge in your application, then crack a real company's problem with your team.</p>
          <div className="chgrid two">
            {[KEY_PROBLEMS.find(p => p.slug === 'problem-a')].map(p => (
              <Link className="chcard big" to={`/challenges/${p.slug}`} key={p.slug}>
                <div className="chcard-img"><img src={asset(p.img)} alt="" loading="lazy" /><span className="chcard-team">In the application</span></div>
                <div className="chcard-body">
                  <span className="chcard-sec"><Icon name="key" size={16} />The Key Challenge</span>
                  <h3>{p.problem}</h3>
                  <p>{p.q}</p>
                  <div className="chcard-foot"><span>{TRACKS.map(t => t.name).join(' · ')}</span><b>Open →</b></div>
                </div>
              </Link>
            ))}
            {[PROBLEMS.find(p => p.slug === 'banking')].map(p => (
              <Link className="chcard big" to={`/challenges/${p.slug}`} key={p.slug}>
                <div className="chcard-img">{p.img ? <img src={asset(p.img)} alt="" loading="lazy" /> : <span className="chcard-art" />}<span className="chcard-team">After you are picked</span></div>
                <div className="chcard-body">
                  <span className="chcard-sec"><Icon name={p.ic} size={16} />{p.sector}</span>
                  <h3>{p.problem}.</h3>
                  <p>{p.q || `Build: ${p.build.charAt(0).toLowerCase() + p.build.slice(1)}.`}</p>
                  <div className="chcard-foot"><span>Lock Partner: to be announced</span><b>Open →</b></div>
                </div>
              </Link>
            ))}
          </div>
          <div className="krules">{KEY_RULES.map(([b, t], n) => <div key={b}><i>{n + 1}</i><span><b>{b}</b>{t}</span></div>)}</div>
          <p className="krules-note">There is no single right answer, so no two answers should look the same.</p>
        </div>
      </section>
    </>
  )
}
