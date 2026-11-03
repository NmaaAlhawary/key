import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import Icon from '../components/Icon.jsx'
import { SAFE } from '../content.js'
import { useSettings } from '../useSettings.js'

export default function Parents() {
  const s = useSettings()
  return (
    <>
      <PageHero img="/img/hands.jpg" title={<>Parents' trust<br />comes first</>} text="Safe rooms we control, vetted adults, and one short, supervised Door Visit. No overnight stays." />
      <section className="sec">
        <div className="wrap split">
          <div className="free">
            <div className="label" style={{ color: '#ffd6da' }}>A season seat</div>
            <b>{s.seat_price}</b>
            <p>16 sessions, kits, six smart keys, a Door Visit, a filmed pitch and family seats at Vault night.</p>
            <p style={{ marginTop: 14 }}><b style={{ fontSize: 16, display: 'inline', margin: 0 }}>10% off</b> for early bird and siblings · <b style={{ fontSize: 16, display: 'inline', margin: 0 }}>Scholarship seats</b> funded by partners</p>
          </div>
          <div>
            <h2 className="h2" style={{ fontSize: 'clamp(26px,3vw,36px)', marginBottom: 16 }}>What parents do</h2>
            <p>Sign the consent form, commit to pickup and drop-off, and come to Vault night. That is it.</p>
            <p>What your child leaves with is not a certificate. It is a real project, a working prototype, a filmed pitch to company leaders, and a ring of keys they earned.</p>
          </div>
        </div>
      </section>
      <section className="sec glow-sec center">
        <div className="wrap">
          <h2 className="h2">Safeguarding</h2>
          <p className="lead">A written child-protection policy and a named safeguarding lead at every session.</p>
          <div className="sgrid" style={{ textAlign: 'left' }}>
            {SAFE.map(([t, d]) => <div className="gcard" key={t}><h3><span className="chip-ic"><Icon name="shield" size={34} /></span>{t}</h3><p>{d}</p></div>)}
            <div className="gcard"><h3><span className="chip-ic"><Icon name="shield" size={34} /></span>Health and data</h3><p>A first-aider on site, allergies collected in advance, and only the data we need, stored securely and deleted on request.</p></div>
            <div className="gcard"><h3><span className="chip-ic"><Icon name="shield" size={34} /></span>Ideas stay theirs</h3><p>Students are minors, so no one buys a share of their idea. Ownership is agreed in writing before the season.</p></div>
          </div>
          <div style={{ marginTop: 40, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/apply" className="btn btn-red arrow">Apply together</Link>
            <Link to="/faq" className="btn btn-line">Read the FAQ</Link>
          </div>
        </div>
      </section>
    </>
  )
}
