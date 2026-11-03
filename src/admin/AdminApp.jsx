import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { api, STATIC } from '../api.js'
import Logo from '../components/Logo.jsx'
import Dashboard from './Dashboard.jsx'
import Applications from './Applications.jsx'
import ApplicationDetail from './ApplicationDetail.jsx'
import Teams from './Teams.jsx'
import PartnersAdmin from './PartnersAdmin.jsx'
import Settings from './Settings.jsx'

const Ctx = createContext(null)
export const useAdmin = () => useContext(Ctx)

export default function AdminApp() {
  const [me, setMe] = useState(undefined)
  const [toast, setToast] = useState('')
  const [counts, setCounts] = useState({})
  const nav = useNavigate()
  useEffect(() => { document.title = 'KEYS Admin'; api('/api/admin/me').then(setMe).catch(() => setMe(null)) }, [])
  const say = useCallback(t => { setToast(t); setTimeout(() => setToast(''), 2400) }, [])
  const refreshCounts = useCallback(() => api('/api/admin/stats').then(s => setCounts({ apps: s.byStatus.submitted || 0, partners: s.partnersOpen })).catch(() => {}), [])
  useEffect(() => { if (me) refreshCounts() }, [me, refreshCounts])

  if (STATIC) return <div className="empty">The admin runs on the KEYS server, not on this public preview.</div>
  if (me === undefined) return <div className="empty">Loading…</div>
  if (!me) return <Login onIn={setMe} />
  async function logout() { await api('/api/admin/logout', { method: 'POST' }); setMe(null); nav('/admin') }

  return (
    <Ctx.Provider value={{ me, say, refreshCounts }}>
      <div className="ad">
        <aside className="ad-side">
          <div className="ad-brand"><Logo height={16} color="#fff" /><small>ADMIN</small></div>
          <NavLink end to="/admin">Dashboard</NavLink>
          <NavLink to="/admin/applications">Applications {counts.apps ? <span className="count">{counts.apps}</span> : null}</NavLink>
          <NavLink to="/admin/teams">Teams</NavLink>
          <NavLink to="/admin/partners">Partners {counts.partners ? <span className="count">{counts.partners}</span> : null}</NavLink>
          <NavLink to="/admin/settings">Settings</NavLink>
          <a href="/" target="_blank" rel="noreferrer">View site ↗</a>
          <div className="ad-user">{me.name}<br /><span style={{ color: 'var(--steel)' }}>{me.role}</span><br /><button onClick={logout}>Sign out</button></div>
        </aside>
        <div className="ad-main">
          <Routes>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/applications" element={<Applications />} />
            <Route path="/admin/applications/:id" element={<ApplicationDetail />} />
            <Route path="/admin/teams" element={<Teams />} />
            <Route path="/admin/partners" element={<PartnersAdmin />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </Ctx.Provider>
  )
}

function Login({ onIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  async function go(e) {
    e.preventDefault(); setErr('')
    try { onIn(await api('/api/admin/login', { method: 'POST', body: { email, password } })) } catch (x) { setErr(x.message) }
  }
  return (
    <div className="login">
      <form className="card" onSubmit={go}>
        <Logo height={22} arabic />
        <h1 className="form-title" style={{ margin: '26px 0 6px' }}>Admin sign in</h1>
        <p className="form-sub">Review applications, score students and build the teams.</p>
        {err && <div className="alert alert-bad">{err}</div>}
        <label className="field"><span>Email</span><input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label className="field"><span>Password</span><input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
        <button className="btn btn-ink" style={{ width: '100%' }}>Sign in</button>
      </form>
    </div>
  )
}

export function StatusPill({ s, map }) {
  return <span className={`pill st-${s}`}>{map ? map(s) : s}</span>
}
