import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { STATUSES, CHALLENGES } from '../shared/rules.js'

const PHASES = [
  ['Jan to Feb', 'Partners and problems', '2027-01-01'],
  ['1 to 14 Mar', 'Open call', '2027-03-01'],
  ['15 to 21 Mar', 'Selection', '2027-03-15'],
  ['22 to 28 Mar', 'Choosing and teams', '2027-03-22'],
  ['Early Apr', 'Team day and handover', '2027-04-01'],
  ['Apr to May', 'Training: six keys', '2027-04-08'],
  ['Late May', 'Pitch day: the Vault', '2027-05-24'],
  ['June', 'Review', '2027-06-01'],
]

function Bars({ data, label = k => k }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1])
  const max = Math.max(1, ...entries.map(e => e[1]))
  if (!entries.length) return <div className="muted" style={{ fontSize: 14 }}>No data yet.</div>
  return <div className="hbars">{entries.map(([k, v]) => (
    <div className="hbar" key={k}><span>{label(k)}</span><div className="track"><i style={{ width: `${(v / max) * 100}%` }} /></div><span className="n">{v}</span></div>
  ))}</div>
}

function Kpi({ n, label, target, to }) {
  const body = <><b>{n}{target ? <span style={{ fontSize: 16, color: 'var(--steel)', fontWeight: 500 }}> / {target}</span> : null}</b><small>{label}</small>
    {target ? <div className="bar"><i style={{ width: `${Math.min(100, (n / target) * 100)}%` }} /></div> : null}</>
  return to ? <Link className="kpi" to={to}>{body}</Link> : <div className="kpi">{body}</div>
}

export default function Dashboard() {
  const [s, setS] = useState(null)
  useEffect(() => { api('/api/admin/stats').then(setS) }, [])
  if (!s) return <div className="empty">Loading…</div>
  const now = new Date()
  const cur = PHASES.reduce((c, p, i) => (now >= new Date(p[2]) ? i : c), -1)
  const maxDay = Math.max(1, ...s.days.map(d => d[1]))
  const by = k => s.byStatus[k] || 0
  return (
    <>
      <div className="ad-top">
        <div><div className="label deep">Season one · the pilot</div><h1>Dashboard</h1></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a className="btn btn-ghost btn-sm" href="/api/admin/applications.csv">Export CSV</a>
          <Link className="btn btn-ink btn-sm" to="/admin/applications?status=submitted">Review new</Link>
        </div>
      </div>
      {s.demo > 0 && <div className="alert alert-info">{s.demo} demo applicants are loaded so you can try things out. Delete them in <Link to="/admin/settings">Settings</Link> before the real call opens.</div>}

      <div className="kpis">
        <Kpi n={s.total} label="Applications" target={60} to="/admin/applications" />
        <Kpi n={by('shortlisted') + by('selected') + by('waitlist')} label="Invited to the Key Trial" target={40} to="/admin/applications?status=shortlisted" />
        <Kpi n={by('selected')} label="Picked" target={20} to="/admin/applications?status=selected" />
        <Kpi n={s.placed} label="Placed in teams" target={20} to="/admin/teams" />
        <Kpi n={s.partnersSigned} label="Lock Partners signed" target={4} to="/admin/partners" />
      </div>
      <div className="kpis">
        <Kpi n={s.unscored} label="Not scored yet" to="/admin/applications?filter=unscored" />
        <Kpi n={s.needSecond} label="Need a second reviewer" to="/admin/applications?filter=second" />
        <Kpi n={s.schools} label="Different schools" />
        <Kpi n={s.notify} label="Waiting for the call to open" to="/admin/settings" />
      </div>

      <div className="ad-card" style={{ marginBottom: 16 }}>
        <h3>Pilot journey</h3>
        <div className="phases">{PHASES.map((p, i) => <div key={p[1]} className={`phase ${i === cur ? 'now' : ''}`}><b>{i} · {p[0]}</b>{p[1]}</div>)}</div>
        <p className="muted" style={{ fontSize: 13, margin: '12px 0 0' }}>The rule: the pilot starts only when all 4 Lock Partners are signed and the 20 seats are funded.</p>
      </div>

      <div className="ad-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <div className="ad-card"><h3>Pipeline</h3><Bars data={Object.fromEntries(STATUSES.map(x => [x.label, by(x.key)]).filter(x => x[1]))} /></div>
        <div className="ad-card"><h3>Applications per day</h3>
          <div className="spark">{s.days.map(([d, n]) => <div key={d} title={`${d}: ${n}`} style={{ height: `${(n / maxDay) * 100}%` }} />)}</div>
          <div className="label" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}><span>{s.days[0]?.[0]}</span><span>{s.days.at(-1)?.[0]}</span></div>
        </div>
        <div className="ad-card"><h3>Girls and boys <small className="muted">target: at least 2 of each per team</small></h3><Bars data={s.gender} label={k => (k === 'girl' ? 'Girls' : k === 'boy' ? 'Boys' : k)} /></div>
        <div className="ad-card"><h3>Ages on 1 April 2027</h3><Bars data={s.age} label={k => `Age ${k}`} /></div>
        <div className="ad-card"><h3>Mini-challenge picked</h3><Bars data={s.challenge} label={k => `${k}. ${CHALLENGES[k - 1]?.split(' ').slice(0, 3).join(' ')}…`} /></div>
        <div className="ad-card"><h3>How they heard</h3><Bars data={s.heard} /></div>
      </div>
    </>
  )
}
