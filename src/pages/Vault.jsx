import { Link } from 'react-router-dom'
import StitchKey from '../components/StitchKey.jsx'
import PageHero from '../components/PageHero.jsx'
import Icon from '../components/Icon.jsx'
import { VAULT_STEPS, VAULT_INSIDE, MOMENTS } from '../content.js'

export default function Vault() {
  return (
    <>
      <PageHero img="/img/petra.jpg" credit="Al-Khazneh, Petra · Photo: Brian Jeffery Beggerly, CC BY 2.0" title={<>The night<br />the vault opens</>} text="One public evening. Four pitches. Seven golden keys. A real vault on stage." side={<div className="date-pill">Late May 2027</div>} />
      <section className="sec">
        <div className="wrap split">
          <h2 className="h2">Inspired by<br />Al-Khazneh.</h2>
          <div>
            <p>Our Vault is named after Petra's Treasury, Al-Khazneh: the most famous locked door in Jordan. Vault night is the evening every team works toward. Families, schools, the four Lock Partners and media are in the room, and the night is filmed.</p>
            <p>Keyholders get a simple scorecard (problem, prototype, business model, pitch, teamwork) so their choice is informed and fair. The key is still theirs to give.</p>
          </div>
        </div>
      </section>
      {VAULT_STEPS.map((v, i) => (
        <section key={v.title} className={`row ${i % 2 === 0 ? 'redbg' : 'flip'}`} style={{ color: '#fff' }}>
          <div className="wrap row-in">
            <div className="row-media art"><span className="art-ring"><Icon name={['people', 'mic', 'key', 'vault'][i]} size={84} color="#fff" /></span></div>
            <div><div className="row-h"><span className="row-n">{i + 1}</span><h3>{v.title}</h3></div><p>{v.text}</p></div>
          </div>
        </section>
      ))}
      <section className="sec glow-sec center">
        <div className="wrap">
          <StitchKey teeth={6} size={340} className="key-center" />
          <h2 className="h2" style={{ marginTop: 28 }}>What is inside the vault</h2>
          <div className="gcards four">{VAULT_INSIDE.map((x, i) => <div className="gcard" key={x}><h3><span className="chip-ic"><Icon name={['door', 'coin', 'spark', 'key'][i]} size={34} /></span></h3><p className="hi" style={{ fontWeight: 600 }}>{x}</p></div>)}</div>
          <p className="lead">3 keys open the vault, so at most two of the four teams can open it. Every member of every team still takes home a golden key.</p>
        </div>
      </section>
      <section className="sec center">
        <div className="wrap">
          <h2 className="h2">Built to be remembered</h2>
          <div className="gcards three">{MOMENTS.map(m => <div className="gcard" key={m.title}><h3>{m.title}</h3><p>{m.text}</p></div>)}</div>
          <Link to="/apply" className="btn btn-red arrow" style={{ marginTop: 36 }}>Apply for season one</Link>
        </div>
      </section>
    </>
  )
}
