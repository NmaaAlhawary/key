import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import Icon from '../components/Icon.jsx'
import KeyBox from '../components/KeyBox.jsx'
import { CHALLENGES, TRACKS } from '../shared/rules.js'
import { PICK } from '../content.js'
import { useSettings } from '../useSettings.js'

export default function Application() {
  const s = useSettings()
  const m = s.call_dates.match(/^(\d+) to (\d+) (\w+)/)
  const days = m ? `${m[1]}–${m[2]}` : s.call_dates, month = m?.[3]
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
              <p>A season seat is <b className="hi">{s.seat_price}</b>. Early bird and siblings get 10% off, and scholarship seats are funded by partners for students who cannot pay. A seat includes:</p>
              <ul><li>16 sessions with trained facilitators, kits and materials</li><li>A supervised Door Visit to a real company</li><li>Six smart keys, a filmed pitch and a project page</li><li>Seats for your family at Vault night</li></ul>
            </div>
          </div>
        </div>
      </section>

      <section className="sec center">
        <div className="wrap">
          <h2 className="h2">The application</h2>
          <p className="lead">A 15-minute form, filled in with a parent. The basics, your interests, and two short pieces.</p>
          <div className="gcards">
            <div className="gcard">
              <h3><span className="chip-ic"><Icon name="camera" size={34} /></span>Piece 1 · Show us something</h3>
              <p>Something you fixed or built: a toy, a bike, a game, a recipe. Show it any way you like.</p>
              <div className="opts">
                <div className="opt"><Icon name="camera" size={34} /><b>Photos</b><span>Up to 5, from your phone</span></div>
                <div className="opt"><Icon name="video" size={34} /><b>A video</b><span>A short clip, 1 to 2 minutes</span></div>
                <div className="opt"><Icon name="link" size={34} /><b>A link or file</b><span>YouTube, Drive, a game, a PDF</span></div>
              </div>
              <div className="tell">
                <div><Icon name="idea" size={22} />What went wrong?</div>
                <div><Icon name="tool" size={22} />What did you try to fix it?</div>
              </div>
            </div>
            <div className="gcard">
              <h3><span className="chip-ic"><Icon name="spark" size={34} /></span>Piece 2 · The Key Challenge</h3>
              <p>One open problem, five ways to answer it. Pick a problem, then the track that fits you best.</p>
              {CHALLENGES.map((c, i) => <Link className="ch" to={`/challenges/problem-${'ab'[i]}`} key={i}><b>{'AB'[i]}</b><span>{c}</span></Link>)}
              <p className="ch-tracks">{TRACKS.map(t => t.name).join(' · ')}</p>
            </div>
          </div>
          <p className="lead" style={{ marginTop: 22 }}>Beat the obvious idea, and show your thinking. A clear idea beats a perfect video. <Link to="/challenges" className="hi-link">See the Key Challenge</Link>.</p>
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
        <div className="wrap">
          <div className="label red">After you press send</div>
          <h2 className="h2" style={{ margin: '8px 0 10px' }}>From form to team</h2>
          <p className="lead" style={{ margin: 0 }}>Fill in the form with a parent and be yourself: an honest answer beats a polished one.</p>
          <ol className="apath">
            <li><span className="apath-n">{days}</span><b>Apply online</b><small>{month ? `${month}: a` : 'A'} 15-minute form, together with a parent</small></li>
            <li><span className="apath-n">40</span><b>Invited to the Key Trial</b><small>A fun 90-minute group challenge</small></li>
            <li><span className="apath-n">20</span><b>Picked</b><small>Four teams of five, from different schools</small></li>
            <li><span className="apath-n">7 days</span><b>Everyone hears back</b><small>The waiting list gets priority next season</small></li>
          </ol>

          <div className="ctabox ctasplit" style={{ marginTop: 56 }}>
            <div className="ctasplit-text">
              <div className="label red">{s.apps_open ? `Applications ${s.call_dates}` : `Applications open ${s.call_dates}`}</div>
              <h2>Ready to join?</h2>
              <p>Take the first step toward the Vault. Applying is free, no grades asked.</p>
              <ul className="ctasplit-steps">
                <li><b>1</b>Tell us about you and what you like</li>
                <li><b>2</b>Show us something you fixed or built</li>
                <li><b>3</b>Answer the Key Challenge in your own way</li>
              </ul>
              <Link to="/apply" className="btn btn-red arrow">{s.apps_open ? 'Start my application' : 'Get notified'}</Link>
            </div>
            <KeyBox />
          </div>
        </div>
      </section>
    </>
  )
}
