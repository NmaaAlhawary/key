import { useState } from 'react'
import { Link } from 'react-router-dom'
import StitchKey from '../components/StitchKey.jsx'
import { api, fmtDate, STATIC } from '../api.js'
import PageHero from '../components/PageHero.jsx'

export default function Status() {
  const [ref, setRef] = useState('')
  const [email, setEmail] = useState('')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')
  async function check(e) {
    e.preventDefault(); setErr(''); setRes(null)
    try { setRes(await api('/api/status', { method: 'POST', body: { ref, email } })) } catch (x) { setErr(x.message) }
  }
  return (
    <>
      <PageHero title="Check my application" text="Use the reference you got when you applied (it starts with KEYS-27) and the parent email on the form." />
      <div className="form-sec">
      <div className="form-wrap">
        <div className="card">
          <StitchKey teeth={res ? 6 : 0} size={240} className="key-center on-dark" />
          {STATIC ? <div className="static-note"><b>Coming 1 March 2027.</b> You can check your application here once applications open.</div> : <form onSubmit={check}>
            {err && <div className="alert alert-bad">{err}</div>}
            {res && <div className="alert alert-ok"><b>{res.first_name}</b>, applied {fmtDate(res.submitted)}.<br />{res.message}</div>}
            <div className="grid2">
              <label className="field"><span>Reference</span><input required value={ref} onChange={e => setRef(e.target.value)} placeholder="KEYS-27-1234" /></label>
              <label className="field"><span>Parent email</span><input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
            </div>
            <div className="form-nav"><Link to="/apply" className="btn btn-ghost">Not applied yet?</Link><button className="btn btn-ink">Check</button></div>
          </form>}
        </div>
      </div>
      </div>
    </>
  )
}
