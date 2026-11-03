import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { ROLES, THEMES, teamChecks } from '../shared/rules.js'
import { useAdmin } from './AdminApp.jsx'
import Icon from '../components/Icon.jsx'

const initials = m => `${m.first_name[0] || ''}${m.last_name[0] || ''}`.toUpperCase()
const roleOf = m => ROLES.find(r => r.key === (m.final_role || m.trial_role || m.self_role))
const SECTOR_ICON = { Telecom: 'phone', Logistics: 'truck', Hospitality: 'food', Banking: 'bank' }
const SECTOR_TINT = ['#ce1126', '#1f6feb', '#0f9d58', '#f08c00']

// Suggests a placement that follows the five team rules as far as the pool allows:
// strongest scores first, each into the team that needs them most.
function suggest(teams, pool) {
  const t = teams.map(x => ({ ...x, members: [...x.members] }))
  const left = [...pool].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  for (const s of left) {
    let best = null, bestScore = -Infinity
    for (const team of t) {
      if (team.members.length >= 5) continue
      const m = team.members
      let v = -m.length * 3
      if (m.some(x => (x.school || '').toLowerCase() === (s.school || '').toLowerCase())) v -= 20
      if ((s.themes || []).includes(team.theme)) v += 6
      const same = m.filter(x => x.gender === s.gender).length
      v += same < 2 ? 4 : -2 * (same - 2)
      const r = roleOf(s)?.key
      if (r && !m.some(x => roleOf(x)?.key === r)) v += 5
      if (m.length && !m.some(x => Math.abs((x.age || 0) - (s.age || 0)) >= 2)) v += 1
      if (v > bestScore) { bestScore = v; best = team }
    }
    if (!best) break
    best.members.push(s)
    s._to = best.id
  }
  return left.filter(s => s._to)
}

