import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, fmtDate, fmtTime } from '../api.js'
import { CRITERIA, STATUSES, ROLES, THEMES, CHALLENGES, statusOf } from '../shared/rules.js'
import { useAdmin, StatusPill } from './AdminApp.jsx'

export default function ApplicationDetail() {
  const { id } = useParams()
  const { me, say, refreshCounts } = useAdmin()
  const [a, setA] = useState(null)
  const [teams, setTeams] = useState([])
  const [mine, setMine] = useState({})
  const [note, setNote] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  async function load() {
    try {
      const r = await api(`/api/admin/applications/${id}`)
      setA(r)
      const m = r.scores.find(s => s.user_id === me.id) || {}
      setMine(Object.fromEntries([...CRITERIA.map(c => [c.key, m[c.key] ?? null]), ['comment', m.comment || '']]))
    } catch (e) { setErr(e.message) }
  }
  useEffect(() => { load(); api('/api/admin/teams').then(t => setTeams(t.teams)) }, [id])

  async function patch(body) {
    try { await api(`/api/admin/applications/${id}`, { method: 'PATCH', body }); say('Saved'); load(); refreshCounts() } catch (e) { say(e.message) }
  }
  async function saveScore() { await api(`/api/admin/applications/${id}/score`, { method: 'PUT', body: mine }); say('Score saved'); load() }
  async function addNote(e) { e.preventDefault(); if (!note.trim()) return; await api(`/api/admin/applications/${id}/notes`, { method: 'POST', body: { body: note } }); setNote(''); load() }

  useEffect(() => {
    const on = e => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return
      if (e.key === 'j' && a?.next) nav(`/admin/applications/${a.next}`)
      if (e.key === 'k' && a?.prev) nav(`/admin/applications/${a.prev}`)
    }
    window.addEventListener('keydown', on); return () => window.removeEventListener('keydown', on)
  }, [a])

  if (err) return <div className="empty">{err}</div>
  if (!a) return <div className="empty">Loading…</div>
  const d = a.data
  const sum = a.summary
  const fileUrl = `/api/admin/files/${a.id}`

  return (
    <>
      <div className="ad-top">
        <div>
          <Link to="/admin/applications" className="label" style={{ textDecoration: 'none' }}>← Applications</Link>
          <h1>{a.first_name} {a.last_name} {a.is_demo ? <span className="demo">DEMO</span> : null}</h1>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
            <StatusPill s={a.status} map={k => statusOf(k).label} />
            <span className="label">{a.ref} · applied {fmtDate(a.created_at)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" disabled={!a.prev} onClick={() => nav(`/admin/applications/${a.prev}`)} title="Shortcut: k">← Prev</button>
          <button className="btn btn-ghost btn-sm" disabled={!a.next} onClick={() => nav(`/admin/applications/${a.next}`)} title="Shortcut: j">Next →</button>
        </div>
      </div>

      <div className="detail">
        <div className="ad-grid">
          <div className="ad-card">
            <h3>Student</h3>
            <dl className="kv">
              <dt>Age on 1 Apr 2027</dt><dd>{a.age} (born {a.dob})</dd>
              <dt>Gender</dt><dd>{a.gender === 'girl' ? 'Girl' : 'Boy'}</dd>
              <dt>School</dt><dd>{a.school} {a.grade && `· ${a.grade}`}</dd>
              <dt>Area</dt><dd>{d.area || '—'}</dd>
              <dt>Interests</dt><dd>{d.interests?.join(', ') || '—'}</dd>
              <dt>Problem areas</dt><dd>{d.themes?.map(t => THEMES.find(x => x.key === t)?.label).join(', ') || '—'}</dd>
              <dt>Sounds like me</dt><dd>{ROLES.find(r => r.key === d.self_role)?.label || '—'}</dd>
              <dt>Experience</dt><dd>{d.experience || '—'}</dd>
            </dl>
          </div>

          <div className="ad-card">
            <h3>Piece 1 · Show us something <small className="label">Curiosity</small></h3>
            <div className="qa"><p>{d.piece1_text || <span className="muted">No text.</span>}</p></div>
            {a.has_file && (
              <div className="media">
                {a.file_type?.startsWith('image/') && <a href={fileUrl} target="_blank" rel="noreferrer"><img src={fileUrl} alt="Applicant upload" /></a>}
                {a.file_type?.startsWith('audio/') && <audio controls src={fileUrl} />}
                {a.file_type?.startsWith('video/') && <video controls src={fileUrl} />}
                {a.file_type === 'application/pdf' && <a className="btn btn-ghost btn-sm" style={{ margin: 12 }} href={fileUrl} target="_blank" rel="noreferrer">Open PDF: {a.file_name}</a>}
              </div>
            )}
          </div>

          <div className="ad-card">
            <h3>Piece 2 · Mini-challenge <small className="label">Tech thinking</small></h3>
            <div className="qa"><span>Problem {a.challenge + 1}</span><p>{CHALLENGES[a.challenge]}</p></div>
            <div className="qa"><span>Who it helps</span><p>{d.ch_who}</p></div>
            <div className="qa"><span>How it works</span><p>{d.ch_how}</p></div>
            <div className="qa" style={{ marginBottom: 0 }}><span>How to test it</span><p>{d.ch_test || '—'}</p></div>
          </div>

          <div className="ad-card">
            <h3>Parent and commitment <small className="label">Commitment</small></h3>
            <dl className="kv">
              <dt>Parent</dt><dd>{a.parent_name} {d.parent_relation && `(${d.parent_relation})`}</dd>
              <dt>Email</dt><dd><a href={`mailto:${a.parent_email}`}>{a.parent_email}</a></dd>
              <dt>Mobile</dt><dd><a href={`tel:${a.parent_phone}`}>{a.parent_phone}</a></dd>
              <dt>16 sessions</dt><dd>{d.commit_sessions ? '✓ Confirmed' : '✗'}</dd>
              <dt>Might miss</dt><dd>{d.missed_sessions || '—'}</dd>
              <dt>Photo consent</dt><dd>{d.photo_consent ? '✓ Yes' : <b style={{ color: 'var(--bad)' }}>No, keep out of photos and video</b>}</dd>
              <dt>Health notes</dt><dd>{d.allergies || '—'}</dd>
              <dt>Heard from</dt><dd>{d.heard || '—'}</dd>
            </dl>
          </div>

          <div className="ad-card">
            <h3>Notes and history</h3>
            <form onSubmit={addNote} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input className="input" placeholder="Add a note for the team…" value={note} onChange={e => setNote(e.target.value)} />
              <button className="btn btn-ink btn-sm">Add</button>
            </form>
            <ul className="log">{a.activity.map(l => (
              <li key={l.id}><small>{fmtTime(l.created_at)} · {l.who || 'System'}</small>{l.kind === 'note' ? <div className="note-body">{l.body}</div> : l.body}</li>
            ))}</ul>
          </div>
        </div>

        <div className="ad-grid" style={{ position: 'sticky', top: 20 }}>
          <div className="ad-card">
            <h3>Decision</h3>
            <label className="field"><span>Status</span>
              <select value={a.status} onChange={e => patch({ status: e.target.value })}>{STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}</select>
            </label>
            <div className="grid2">
              <label className="field"><span>Role seen at Key Trial</span>
                <select value={a.trial_role || ''} onChange={e => patch({ trial_role: e.target.value })}><option value="">—</option>{ROLES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}</select>
              </label>
              <label className="field"><span>Team</span>
                <select value={a.team_id || ''} onChange={e => patch({ team_id: e.target.value ? Number(e.target.value) : null })}><option value="">—</option>{teams.map(t => <option key={t.id} value={t.id}>{t.name} · {t.sector} ({t.members.length}/5)</option>)}</select>
              </label>
            </div>
          </div>

          <div className="ad-card">
            <h3>Score <span className="label">{sum.reviewers} reviewer{sum.reviewers === 1 ? '' : 's'}</span></h3>
            <div className="big-score"><b>{sum.total ?? '—'}</b><span className="muted">/ 100 {sum.done < 5 && sum.done > 0 ? `· ${sum.done} of 5 criteria` : ''}</span></div>
            {a.scores.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <div className="rev-row head"><b /> {CRITERIA.map(c => <span key={c.key}>{c.label.slice(0, 4).toUpperCase()}</span>)}</div>
                {a.scores.map(s => <div className="rev-row" key={s.user_id}><b style={{ fontWeight: 500 }}>{s.reviewer}</b>{CRITERIA.map(c => <span key={c.key}>{s[c.key] ?? '·'}</span>)}</div>)}
                <div className="rev-row"><b>Average</b>{CRITERIA.map(c => <span key={c.key}><b>{sum.avg[c.key] != null ? sum.avg[c.key].toFixed(1) : '·'}</b></span>)}</div>
              </div>
            )}
          </div>

          <div className="ad-card">
            <h3>Your score <span className="label">1 to 5</span></h3>
            {CRITERIA.map(c => (
              <div className="crit" key={c.key}>
                <div className="crit-head"><b>{c.label}</b><small>{c.weight}% · {c.source}</small></div>
                <div className="crit-hint"><span>1: {c.low}</span><span>5: {c.high}</span></div>
                <div className="dots">
                  {[1, 2, 3, 4, 5].map(n => <button key={n} type="button" className={mine[c.key] === n ? 'on' : ''} onClick={() => setMine({ ...mine, [c.key]: n })}>{n}</button>)}
                  {mine[c.key] != null && <button type="button" className="clear" onClick={() => setMine({ ...mine, [c.key]: null })}>clear</button>}
                </div>
              </div>
            ))}
            <label className="field" style={{ marginTop: 14 }}><span>Comment</span><textarea rows={3} value={mine.comment || ''} onChange={e => setMine({ ...mine, comment: e.target.value })} /></label>
            <button className="btn btn-red" style={{ width: '100%' }} onClick={saveScore}>Save my score</button>
            <p className="muted" style={{ fontSize: 12.5, margin: '10px 0 0' }}>Two staff score every student separately, then the scores are averaged. Teamwork is scored after the Key Trial.</p>
          </div>
        </div>
      </div>
    </>
  )
}
