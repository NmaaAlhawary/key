import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import Icon from '../components/Icon.jsx'
import StitchKey from '../components/StitchKey.jsx'
import { HOW_ROWS, KEYS } from '../content.js'
import { ROLES } from '../shared/rules.js'
import { asset } from '../asset.js'
import { useSettings } from '../useSettings.js'

const KEY_ICONS = ['search', 'robot', 'cpu', 'coin', 'check', 'pitch']

export default function HowItWorks() {
  const s = useSettings()
  return (
    <>
      <PageHero img="/img/keys.jpg" title={<>How KEYS<br />works</>} />
      <section className="sec">
        <div className="wrap">
          <div className="split">
            <h2 className="h2">How does it work?</h2>
            <div>
              <p>KEYS is an eight-week season where teams of five students from different schools work on a real problem handed over by a real company.</p>
              <p>The journey has <em>seven stages</em>, each one ending with a clear result, so every team arrives at the Vault with a working prototype behind its pitch.</p>
            </div>
          </div>
          <div className="datecard">
            <div className="datecard-l"><h2>Join the<br />season</h2></div>
            <div className="datecard-r">
              {[['Applications', s.call_dates], ['Key Trial', '15 to 21 March 2027'], ['Teams announced', '22 to 28 March 2027'], ['Team day and handover', 'Early April 2027'], ['Six keys', 'April to May 2027'], ['Vault night', 'Late May 2027']].map(([t, d]) => <div key={t}><b>{t}</b><span>{d}</span></div>)}
            </div>
          </div>
        </div>
      </section>

      {HOW_ROWS.map((r, i) => (
        <section key={r.title} className={`row ${i % 2 === 0 ? 'redbg' : 'flip'}`} style={{ color: '#fff' }}>
          <div className="wrap row-in">
            <div className={`row-media ${r.img ? '' : 'art'}`}>
              {r.img ? <img src={asset(r.img)} alt="" loading="lazy" />
                : r.art === 'keys' ? (
                  <div className="art-keys">{[1, 2, 3, 4, 5, 6].map(n => <div key={n}><span>0{n}</span><StitchKey teeth={n} size={190} color="#fff" dim="rgba(255,255,255,.1)" /></div>)}</div>
                ) : r.art === 'roles' ? (
                  <div className="art-roles">{ROLES.map(x => <div key={x.key}><span className="art-av">{x.short}</span><b>{x.label}</b></div>)}</div>
                ) : <span className="art-ring"><Icon name={r.icon} size={84} color="#fff" /></span>}
            </div>
            <div>
              <div className="when">{r.when}</div>
              <div className="row-h"><span className="row-n">{i + 1}</span><h3>{r.title}</h3></div>
              {r.text.map(t => <p key={t}>{t}</p>)}
              {r.list && <ul>{r.list.map(l => <li key={l}>{l}</li>)}</ul>}
            </div>
          </div>
        </section>
      ))}

      <section className="sec">
        <div className="wrap">
          <h2 className="h2 center" style={{ display: 'block' }}>Six keys. One at a time.</h2>
          <p className="lead center" style={{ margin: '12px auto 0' }}>A key is earned by passing a challenge, never given for attending.</p>
          <div className="kgrid">
            {KEYS.map((k, i) => (
              <article className="kcard" key={k.n}>
                <span className="kcard-num" aria-hidden="true">{k.n}</span>
                <div className="kcard-top">
                  <span className="kcard-ic"><Icon name={KEY_ICONS[i]} size={38} /></span>
                  <span><span className="label red">{k.week}</span><br /><span className="label">Key {k.n} of 06</span></span>
                </div>
                <h3>{k.name}</h3>
                <p>{k.text}</p>
                <div className="challenge"><b>CHALLENGE</b>{k.challenge}</div>
                <div className="kcard-key"><StitchKey teeth={i + 1} /></div>
              </article>
            ))}
          </div>
          <div className="rhythm" aria-label="Every session, the same rhythm">
            {[['15', 'Warm-up', 15, 'spark'], ['30', 'Learn', 30, 'chat'], ['75', 'Build', 75, 'tool'], ['15', 'Break', 15, 'clock'], ['15', 'Share', 15, 'mic']].map(([m, l, f, ic]) => (
              <div key={l} style={{ flex: f }}><Icon name={ic} size={16} /><span><b>{m}′</b>{l}</span></div>
            ))}
          </div>
          <p className="label" style={{ marginTop: 10 }}>Every session, the same rhythm · minutes</p>
          <div className="center" style={{ marginTop: 48 }}><Link to="/application" className="btn btn-red arrow">How to apply</Link></div>
        </div>
      </section>
    </>
  )
}
