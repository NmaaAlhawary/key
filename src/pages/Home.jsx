import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StitchKey from '../components/StitchKey.jsx'
import KeyBox from '../components/KeyBox.jsx'
import Slogan from '../components/Slogan.jsx'
import Icon from '../components/Icon.jsx'
import { KeyMark } from '../components/Logo.jsx'
import KeyBlade from '../components/KeyBlade.jsx'
import { asset } from '../asset.js'
import { useSettings } from '../useSettings.js'
import { PROBLEMS } from '../content.js'
import { api } from '../api.js'
import { countUp } from '../useReveal.js'

const SLIDES = [
  { img: '/img/petra.jpg', pos: 'center 40%', credit: 'Al-Khazneh, Petra · Photo: Brian Jeffery Beggerly, CC BY 2.0' },
  { img: '/img/amman.jpg', pos: 'center 55%', credit: 'Amman · Photo: Bernard Gagnon, CC BY-SA 4.0' },
  { img: '/img/key-tag.jpg', pos: 'center 35%' },
  { img: '/img/stage.jpg', pos: 'center 45%' },
]

const JOURNEY = [
  { title: 'Apply', sub: 'Open call', ic: 'user', bg: '#6d4aff', img: '/img/journey-apply.jpg', text: 'Ages 13 to 16, any school in Amman. A 15-minute form, no grades asked. Then a fun Key Trial.' },
  { title: 'The Locked Box', sub: 'Week 0 · Handover', ic: 'box', bg: '#0f9d58', img: '/img/journey-box.jpg', text: 'A real company hands your team of five a sealed box with a real problem inside.' },
  { title: 'Six Keys', sub: 'Weeks 1 to 7 · Training', ic: 'key', bg: '#d9b46a', img: '/img/journey-keys.jpg', text: 'Train in robotics, AI and business. Pass each stage\'s challenge to earn its key.' },
  { title: 'The Vault', sub: 'Week 8 · Pitch night', ic: 'vault', bg: '#f08c00', img: '/img/journey-vault.jpg', text: 'Pitch to the leaders who hold the keys. Three golden keys open the vault on stage.' },
]

const SECTOR_ICONS = ['phone', 'truck', 'food', 'bank']

function LogoTile({ p, label, light }) {
  return (
    <div className={`tile ptile logo-tile ${light ? 'light' : ''}`} title={p.org}>
      {p.has_logo ? <img src={`/api/public/logo/${p.id}`} alt={p.org} /> : <b>{p.org}</b>}
      <span>{label}</span>
    </div>
  )
}

