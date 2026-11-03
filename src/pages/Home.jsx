import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { KeyMark } from '../components/Logo.jsx'
import KeyBlade from '../components/KeyBlade.jsx'
import { asset } from '../asset.js'
import { useSettings } from '../useSettings.js'
import { PROBLEMS } from '../content.js'
import { api } from '../api.js'
import { countUp } from '../useReveal.js'

const CARDS = [
  { img: '/img/stage.jpg', title: 'Vault night · late May' },
  { img: '/img/petra.jpg', title: 'Inspired by Al-Khazneh, Petra', credit: 'Photo: Brian Jeffery Beggerly, CC BY 2.0' },
  { img: '/img/amman.jpg', title: 'Season one · Amman', credit: 'Photo: Bernard Gagnon, CC BY-SA 4.0' },
]

const JOURNEY = [
  { title: 'Apply', sub: 'Open call', ic: 'user', bg: '#6d4aff', img: '/img/hands.jpg', text: 'Ages 13 to 16, any school in Amman. A 10-minute form, no grades asked. Then a fun Key Trial.' },
  { title: 'The Locked Box', sub: 'Week 0 · Handover', ic: 'box', bg: '#0f9d58', img: '/img/slate.jpg', text: 'A real company hands your team of five a sealed box with a real problem inside.' },
  { title: 'Six Keys', sub: 'Weeks 1 to 7 · Training', ic: 'key', bg: '#ce1126', img: '/img/keys.jpg', text: 'Train in robotics, AI and business. Pass each stage\'s challenge to earn its key.' },
  { title: 'The Vault', sub: 'Week 8 · Pitch night', ic: 'vault', bg: '#f08c00', img: '/img/stage.jpg', text: 'Pitch to the leaders who hold the keys. Three golden keys open the vault on stage.' },
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
  useEffect(() => { api('/api/public/partners').then(setPartners).catch(() => {}); countUp() }, [])
  return (
    <>
      <section className="hero2">
        <div className="wrap hero2-in">
          <div className="hero2-text">
            <div className="label red">{s.season_label} · Ages 13 to 16</div>
            <h1>Every company is a <em>locked door.</em></h1>
            <p>An eight-week innovation season where teams of five students crack a real problem from a real company, earn six keys, and pitch at the Vault.</p>
            <div className="hero2-actions">
              <Link to="/apply" className="btn btn-ink arrow">{s.apps_open ? 'Apply now' : 'Applications open 1 March'}</Link>
              <Link to="/partners" className="btn btn-ghost">Bring a problem</Link>
            </div>
            <div className="hero2-meta">
              <div><b>{s.call_dates}</b><span>Applications</span></div>
              <div><b>Apr to May 2027</b><span>Six keys</span></div>
              <div><b>Late May</b><span>Vault night</span></div>
            </div>
          </div>
          <div className="hero2-key" aria-hidden="true">
            <div className="hero2-ring" />
            <img src={asset('/img/key-red.svg')} alt="" />
          </div>
        </div>
        <div className="wrap postcards">
          {CARDS.map((c, k) => (
            <figure className="postcard" key={c.img} style={{ '--r': `${[-2.2, 1.4, -1][k]}deg` }}>
              <img src={asset(c.img)} alt="" loading="lazy" />
              <figcaption><b>{c.title}</b>{c.credit && <small>{c.credit}</small>}</figcaption>
            </figure>
          ))}
        </div>
        <div className="stitch-line" />
      </section>

      <section className="sec">
        <div className="pattern-corner" />
        <div className="wrap split">
          <h2 className="h2">What is the<br />KEYS season?</h2>
          <div>
            <p>KEYS is a hands-on innovation season for school students aged 13 to 16. Real companies, like a bank, a telecom, a logistics firm or a hotel, hand each team of five the key to a real problem.</p>
            <p>Over eight weeks, teams train in robotics, AI and business, build a working prototype, and pitch it at the Vault to the company leaders who decide, key by key, who opens it.</p>
            <p><em>Eight weeks. Six keys. One Vault.</em></p>
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
                <Link className="tile ptile" to="/challenges" key={p.sector}>
                  <Icon name={SECTOR_ICONS[i]} size={44} />
                  <b>{p.sector}</b><span>Team {i + 1} · to be announced</span>
                </Link>
              )
            })}
          </div>
          <h3 className="subhead">Season one supporters</h3>
          <div className="tiles">
            {[['Master Key Partner', 'key'], ['Spare Key', 'heart'], ['Locksmith', 'toolbox']].map(([k, ic]) => {
              const signed = partners.filter(x => x.kind === k)
              return signed.length ? signed.map(x => <LogoTile key={x.id} p={x} label={k} light />) : (
                <Link className="tile ptile light" to="/partners" key={k}><Icon name={ic} size={40} color="var(--red)" /><b>{k}</b><span>Seat open</span></Link>
              )
            })}
            <Link className="tile ptile red" to="/partners"><Icon name="hand" size={40} color="#fff" /><b>Bring a problem</b><span>Become a partner →</span></Link>
          </div>
        </div>
      </section>

      <section className="sec journey-sec">
        <div className="wrap">
          <div className="label red">02 · The journey</div>
          <h2 className="h2">One key, six teeth.</h2>
          <p className="lead" style={{ margin: '10px 0 0' }}>Every stage your team passes cuts one more tooth. Six teeth, and the key fits the Vault.</p>
          <KeyBlade />
          <div className="jgrid">
            {JOURNEY.map((j, k) => (
              <article className="jcard" key={j.title}>
                <div className="jcard-img"><img src={asset(j.img)} alt="" loading="lazy" /></div>
                <div className="jcard-body">
                  <div className="jcard-t"><span className="chip-ic"><Icon name={j.ic} size={30} /></span><span><b>{j.title}</b><small>{j.sub}</small></span></div>
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
