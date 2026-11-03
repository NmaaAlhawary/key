import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api, fmtDate } from '../api.js'
import { STATUSES, ROLES, statusOf } from '../shared/rules.js'
import { useAdmin, StatusPill } from './AdminApp.jsx'

const FILTERS = [['', 'Everyone'], ['unscored', 'Not scored'], ['second', 'Needs a 2nd reviewer'], ['notmine', 'I have not scored'], ['file', 'Has a file']]

export default function Applications() {
  const { say, refreshCounts } = useAdmin()
  const [rows, setRows] = useState(null)
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState('')
  const [sort, setSort] = useState(['created_at', -1])
  const [picked, setPicked] = useState(new Set())
  const [gender, setGender] = useState('')
  const nav = useNavigate()
  const status = params.get('status') || ''
  const filter = params.get('filter') || ''
  const load = () => api('/api/admin/applications').then(setRows)
  useEffect(() => { load() }, [])

  const counts = useMemo(() => (rows || []).reduce((m, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {}), [rows])
  const view = useMemo(() => {
    if (!rows) return []
    const t = q.trim().toLowerCase()
    let v = rows.filter(r => (!status || r.status === status) && (!gender || r.gender === gender)
      && (!t || `${r.first_name} ${r.last_name} ${r.ref} ${r.school} ${r.parent_email}`.toLowerCase().includes(t)))
    if (filter === 'unscored') v = v.filter(r => r.reviewers === 0)
    if (filter === 'second') v = v.filter(r => r.reviewers === 1)
    if (filter === 'notmine') v = v.filter(r => !r.mine)
    if (filter === 'file') v = v.filter(r => r.has_file)
    const [k, dir] = sort
    return [...v].sort((a, b) => {
      const x = a[k] ?? -Infinity, y = b[k] ?? -Infinity
      return (x > y ? 1 : x < y ? -1 : 0) * dir
    })
  }, [rows, q, status, filter, gender, sort])

  const setParam = (k, v) => { const p = new URLSearchParams(params); v ? p.set(k, v) : p.delete(k); setParams(p); setPicked(new Set()) }
  const th = (k, label) => <th onClick={() => setSort([k, sort[0] === k ? -sort[1] : -1])}>{label}{sort[0] === k ? (sort[1] > 0 ? ' ↑' : ' ↓') : ''}</th>
  const togglePick = (id, e) => { e.stopPropagation(); const n = new Set(picked); n.has(id) ? n.delete(id) : n.add(id); setPicked(n) }

  async function bulk(newStatus) {
    if (!newStatus || !picked.size) return
    if (!confirm(`Move ${picked.size} applicant(s) to "${statusOf(newStatus).label}"?`)) return
    for (const id of picked) await api(`/api/admin/applications/${id}`, { method: 'PATCH', body: { status: newStatus } })
    say(`Moved ${picked.size} to ${statusOf(newStatus).label}`)
    setPicked(new Set()); load(); refreshCounts()
  }

  if (!rows) return <div className="empty">Loading…</div>
  return (
    <>
      <div className="ad-top">
        <div><div className="label deep">Selection</div><h1>Applications</h1></div>
        <a className="btn btn-ghost btn-sm" href="/api/admin/applications.csv">Export CSV</a>
      </div>
      <div className="tabs">
        <button className={!status ? 'on' : ''} onClick={() => setParam('status', '')}>All<span>{rows.length}</span></button>
        {STATUSES.map(s => <button key={s.key} className={status === s.key ? 'on' : ''} onClick={() => setParam('status', s.key)}>{s.label}<span>{counts[s.key] || 0}</span></button>)}
      </div>
      <div className="toolbar">
        <input className="input search" placeholder="Search name, reference, school or email" value={q} onChange={e => setQ(e.target.value)} />
        <select className="input" value={filter} onChange={e => setParam('filter', e.target.value)}>{FILTERS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        <select className="input" value={gender} onChange={e => setGender(e.target.value)}><option value="">Girls and boys</option><option value="girl">Girls</option><option value="boy">Boys</option></select>
        {picked.size > 0 && (
          <select className="input" value="" onChange={e => bulk(e.target.value)} style={{ borderColor: 'var(--ink)' }}>
            <option value="">Move {picked.size} selected to…</option>
            {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        )}
      </div>
      <div className="tbl-wrap">
        {view.length === 0 ? <div className="empty">No applications match.</div> : (
          <table className="tbl">
            <thead><tr>
              <th className="sel"><input type="checkbox" checked={picked.size === view.length} onChange={() => setPicked(picked.size === view.length ? new Set() : new Set(view.map(r => r.id)))} /></th>
              {th('last_name', 'Student')}{th('age', 'Age')}<th>Gender</th>{th('school', 'School')}<th>Status</th>{th('score', 'Score')}<th>Reviews</th><th>Role</th>{th('created_at', 'Applied')}
            </tr></thead>
            <tbody>{view.map(r => (
              <tr key={r.id} onClick={() => nav(`/admin/applications/${r.id}`)}>
                <td className="sel" onClick={e => togglePick(r.id, e)}><input type="checkbox" readOnly checked={picked.has(r.id)} /></td>
                <td><b>{r.first_name} {r.last_name}</b>{r.is_demo ? <span className="demo">DEMO</span> : null}<br /><span className="label" style={{ fontSize: 10.5 }}>{r.ref}</span></td>
                <td>{r.age}</td>
                <td>{r.gender === 'girl' ? 'Girl' : 'Boy'}</td>
                <td>{r.school}</td>
                <td><StatusPill s={r.status} map={k => statusOf(k).label} /></td>
                <td><span className={`score ${r.score_complete ? '' : 'partial'}`}>{r.score ?? '—'}</span>{r.score != null && !r.score_complete && <small className="muted"> ({r.score_done}/5)</small>}</td>
                <td>{r.reviewers}{r.mine ? ' ✓' : ''}</td>
                <td>{ROLES.find(x => x.key === (r.final_role || r.trial_role))?.label || <span className="muted">{ROLES.find(x => x.key === r.self_role)?.label ? `${ROLES.find(x => x.key === r.self_role).label}?` : '—'}</span>}</td>
                <td>{fmtDate(r.created_at)}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
      <p className="label" style={{ marginTop: 10 }}>Score out of 100 · averaged across reviewers · grey = some criteria still missing (Teamwork is scored at the Key Trial) · ✓ = you scored it</p>
    </>
  )
}
