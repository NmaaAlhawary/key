import { useState } from 'react'
import Modal from '../components/Modal.jsx'
import { api, STATIC } from '../api.js'
import Icon from '../components/Icon.jsx'
import { PARTNER_KINDS, LOCK_GIVES, LOCK_GETS, PROBLEMS } from '../content.js'

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
              <ul style={{ marginTop: 10 }}>{LOCK_GIVES.map(([n, t]) => <li key={t}><b style={{ color: '#fff' }}>{n}</b> · {t}</li>)}</ul></div>
          </div>
        </div>
      </section>

      <section className="sec glow-sec center">
        <div className="wrap">
          <h2 className="h2">Four kinds of partner</h2>
          <p className="lead">Two carry the season: a Lock Partner for every team, and one Master Key Partner for Vault night.</p>
          <div className="gcards four" style={{ textAlign: 'left' }}>
            {PARTNER_KINDS.map(p => (
              <div className="gcard" key={p.name}>
                <div className="label red">{p.many}</div>
                <h3 style={{ margin: '8px 0 4px', fontSize: 20 }}>{p.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--dmuted)', marginBottom: 10 }}>{p.who}</p>
                <p><b style={{ color: '#fff' }}>Gives:</b> {p.gives}</p>
                <p style={{ marginTop: 8 }}><b style={{ color: '#fff' }}>Gets:</b> {p.gets}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <h2 className="h2 center" style={{ display: 'block' }}>Problems a team of five could crack</h2>
          <table className="ptable">
            <thead><tr><th>Sector</th><th>The problem</th><th>What a team could build</th></tr></thead>
            <tbody>{PROBLEMS.map(p => <tr key={p.sector}><td>{p.sector}</td><td><b>{p.problem}</b></td><td>{p.build}</td></tr>)}</tbody>
          </table>
          <p className="lead center" style={{ margin: '22px auto 0' }}>A good problem is real today, safe for kids, can be prototyped in four weeks, and fits in one sentence a 13-year-old can explain.</p>
        </div>
      </section>

      <section className="sec glow-sec center" id="enquire">
        <div className="wrap">
          <div className="ctabox">
            <h2>Ready to bring your challenge to life?</h2>
            <p>Tell us a little about you. We will reply with the partner pack and a time to meet.</p>
            <button className="btn btn-red arrow" onClick={() => setOpen(true)}>Become a partner</button>
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
