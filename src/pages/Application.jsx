import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import Icon from '../components/Icon.jsx'
import { CHALLENGES } from '../shared/rules.js'
import { PICK } from '../content.js'
import { useSettings } from '../useSettings.js'

export default function Application() {
  const s = useSettings()
  return (
    <>
      <PageHero img="/img/amman.jpg" credit="Roman Theatre, Amman · Photo: Bernard Gagnon, CC BY-SA 4.0" title={<>Join the KEYS<br />season</>} text="Ready to crack a real problem from a real company? Here is everything you need to know before applying."
        side={<Link to="/apply" className="date-pill" style={{ textDecoration: 'none' }}>{s.apps_open ? 'Apply now' : 'Get notified'}</Link>} />

      <section className="sec glow-sec center">
        <div className="wrap">
          <h2 className="h2" style={{ fontSize: 'clamp(26px,3vw,34px)' }}>Application requirements</h2>
          <div className="gcards">
            <div className="gcard">
              <h3><span className="chip-ic"><Icon name="user" size={34} /></span>Who can apply?</h3>
              <p>KEYS season one is open to students aged 13 to 16 on 1 April 2027, from any school in Amman. No experience and no grades needed.</p>
              <div className="inner">If you are curious, like building things, and are ready to work with new people, this is for you!</div>
            </div>
            <div className="gcard">
              <h3><span className="chip-ic"><Icon name="coin" size={34} /></span>What does it cost?</h3>
              <p>A season seat is <b style={{ color: '#fff' }}>{s.seat_price}</b>. Early bird and siblings get 10% off, and scholarship seats are funded by partners for students who cannot pay. A seat includes:</p>
              <ul><li>16 sessions with trained facilitators, kits and materials</li><li>A supervised Door Visit to a real company</li><li>Six smart keys, a filmed pitch and a project page</li><li>Seats for your family at Vault night</li></ul>
            </div>
          </div>
        </div>
      </section>

      <section className="sec center">
        <div className="wrap">
          <h2 className="h2">The application</h2>
          <p className="lead">A 10-minute form, filled in with a parent. The basics, your interests, and two short pieces.</p>
          <div className="gcards">
            <div className="gcard">
              <h3><span className="chip-ic"><Icon name="mic" size={34} /></span>Piece 1 · Show us something</h3>
              <p>Something you fixed or built: a toy, a bike, a game, a recipe. Pick one way to show it.</p>
              <div className="opts">
                <div className="opt"><Icon name="camera" size={34} /><b>A photo</b><span>Upload from your phone</span></div>
                <div className="opt"><Icon name="pencil" size={34} /><b>A drawing</b><span>Snap it on paper</span></div>
                <div className="opt"><Icon name="wave" size={34} /><b>A voice note</b><span>1 minute, in the form</span></div>
              </div>
              <div className="tell">
                <div><Icon name="idea" size={22} />What went wrong?</div>
                <div><Icon name="tool" size={22} />What did you try to fix it?</div>
              </div>
            </div>
            <div className="gcard">
              <h3><span className="chip-ic"><Icon name="spark" size={34} /></span>Piece 2 · Tech mini-challenge</h3>
              <p>Pick one problem and tell us how tech could solve it. No coding needed.</p>
              {CHALLENGES.map((c, i) => <div className="ch" key={i}><b>{i + 1}</b><span>{c}</span></div>)}
            </div>
          </div>
          <p className="lead" style={{ marginTop: 22 }}>We look for who it helps, how it works in simple steps, and one way to test it. A good idea beats a perfect drawing.</p>
        </div>
      </section>

      <section className="sec glow-sec center">
        <div className="wrap">
          <h2 className="h2">What we look for</h2>
          <p className="lead">Two of our team score every application separately. We pick potential, not grades.</p>
          <div className="gcards three" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {PICK.map(p => <div className="gcard" key={p.title}><h3>{p.title}</h3><p>{p.text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap" style={{ display: 'grid', gap: 24 }}>
          <div className="ctabox" style={{ textAlign: 'left', maxWidth: 760 }}>
            <h2 style={{ fontSize: 20 }}>Online application</h2>
            <p>Applications are open from <b style={{ color: '#fff' }}>{s.call_dates}</b>. Fill in the form with a parent and be yourself: an honest answer beats a polished one.</p>
            <p>After the call closes, about 40 shortlisted students are invited to the Key Trial, a fun 90-minute group challenge. Then 20 are picked into four teams of five.</p>
            <p style={{ margin: 0 }}>Everyone hears back within 7 days of the Key Trial. The waiting list gets priority next season.</p>
          </div>
          <div className="ctabox">
            <h2>Ready to join?</h2>
            <p>Take the first step toward the Vault.</p>
            <small>{s.apps_open ? `Applications ${s.call_dates}` : `Applications open ${s.call_dates}`}</small>
            <Link to="/apply" className="btn btn-red arrow">{s.apps_open ? 'Start my application' : 'Get notified'}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
