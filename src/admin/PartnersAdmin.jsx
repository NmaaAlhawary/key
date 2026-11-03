import { useEffect, useState } from 'react'
import { api, fmtDate, fmtTime } from '../api.js'
import { useAdmin, StatusPill } from './AdminApp.jsx'

const PSTAT = [['new', 'New'], ['talking', 'In talks'], ['signed', 'Signed'], ['closed', 'Not now']]
const SIGNED = [
  ['agreement', 'One-page agreement signed and invoiced'],
  ['card', 'Problem card written together'],
  ['dates', 'Handover, Door Visit and mentor dates booked'],
  ['ownership', 'Students keep ownership, in writing'],
]
const label = k => PSTAT.find(p => p[0] === k)?.[1] || k

export default function PartnersAdmin() {
  const { me, say, refreshCounts } = useAdmin()
  const [rows, setRows] = useState(null)
  const [teams, setTeams] = useState([])
  const [open, setOpen] = useState(null)
  const [log, setLog] = useState([])
  const [note, setNote] = useState('')
  const [adding, setAdding] = useState(null)
  const [tab, setTab] = useState('')
  const load = () => api('/api/admin/partners').then(r => { setRows(r); if (open) setOpen(r.find(x => x.id === open.id) || null) })
  useEffect(() => { load(); api('/api/admin/teams').then(t => setTeams(t.teams)) }, [])
  useEffect(() => { if (open) api(`/api/admin/partners/${open.id}/activity`).then(setLog) }, [open?.id, rows])

  async function patch(body) { await api(`/api/admin/partners/${open.id}`, { method: 'PATCH', body }); say('Saved'); load(); refreshCounts() }
  async function create(e) { e.preventDefault(); try { await api('/api/admin/partners', { method: 'POST', body: adding }); setAdding(null); load() } catch (x) { say(x.message) } }
  async function uploadLogo(e) {
    const f = e.target.files?.[0]; if (!f) return
    const form = new FormData(); form.append('logo', f)
    try { await api(`/api/admin/partners/${open.id}/logo`, { method: 'POST', form }); say('Logo saved'); load() } catch (x) { say(x.message) }
  }
  async function remove() { if (!confirm(`Delete ${open.org}?`)) return; await api(`/api/admin/partners/${open.id}`, { method: 'DELETE' }); setOpen(null); load() }

  if (!rows) return <div className="empty">Loading…</div>
  const view = rows.filter(r => !tab || r.status === tab)
  const lockSigned = rows.filter(r => r.kind === 'Lock Partner' && r.status === 'signed').length
  return (
    <>
      <div className="ad-top">
        <div><div className="label deep">Phase 0 · Partners and problems</div><h1>Partners</h1></div>
        <button className="btn btn-ink btn-sm" onClick={() => setAdding({ org: '', kind: 'Lock Partner', sector: '', contact_name: '', email: '', phone: '', message: '' })}>+ Add partner</button>
      </div>
      <div className="kpis">
        <div className="kpi"><b>{lockSigned}<span style={{ fontSize: 16, color: 'var(--steel)' }}> / 4</span></b><small>Lock Partners signed</small><div className="bar"><i style={{ width: `${Math.min(100, lockSigned * 25)}%` }} /></div></div>
        {PSTAT.map(([k, l]) => <div className="kpi" key={k}><b>{rows.filter(r => r.status === k).length}</b><small>{l}</small></div>)}
      </div>
      <div className="tabs">
        <button className={!tab ? 'on' : ''} onClick={() => setTab('')}>All<span>{rows.length}</span></button>
        {PSTAT.map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}
      </div>
      <div className="tbl-wrap">
        {view.length === 0 ? <div className="empty">No partners here yet. Enquiries from the website's Partners page land here.</div> : (
          <table className="tbl">
            <thead><tr><th>Organisation</th><th>Kind</th><th>Contact</th><th>Status</th><th>Signed checklist</th><th>Team</th><th>Received</th></tr></thead>
            <tbody>{view.map(p => (
              <tr key={p.id} onClick={() => setOpen(p)}>
                <td><b>{p.org}</b>{p.is_demo ? <span className="demo">DEMO</span> : null}<br /><span className="muted" style={{ fontSize: 12.5 }}>{p.sector}</span></td>
                <td>{p.kind}</td>
                <td>{p.contact_name}<br /><span className="muted" style={{ fontSize: 12.5 }}>{p.email}</span></td>
                <td><StatusPill s={p.status} map={label} /></td>
                <td>{SIGNED.filter(([k]) => p.checklist[k]).length} / 4</td>
                <td>{p.team_name || '—'}</td>
                <td>{fmtDate(p.created_at)}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>

      {open && (
        <div className="modal-bg" onClick={() => setOpen(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="label deep">{open.kind} · {open.sector}</div>
            <h2 className="form-title">{open.org}</h2>
            <dl className="kv" style={{ margin: '14px 0' }}>
              <dt>Contact</dt><dd>{open.contact_name} {open.role && `· ${open.role}`}</dd>
              <dt>Email</dt><dd><a href={`mailto:${open.email}`}>{open.email}</a></dd>
              <dt>Phone</dt><dd>{open.phone || '—'}</dd>
              <dt>Message</dt><dd style={{ whiteSpace: 'pre-wrap' }}>{open.message || '—'}</dd>
            </dl>
            <div className="grid2">
              <label className="field"><span>Status</span><select value={open.status} onChange={e => patch({ status: e.target.value })}>{PSTAT.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
              <label className="field"><span>Matched team</span><select value={open.team_id || ''} onChange={e => patch({ team_id: e.target.value ? Number(e.target.value) : null })}><option value="">—</option>{teams.map(t => <option key={t.id} value={t.id}>{t.name} · {t.sector}</option>)}</select></label>
            </div>
            <div className="label" style={{ margin: '18px 0 8px' }}>Logo · shown on the home page once Signed</div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              {open.logo_path && <img src={`/api/admin/partners/${open.id}/logo?v=${open.logo_path}`} alt="" style={{ height: 56, maxWidth: 180, objectFit: 'contain', background: '#f1f2f4', borderRadius: 8, padding: 6 }} />}
              <label className="btn btn-ghost btn-sm">{open.logo_path ? 'Replace logo' : 'Upload logo'}<input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" hidden onChange={uploadLogo} /></label>
            </div>
            {open.kind === 'Lock Partner' && <>
              <div className="label" style={{ margin: '18px 0 8px' }}>A partner is "signed" when</div>
              {SIGNED.map(([k, l]) => (
                <label className="check" key={k}><input type="checkbox" checked={!!open.checklist[k]} onChange={e => patch({ checklist: { ...open.checklist, [k]: e.target.checked } })} /><span>{l}</span></label>
              ))}
            </>}
            <form onSubmit={e => { e.preventDefault(); if (note.trim()) { patch({ note }); setNote('') } }} style={{ display: 'flex', gap: 8, margin: '16px 0 8px' }}>
              <input className="input" placeholder="Add a note (call, meeting, next step)…" value={note} onChange={e => setNote(e.target.value)} />
              <button className="btn btn-ink btn-sm">Add</button>
            </form>
            <ul className="log">{log.map(l => <li key={l.id}><small>{fmtTime(l.created_at)} · {l.who || 'Website'}</small>{l.kind === 'note' ? <div className="note-body">{l.body}</div> : l.body}</li>)}</ul>
            <div className="form-nav">
              {me.role === 'admin' ? <button className="btn btn-ghost btn-sm" style={{ color: 'var(--bad)' }} onClick={remove}>Delete</button> : <span />}
              <button className="btn btn-ink" onClick={() => setOpen(null)}>Done</button>
            </div>
          </div>
        </div>
      )}

      {adding && (
        <div className="modal-bg" onClick={() => setAdding(null)}>
          <form className="modal" onClick={e => e.stopPropagation()} onSubmit={create}>
            <h2 className="form-title">Add a partner</h2>
            <div className="grid2" style={{ marginTop: 18 }}>
              {[['org', 'Organisation'], ['sector', 'Sector'], ['contact_name', 'Contact name'], ['email', 'Email'], ['phone', 'Phone']].map(([k, l]) => (
                <label className="field" key={k}><span>{l}</span><input required={k === 'org'} value={adding[k]} onChange={e => setAdding({ ...adding, [k]: e.target.value })} /></label>
              ))}
              <label className="field"><span>Kind</span><select value={adding.kind} onChange={e => setAdding({ ...adding, kind: e.target.value })}>{['Lock Partner', 'Master Key Partner', 'Spare Key', 'Locksmith'].map(k => <option key={k}>{k}</option>)}</select></label>
            </div>
            <label className="field" style={{ marginTop: 18 }}><span>Notes</span><textarea rows={3} value={adding.message} onChange={e => setAdding({ ...adding, message: e.target.value })} /></label>
            <div className="form-nav"><button type="button" className="btn btn-ghost" onClick={() => setAdding(null)}>Cancel</button><button className="btn btn-ink">Add</button></div>
          </form>
        </div>
      )}
    </>
  )
}
