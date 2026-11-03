import { useState } from 'react'
import { api, STATIC } from '../api.js'

const EMPTY = { contact_name: '', email: '', phone: '', role: 'Parent', message: '', website: '' }

export default function Contact() {
  const [f, setF] = useState(EMPTY)
  const [state, setState] = useState({})
  const bind = k => ({ value: f[k], onChange: e => setF({ ...f, [k]: e.target.value }) })
  async function send(e) {
    e.preventDefault(); setState({ busy: true })
    try {
      await api('/api/partners', { method: 'POST', body: { ...f, org: f.contact_name, kind: 'Question', sector: f.role } })
      setState({ ok: true }); setF(EMPTY)
    } catch (x) { setState({ err: x.message }) }
  }
  return (
    <section className="sec glow-sec" style={{ paddingTop: 150, minHeight: '85vh' }}>
      <div className="wrap" style={{ maxWidth: 760 }}>
        <div className="center"><h1 className="h2 h2-bar">Contact us</h1><p className="lead">Questions about the season, the application or safeguarding? Write to us and we will reply by email.</p></div>
        <div className="dform" style={{ marginTop: 30 }}>
          {STATIC ? <div className="static-note"><b>Coming 1 March 2027.</b> The contact form goes live with the open call. Most answers are already in the FAQ.</div> : state.ok ? <div className="alert alert-ok" style={{ margin: 0 }}>Thank you. We will reply soon.</div> : (
            <form onSubmit={send}>
              {state.err && <div className="alert alert-bad">{state.err}</div>}
              <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" {...bind('website')} />
              <div className="grid2">
                <label className="field"><span>Your name <span className="req">*</span></span><input required {...bind('contact_name')} /></label>
                <label className="field"><span>I am a</span><select {...bind('role')}>{['Parent', 'Student', 'Teacher or school', 'Company', 'Other'].map(x => <option key={x}>{x}</option>)}</select></label>
                <label className="field"><span>Email <span className="req">*</span></span><input type="email" required {...bind('email')} /></label>
                <label className="field"><span>Phone</span><input type="tel" {...bind('phone')} /></label>
              </div>
              <label className="field" style={{ marginTop: 18 }}><span>Message <span className="req">*</span></span><textarea required rows={5} {...bind('message')} /></label>
              <button className="btn btn-red" disabled={state.busy}>{state.busy ? 'Sending…' : 'Send message'}</button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