export default function Teams() {
  const { say } = useAdmin()
  const [data, setData] = useState(null)
  const [edit, setEdit] = useState(null)
  const [drag, setDrag] = useState(null)
  const [over, setOver] = useState(null)
  const [busy, setBusy] = useState(false)
  const load = () => api('/api/admin/teams').then(setData)
  useEffect(() => { load() }, [])

  async function place(appId, team_id) {
    try { await api(`/api/admin/applications/${appId}`, { method: 'PATCH', body: { team_id } }); load() } catch (e) { say(e.message) }
  }
  async function role(appId, final_role) { await api(`/api/admin/applications/${appId}`, { method: 'PATCH', body: { final_role } }); load() }
  async function saveTeam(e) {
    e.preventDefault()
    await api(`/api/admin/teams/${edit.id}`, { method: 'PATCH', body: edit }); setEdit(null); say('Team saved'); load()
  }
  async function autoFill() {
    const plan = suggest(data.teams, data.pool)
    if (!plan.length) return say('No free seats or no one waiting')
    if (!confirm(`Place ${plan.length} student(s) into teams using the five rules? You can move anyone afterwards.`)) return
    setBusy(true)
    for (const s of plan) await api(`/api/admin/applications/${s.id}`, { method: 'PATCH', body: { team_id: s._to } }).catch(() => {})
    setBusy(false); say(`Placed ${plan.length} students`); load()
  }
  function drop(teamId) {
    setOver(null)
    if (!drag) return
    if (drag.team_id !== teamId) place(drag.id, teamId)
    setDrag(null)
  }

  if (!data) return <div className="empty">Loading…</div>
  const placed = data.teams.reduce((n, t) => n + t.members.length, 0)
  const seats = data.teams.length * 5

  return (
    <>
      <div className="ad-top">
        <div><div className="label deep">Phase 3 · Choosing and teams</div><h1>Teams</h1></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ink btn-sm" onClick={autoFill} disabled={busy || !data.pool.length}><Icon name="spark" size={16} weight="fill" /> {busy ? 'Placing…' : 'Auto-fill teams'}</button>
        </div>
      </div>

      <div className="tm-progress ad-card">
        <div>
          <b>{placed} of {seats}</b> seats filled
          <span className="muted"> · {data.pool.length} picked student{data.pool.length === 1 ? '' : 's'} waiting</span>
        </div>
        <div className="tm-bar"><i style={{ width: `${(placed / seats) * 100}%` }} /></div>
        <p className="muted">Drag a student onto a team, or use <b>Auto-fill</b> to place everyone by the rules: all five roles, no two from one school, at least 2 girls and 2 boys, mixed ages, and the problem they picked.</p>
      </div>

      <div className="tm-layout">
        <div className="tm-grid">
          {data.teams.map((t, ti) => {
            const checks = teamChecks(t, t.members)
            const ok = checks.filter(c => c.ok).length
            const tint = SECTOR_TINT[ti % 4]
            return (
              <div key={t.id} className={`tm-card ${over === t.id ? 'over' : ''}`} style={{ '--tint': tint }}
                onDragOver={e => { e.preventDefault(); setOver(t.id) }} onDragLeave={() => setOver(null)} onDrop={() => drop(t.id)}>
                <div className="tm-head">
                  <span className="tm-ic"><Icon name={SECTOR_ICON[t.sector] || 'key'} size={26} /></span>
                  <div className="tm-title">
                    <h3>{t.name}</h3>
                    <span>{t.sector} · {THEMES.find(x => x.key === t.theme)?.label}</span>
                  </div>
                  <button className="tm-edit" title="Edit team" onClick={() => setEdit(t)}><Icon name="pencil" size={18} /></button>
                </div>
                <div className={`tm-partner ${t.partner ? 'yes' : ''}`}><Icon name="hand" size={16} />{t.partner ? t.partner : 'Lock Partner not signed yet'}</div>
                <p className="tm-problem"><b>{t.problem}</b> {t.build}</p>

                <div className="tm-seats">
                  {Array.from({ length: 5 }).map((_, k) => {
                    const m = t.members[k]
                    if (!m) return (
                      <div key={k} className="tm-seat empty">
                        <span className="avatar ghost">+</span>
                        {data.pool.length ? (
                          <select className="select-sm" value="" onChange={e => e.target.value && place(Number(e.target.value), t.id)}>
                            <option value="">Add a student…</option>
                            {data.pool.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name} · {p.gender === 'girl' ? 'G' : 'B'} {p.age}{(p.themes || []).includes(t.theme) ? ' ★' : ''}</option>)}
                          </select>
                        ) : <span className="muted">Empty seat</span>}
                      </div>
                    )
                    return (
                      <div key={m.id} className="tm-seat" draggable onDragStart={() => setDrag(m)} onDragEnd={() => setDrag(null)}>
                        <span className={`avatar ${m.gender}`}>{initials(m)}</span>
                        <div className="tm-who">
                          <Link to={`/admin/applications/${m.id}`}>{m.first_name} {m.last_name}</Link>
                          <small>{m.age} · {m.gender === 'girl' ? 'Girl' : 'Boy'} · {m.school}{m.score != null ? ` · ${m.score} pts` : ''}</small>
                        </div>
                        <select className="select-sm" value={m.final_role || m.trial_role || ''} onChange={e => role(m.id, e.target.value)} title="Role in the team">
                          <option value="">Role</option>{ROLES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
                        </select>
                        <button className="tm-x" title="Remove from team" onClick={() => place(m.id, null)}>×</button>
                      </div>
                    )
                  })}
                </div>

                <div className="tm-rules">
                  <div className="tm-rules-h"><span>Team rules</span><b className={ok === checks.length ? 'good' : ''}>{ok}/{checks.length}</b></div>
                  <div className="tm-chips">{checks.map(c => <span key={c.label} className={`tm-chip ${c.ok ? 'ok' : 'no'}`} title={c.detail}>{c.ok ? '✓' : '!'} {c.label}</span>)}</div>
                </div>
              </div>
            )
          })}
        </div>

        <aside className={`tm-pool ad-card ${over === 'pool' ? 'over' : ''}`}
          onDragOver={e => { e.preventDefault(); setOver('pool') }} onDragLeave={() => setOver(null)}
          onDrop={() => { setOver(null); if (drag?.team_id) place(drag.id, null); setDrag(null) }}>
          <h3>Waiting to be placed <span className="label">{data.pool.length}</span></h3>
          {data.pool.length === 0 ? (
            <div className="tm-empty">
              <Icon name="check" size={34} />
              <p>{placed ? 'Everyone picked has a team.' : 'No picked students yet.'}</p>
              <Link className="btn btn-ghost btn-sm" to="/admin/applications?status=selected">Mark students as Picked</Link>
            </div>
          ) : [...data.pool].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).map(m => (
            <div key={m.id} className="tm-pool-item" draggable onDragStart={() => setDrag(m)} onDragEnd={() => setDrag(null)}>
              <span className={`avatar ${m.gender}`}>{initials(m)}</span>
              <div className="tm-who">
                <Link to={`/admin/applications/${m.id}`}>{m.first_name} {m.last_name}</Link>
                <small>{m.age} · {m.gender === 'girl' ? 'Girl' : 'Boy'} · {roleOf(m)?.label || 'no role'} · {m.score ?? '—'} pts</small>
                <small>Likes: {[...new Set(m.themes || [])].map(x => THEMES.find(y => y.key === x)?.label.split(' ')[0].replace(',', '')).join(', ') || '—'}</small>
              </div>
              <span className="tm-drag" title="Drag onto a team">⋮⋮</span>
            </div>
          ))}
          {data.pool.length > 0 && <p className="label" style={{ marginTop: 12 }}>Drag a card onto a team · drop back here to remove</p>}
        </aside>
      </div>

      {edit && (
        <div className="modal-bg" onClick={() => setEdit(null)}>
          <form className="modal" onClick={e => e.stopPropagation()} onSubmit={saveTeam}>
            <h2 className="form-title">Edit {edit.name}</h2>
            <div className="grid2" style={{ marginTop: 18 }}>
              <label className="field"><span>Name</span><input value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} /></label>
              <label className="field"><span>Sector</span><input value={edit.sector || ''} onChange={e => setEdit({ ...edit, sector: e.target.value })} /></label>
              <label className="field"><span>Lock Partner</span><input value={edit.partner || ''} onChange={e => setEdit({ ...edit, partner: e.target.value })} placeholder="Company name once signed" /></label>
              <label className="field"><span>Problem area (for matching)</span><select value={edit.theme || ''} onChange={e => setEdit({ ...edit, theme: e.target.value })}>{THEMES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}</select></label>
            </div>
            <label className="field" style={{ marginTop: 18 }}><span>Problem card</span><input value={edit.problem || ''} onChange={e => setEdit({ ...edit, problem: e.target.value })} /></label>
            <label className="field"><span>What they could build</span><input value={edit.build || ''} onChange={e => setEdit({ ...edit, build: e.target.value })} /></label>
            <div className="form-nav"><button type="button" className="btn btn-ghost" onClick={() => setEdit(null)}>Cancel</button><button className="btn btn-ink">Save</button></div>
          </form>
        </div>
      )}
    </>
  )
}