export default function Home() {
  const s = useSettings()
  const [partners, setPartners] = useState([])
  const [i, setI] = useState(0)
  useEffect(() => { const t = setInterval(() => setI(x => (x + 1) % SLIDES.length), 6000); return () => clearInterval(t) }, [])
  const go = d => setI(x => (x + d + SLIDES.length) % SLIDES.length)
  useEffect(() => { api('/api/public/partners').then(setPartners).catch(() => {}); countUp() }, [])
  return (
    <>
      <section className="hero">
        <div className="slides">
          {SLIDES.map((sl, k) => <div key={k} className={`slide ${k === i ? 'on' : ''}`}><img src={asset(sl.img)} alt="" style={{ objectPosition: sl.pos }} /></div>)}
        </div>
        <button className="hero-arrow l" aria-label="Previous slide" onClick={() => go(-1)}>‹</button>
        <button className="hero-arrow r" aria-label="Next slide" onClick={() => go(1)}>›</button>
        <div className="hero-box" key={`box-${i}`}>
          <h1><span className="ln">Every company is a locked door.</span><br /><span className="ln">Earn the keys to open it.</span></h1>
          <p>An eight-week innovation season where student teams crack a real company's problem, earn six keys, and pitch inside the Vault.</p>
          <Slogan className="slogan-hero" />
        </div>
        <div className="hero-side">
          <div className="date-pill">{s.apps_open ? `Apply ${s.call_dates.replace(' 2027', '')}` : `Opens ${s.call_dates.split(' to ')[0]} March`}</div>
          <Link to="/apply" className="btn btn-red arrow" style={{ border: '1.5px solid rgba(255,255,255,.6)' }}>{s.apps_open ? 'Apply now' : 'Get ready'}</Link>
        </div>
        {SLIDES[i].credit && <small className="credit">{SLIDES[i].credit}</small>}
        <div className="dots-row">{SLIDES.map((_, k) => <button key={k} aria-label={`Slide ${k + 1}`} className={k === i ? 'on' : ''} onClick={() => setI(k)} />)}</div>
      </section>

      <section className="sec">
        <div className="pattern-corner" />
        <div className="wrap split">
          <h2 className="h2">What is the<br />KEYS season?</h2>
          <div>
            <p>KEYS is a hands-on innovation season for school students aged 13 to 16. Real companies, like a bank, a telecom, a logistics firm or a hotel, hand each team of five the key to a real problem.</p>
            <p>Over eight weeks, teams train in robotics, AI and business, build a working prototype, and pitch it at the Vault to the company leaders who decide, key by key, who opens it.</p>
            <Slogan />
          </div>
        </div>
      </section>

      <section className="sec sec-tight center">
        <div className="wrap">
          <h2 className="h2 h2-bar" style={{ fontSize: 'clamp(26px,3vw,34px)' }}>Lock Partners 2027</h2>
          <p className="lead">Four real companies set the problems for season one. One problem, one team.</p>
          <div className="tiles">
            {PROBLEMS.slice(0, 4).map((p, i) => {
              const signed = partners.find(x => x.kind === 'Lock Partner' && x.team_sector === p.sector)
              return signed ? <LogoTile key={p.sector} p={signed} label={`Team ${i + 1} · ${p.sector}`} /> : (
                <Link className="tile ptile" to={`/challenges/${p.slug}`} key={p.sector}>
                  <Icon name={SECTOR_ICONS[i]} size={44} />
                  <b>{p.sector}</b><span>Team {i + 1} · to be announced</span>
                </Link>
              )
            })}
          </div>
          <h3 className="subhead">Season one supporters</h3>
          <div className="tiles">
            {[['Master Key Partner', '/img/key-stitched.jpg', 'center 30%'], ['Spare Key', '/img/key-plain.jpg', 'center 30%'], ['Locksmith', '/img/keys-collection.jpg', 'center 40%']].map(([k, img, pos]) => {
              const signed = partners.filter(x => x.kind === k)
              return signed.length ? signed.map(x => <LogoTile key={x.id} p={x} label={k} light />) : (
                <Link className="tile ptile photo" to="/partners" key={k}><img src={asset(img)} alt="" loading="lazy" style={{ objectPosition: pos }} /><b>{k}</b><span>Seat open</span></Link>
              )
            })}
            <Link className="tile ptile photo cta" to="/partners"><img src={asset('/img/vault-chest.jpg')} alt="" loading="lazy" style={{ objectPosition: 'center 45%' }} /><b>Bring a problem</b><span>Become a partner →</span></Link>
          </div>
        </div>
      </section>

      <section className="sec journey-sec">
        <div className="wrap">
          <div className="label red">02 · The journey</div>
          <h2 className="h2">Six stages. Six keys.</h2>
          <p className="lead" style={{ margin: '10px 0 0' }}>Every stage ends with one challenge. Pass it and your team collects that stage's key, and one more tooth is cut on your blade. Collect all six and your key fits the Vault.</p>
          <KeyBlade />
          <div className="jgrid">
            {JOURNEY.map((j, k) => (
              <article className="jcard" key={j.title}>
                <div className="jcard-img"><img src={asset(j.img)} alt="" loading="lazy" />{j.credit && <small className="img-credit">{j.credit}</small>}</div>
                <div className="jcard-body">
                  <div className="jcard-t"><b><span className="chip-ic"><Icon name={j.ic} size={24} /></span>{j.title}</b><small>{j.sub}</small></div>
                  <p>{j.text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="jfoot"><span>Ready to find your key?</span><Link to="/how-it-works">Learn more →</Link></div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <h2 className="h2 center" style={{ marginBottom: 8 }}>What to expect</h2>
          <div className="gcards four">
            {[
              ['door', 'Work on a real problem', 'A problem a real company is facing today, not a textbook project.'],
              ['people', 'Meet new people', 'Four teammates from other schools. Each is good at something you are not.'],
              ['tool', 'Learn new skills', 'Robotics, sensors, coding, AI, money sense and public speaking.'],
              ['key', 'Earn your keys', 'Real metal keys with an NFC chip. Tap one to open your team\'s project page.'],
            ].map(([ic, t, d]) => <div className="gcard" key={t}><h3><span className="chip-ic"><Icon name={ic} size={34} /></span>{t}</h3><p>{d}</p></div>)}
          </div>
        </div>
      </section>

      <section className="band">
        <img src={asset('/img/stage.jpg')} alt="" loading="lazy" />
        <div className="wrap">
          <div className="band-in">
            <div className="label red">Week 8 · Late May 2027</div>
            <h2 className="h2" style={{ margin: '10px 0 14px' }}>The night the vault opens.</h2>
            <p>One public evening with families, schools, the four companies and media. Each Keyholder walks to the team they believe in and hands over a golden key. The audience votes one more: the People's Key.</p>
            <div className="stats"><div><b data-count="7">7</b><span>Keys in the room</span></div><div><b data-count="3">3</b><span>Keys open the vault</span></div><div><b data-count="5" data-suffix="′">5′</b><span>To pitch and demo</span></div></div>
            <Link to="/vault" className="btn btn-red arrow">Inside Vault night</Link>
          </div>
        </div>
      </section>

      <section className="org">
        <img src={asset('/img/hands.jpg')} alt="" loading="lazy" />
        <div className="wrap">
          <KeyMark height={84} />
          <h2 className="h2" style={{ marginTop: 18 }}>Safe rooms. Real doors.</h2>
          <div className="org-box">Training happens in safe, supervised spaces in Amman, after school. Vetted adults, two-adult rule, female staff always present, and photos only with consent.</div>
          <Link to="/parents" className="btn btn-red">For parents</Link>
        </div>
      </section>

      <section className="sec center">
        <div className="wrap">
          <div className="ctabox">
            <KeyBox />
            <h2>Ready to find your key?</h2>
            <p>Twenty students. Four real problems. One night the vault opens.</p>
            <small>Applications {s.call_dates} · Ages 13 to 16 · Seat {s.seat_price}</small>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/apply" className="btn btn-red arrow">{s.apps_open ? 'Apply now' : 'Get notified'}</Link>
              <Link to="/application" className="btn btn-line">Application details</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
