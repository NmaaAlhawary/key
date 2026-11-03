import { useEffect, useState } from 'react'
import { api, fmtDate } from '../api.js'
import { useAdmin } from './AdminApp.jsx'

export default function Settings() {
  const { me, say, refreshCounts } = useAdmin()
  const [s, setS] = useState(null)
  const [users, setUsers] = useState([])
  const [notify, setNotify] = useState([])
  const [nu, setNu] = useState({ name: '', email: '', password: '', role: 'reviewer' })
  const [pw, setPw] = useState({ current: '', next: '' })
  const isAdmin = me.role === 'admin'
  const load = () => { api('/api/admin/settings').then(setS); api('/api/admin/users').then(setUsers); api('/api/admin/notify').then(setNotify) }
  useEffect(load, [])

  async function setting(k, v) { try { setS(await api('/api/admin/settings', { method: 'PATCH', body: { [k]: v } })); say('Saved') } catch (e) { say(e.message) } }
  async function addUser(e) { e.preventDefault(); try { await api('/api/admin/users', { method: 'POST', body: nu }); setNu({ name: '', email: '', password: '', role: 'reviewer' }); say('Reviewer added'); load() } catch (x) { say(x.message) } }
  async function delUser(u) { if (confirm(`Remove ${u.name}? Their scores are removed too.`)) { await api(`/api/admin/users/${u.id}`, { method: 'DELETE' }); load() } }
  async function changePw(e) { e.preventDefault(); try { await api('/api/admin/me/password', { method: 'POST', body: pw }); setPw({ current: '', next: '' }); say('Password changed') } catch (x) { say(x.message) } }
  async function clearDemo() { if (confirm('Delete all demo applicants and demo partners?')) { await api('/api/admin/demo', { method: 'DELETE' }); say('Demo data deleted'); refreshCounts() } }

  if (!s) return <div className="empty">Loading…</div>
  return (
    <>
      <div className="ad-top"><div><div className="label deep">Admin</div><h1>Settings</h1></div></div>
      <div className="ad-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))' }}>
        <div className="ad-card">
          <h3>Open call</h3>
          <label className="check"><input type="checkbox" disabled={!isAdmin} checked={s.apps_open === 'true'} onChange={e => setting('apps_open', e.target.checked)} /><span><b>Applications are open</b><br /><span className="muted">When off, the Apply page collects parent emails for a "we are open" message instead.</span></span></label>
          <label className="check"><input type="checkbox" disabled={!isAdmin} checked={s.publish_results === 'true'} onChange={e => setting('publish_results', e.target.checked)} /><span><b>Show results on the status page</b><br /><span className="muted">Keep off until families have been told. Until then, Picked, Waiting list and Not this time all show as "under review".</span></span></label>
          <div className="grid2" style={{ marginTop: 10 }}>
            <label className="field"><span>Call dates (shown on the site)</span><input disabled={!isAdmin} defaultValue={s.call_dates} onBlur={e => e.target.value !== s.call_dates && setting('call_dates', e.target.value)} /></label>
            <label className="field"><span>Season label</span><input disabled={!isAdmin} defaultValue={s.season_label} onBlur={e => e.target.value !== s.season_label && setting('season_label', e.target.value)} /></label>
            <label className="field"><span>Season seat price (shown on the site)</span><input disabled={!isAdmin} defaultValue={s.seat_price} onBlur={e => e.target.value !== s.seat_price && setting('seat_price', e.target.value)} /></label>
          </div>
        </div>

        <div className="ad-card">
          <h3>Reviewers <span className="label">{users.length}</span></h3>
          {users.map(u => (
            <div className="pool-item" key={u.id}><span><b>{u.name}</b> <span className="muted" style={{ fontSize: 13 }}>· {u.email} · {u.role}</span></span>
              {isAdmin && u.id !== me.id && <button className="btn btn-ghost btn-sm" onClick={() => delUser(u)}>Remove</button>}</div>
          ))}
          {isAdmin && <form onSubmit={addUser} style={{ marginTop: 14 }}>
            <div className="grid2">
              <label className="field"><span>Name</span><input required value={nu.name} onChange={e => setNu({ ...nu, name: e.target.value })} /></label>
              <label className="field"><span>Email</span><input type="email" required value={nu.email} onChange={e => setNu({ ...nu, email: e.target.value })} /></label>
              <label className="field"><span>Temporary password</span><input required minLength={8} value={nu.password} onChange={e => setNu({ ...nu, password: e.target.value })} /></label>
              <label className="field"><span>Role</span><select value={nu.role} onChange={e => setNu({ ...nu, role: e.target.value })}><option value="reviewer">Reviewer (scores, notes, teams)</option><option value="admin">Admin (everything)</option></select></label>
            </div>
            <button className="btn btn-ink btn-sm" style={{ marginTop: 14 }}>Add reviewer</button>
          </form>}
        </div>

        <div className="ad-card">
          <h3>My password</h3>
          <form onSubmit={changePw}>
            <div className="grid2">
              <label className="field"><span>Current</span><input type="password" required value={pw.current} onChange={e => setPw({ ...pw, current: e.target.value })} /></label>
              <label className="field"><span>New (8+ characters)</span><input type="password" required minLength={8} value={pw.next} onChange={e => setPw({ ...pw, next: e.target.value })} /></label>
            </div>
            <button className="btn btn-ink btn-sm" style={{ marginTop: 14 }}>Change password</button>
          </form>
        </div>

        <div className="ad-card">
          <h3>Notify me list <span className="label">{notify.length}</span></h3>
          {notify.length === 0 ? <div className="muted" style={{ fontSize: 14 }}>Parents who ask to be told when the call opens appear here.</div>
            : notify.map(n => <div className="pool-item" key={n.id}><span>{n.name || '—'} · <a href={`mailto:${n.email}`}>{n.email}</a></span><span className="muted" style={{ fontSize: 13 }}>{fmtDate(n.created_at)}</span></div>)}
          {notify.length > 0 && <a className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} href={`mailto:?bcc=${notify.map(n => n.email).join(',')}&subject=${encodeURIComponent('KEYS applications are open')}`}>Email everyone (BCC)</a>}
        </div>

        {isAdmin && <div className="ad-card">
          <h3>Demo data</h3>
          <p className="muted" style={{ fontSize: 14, marginTop: 0 }}>Demo applicants and partners are marked DEMO. Delete them before the real call opens.</p>
          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--bad)' }} onClick={clearDemo}>Delete demo data</button>
        </div>}
      </div>
    </>
  )
}
