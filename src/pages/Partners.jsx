import { useState } from 'react'
import Modal from '../components/Modal.jsx'
import { api, STATIC } from '../api.js'
import Icon from '../components/Icon.jsx'
import PartnerKey from '../components/PartnerKey.jsx'
import KeyBox from '../components/KeyBox.jsx'
import { PARTNER_KINDS, LOCK_GIVES, LOCK_GETS } from '../content.js'

const MARK = { 'Lock Partner': 'lock', 'Master Key Partner': 'master', 'Spare Key': 'spare', Locksmith: 'locksmith' }

const EMPTY = { org: '', kind: 'Lock Partner', sector: '', contact_name: '', role: '', email: '', phone: '', message: '', website: '' }

export default function Partners() {
  const [f, setF] = useState(EMPTY)
  const [state, setState] = useState({})
  const [open, setOpen] = useState(false)
  const bind = k => ({ value: f[k], onChange: e => setF({ ...f, [k]: e.target.value }) })
  async function send(e) {
    e.preventDefault()
    setState({ busy: true })
    try { await api('/api/partners', { method: 'POST', body: f }); setState({ ok: true }); setF(EMPTY) }
    catch (err) { setState({ err: err.message }) }
  }
  return (
    <>
      <section className="sec center" style={{ paddingTop: 150 }}>
        <div className="pattern-corner" />
        <div className="wrap">
          <h1 className="h2">Interested in partnering<br />with KEYS?</h1>
          <p className="lead">One real problem, a few hours of your team's time, and a seat at the Vault. Five students from five schools spend eight weeks trying to open your door.</p>
          <button className="btn btn-red arrow" style={{ marginTop: 26 }} onClick={() => setOpen(true)}>Get in touch</button>
          <div className="gcards" style={{ textAlign: 'left', marginTop: 56 }}>
            <div className="gcard"><h3><span className="chip-ic"><Icon name="spark" size={34} /></span>Why partner with KEYS?</h3>
              <ul>{LOCK_GETS.map(x => <li key={x}>{x}</li>)}</ul></div>
            <div className="gcard"><h3><span className="chip-ic"><Icon name="clock" size={34} /></span>How it works</h3>
              <p>About four to six hours across the whole season. Training happens in our controlled spaces, never your building, beyond one supervised Door Visit.</p>
              <ul style={{ marginTop: 10 }}>{LOCK_GIVES.map(([n, t]) => <li key={t}><b className="hi">{n}</b> · {t}</li>)}</ul></div>
          </div>
        </div>
      </section>

      <section className="sec glow-sec center">
        <div className="wrap">
          <h2 className="h2">Four kinds of partner</h2>
          <p className="lead">Two carry the season: a Lock Partner for every team, and one Master Key Partner for Vault night.</p>
          <div className="pkinds">
            {PARTNER_KINDS.map((p, n) => (
              <article className={`pkind ${n < 2 ? 'core' : ''}`} key={p.name}>
                <div className="pkind-top">
                  <PartnerKey kind={MARK[p.name]} height={46} />
                  <span className="pkind-many">{p.many}</span>
                </div>
                <h3>{p.name}</h3>
                <p className="pkind-who">{p.who}</p>
                <div className="pkind-row"><span className="pkind-k">Gives</span><p>{p.gives}</p></div>
                <div className="pkind-row"><span className="pkind-k">Gets</span><p>{p.gets}</p></div>
                {n < 2 && <div className="pkind-flag">Carries the season</div>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec glow-sec center" id="enquire">
        <div className="wrap">
          <div className="ctabox ctasplit">
            <div className="ctasplit-text">
              <div className="label red">Bring a problem</div>
              <h2>Ready to bring your challenge to life?</h2>
              <p>Put one real problem in a locked box. Five students spend eight weeks earning the keys to open it, and pitch their answer to you on Vault night.</p>
              <ul className="ctasplit-steps">
                <li><b>1</b>Tell us a little about you</li>
                <li><b>2</b>Get the partner pack and a time to meet</li>
                <li><b>3</b>Write the problem card together</li>
              </ul>
              <button className="btn btn-red arrow" onClick={() => setOpen(true)}>Become a partner</button>
            </div>
            <KeyBox />
          </div>
        </div>
      </section>

      <Modal open={open} onClose={() => setOpen(false)} title="Become a KEYS partner" sub="We reply with the partner pack and a time to meet.">
            {STATIC ? <div className="static-note"><b>Partner enquiries are opening soon.</b> The online form goes live with the open call. Until then, ask the KEYS team for the partner pack.</div> : state.ok ? <div className="alert alert-ok" style={{ margin: 0 }}>Thank you. We have your message and will be in touch soon.</div> : (
              <form onSubmit={send}>
                {state.err && <div className="alert alert-bad">{state.err}</div>}
                <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" {...bind('website')} />
                <div className="grid2">
                  <label className="field"><span>Organisation <span className="req">*</span></span><input required {...bind('org')} /></label>
                  <label className="field"><span>I am interested in</span>
                    <select {...bind('kind')}>{PARTNER_KINDS.map(p => <option key={p.name}>{p.name}</option>)}<option>Not sure yet</option></select>
                  </label>
                  <label className="field"><span>Your name <span className="req">*</span></span><input required {...bind('contact_name')} /></label>
                  <label className="field"><span>Your role</span><input {...bind('role')} /></label>
                  <label className="field"><span>Email <span className="req">*</span></span><input type="email" required {...bind('email')} /></label>
                  <label className="field"><span>Phone</span><input type="tel" {...bind('phone')} /></label>
                  <label className="field"><span>Sector</span><input {...bind('sector')} placeholder="Banking, telecom, health..." /></label>
                </div>
                <label className="field" style={{ marginTop: 18 }}><span>A problem you might bring, or a question</span><textarea rows={4} {...bind('message')} /></label>
                <button className="btn btn-red" style={{ width: "100%", marginTop: 6 }} disabled={state.busy}>{state.busy ? 'Sending…' : 'Send'}</button>
              </form>
            )}
      </Modal>
    </>
  )
}
