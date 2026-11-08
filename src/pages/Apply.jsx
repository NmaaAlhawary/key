import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, STATIC } from '../api.js'
import { useSettings } from '../useSettings.js'
import StitchKey from '../components/StitchKey.jsx'
import Icon from '../components/Icon.jsx'
import { asset } from '../asset.js'
import { CHALLENGES, ROLES, THEMES, ageOn, MIN_AGE, MAX_AGE } from '../shared/rules.js'

const DRAFT = 'keys-apply-draft'
const STEPS = ['About you', 'Interests', 'Show us', 'Challenge', 'Parent', 'Review']
const STEP_HINTS = ['Name, age, school', 'What you enjoy', 'Something you fixed', 'One tech idea', 'Consent and contact', 'Check and send']
const INTERESTS = ['Robotics', 'Coding', 'AI', 'Design', 'Building things', 'Business', 'Storytelling', 'Research', 'Drawing', 'Video']
const HEARD = ['School', 'Instagram', 'Parent group', 'A friend', 'NGO partner', 'University event', 'Other']
const EMPTY = {
  first_name: '', last_name: '', dob: '', gender: '', school: '', grade: '', area: '',
  interests: [], themes: [], self_role: '', experience: '',
  piece1_text: '', challenge: null, ch_who: '', ch_how: '', ch_test: '',
  parent_name: '', parent_relation: '', parent_email: '', parent_phone: '', heard: '', allergies: '', missed_sessions: '',
  commit_sessions: false, parent_confirms: false, consent_data: false, photo_consent: false, website: '',
}

const load = () => { try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(DRAFT) || '{}') } } catch { return EMPTY } }
const save = v => { try { localStorage.setItem(DRAFT, JSON.stringify(v)) } catch { /* private mode */ } }

function Field({ label, req, hint, error, children }) {
  return (
    <label className={`field ${error ? 'bad' : ''}`}>
      <span>{label}{req && <span className="req"> *</span>}</span>
      {children}
      {hint && !error && <small>{hint}</small>}
      {error && <span className="err">{error}</span>}
    </label>
  )
}

function validate(step, f, file) {
  const e = {}
  if (step === 0) {
    if (!f.first_name.trim()) e.first_name = 'Required'
    if (!f.last_name.trim()) e.last_name = 'Required'
    const a = ageOn(f.dob)
    if (!f.dob) e.dob = 'Required'
    else if (a == null || a < MIN_AGE || a > MAX_AGE) e.dob = `Season one is for ages ${MIN_AGE} to ${MAX_AGE} on 1 April 2027. This date gives ${a ?? '?'}.`
    if (!f.gender) e.gender = 'Required'
    if (!f.school.trim()) e.school = 'Required'
  }
  if (step === 1 && !f.themes.length) e.themes = 'Pick at least one'
  if (step === 2 && !f.piece1_text.trim() && !file) e.piece1 = 'Tell us about it, or add a photo, drawing or voice note'
  if (step === 3) {
    if (f.challenge == null) e.challenge = 'Pick one problem'
    if (!f.ch_who.trim()) e.ch_who = 'Required'
    if (!f.ch_how.trim()) e.ch_how = 'Required'
  }
  if (step === 4) {
    if (!f.parent_name.trim()) e.parent_name = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.parent_email)) e.parent_email = 'A valid email, please'
    if (!f.parent_phone.trim()) e.parent_phone = 'Required'
    if (!f.commit_sessions || !f.parent_confirms || !f.consent_data) e.consent = 'Please tick the three required boxes'
  }
  return e
}

function VoiceRecorder({ onDone }) {
  const [rec, setRec] = useState(null)
  const [secs, setSecs] = useState(0)
  const [err, setErr] = useState('')
  const timer = useRef()
  async function start() {
    setErr('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      const parts = []
      mr.ondataavailable = ev => parts.push(ev.data)
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop())
        const type = mr.mimeType || 'audio/webm'
        const ext = type.includes('mp4') ? 'm4a' : 'webm'
        onDone(new File(parts, `voice-note.${ext}`, { type }))
      }
      mr.start(); setRec(mr); setSecs(0)
      timer.current = setInterval(() => setSecs(s => { if (s >= 59) { mr.stop(); clearInterval(timer.current); setRec(null) } return s + 1 }), 1000)
    } catch { setErr('We could not use the microphone. You can upload a file instead.') }
  }
  function stop() { rec?.stop(); clearInterval(timer.current); setRec(null) }
  useEffect(() => () => clearInterval(timer.current), [])
  if (typeof window !== 'undefined' && !window.MediaRecorder) return null
  return (
    <>
      {rec
        ? <button type="button" className="btn btn-ink btn-sm" onClick={stop}><span className="rec-dot" /> Stop · 0:{String(secs).padStart(2, '0')} / 1:00</button>
        : <button type="button" className="btn btn-ghost btn-sm" onClick={start}>🎙 Record a voice note</button>}
      {err && <div className="err" style={{ width: '100%', color: 'var(--bad)', fontSize: 13 }}>{err}</div>}
    </>
  )
}

export default function Apply() {
  const s = useSettings()
  const [f, setF] = useState(load)
  const [file, setFile] = useState(null)
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [serverErr, setServerErr] = useState('')
  const [done, setDone] = useState(null)
  const top = useRef()
  useEffect(() => save(f), [f])

  const set = (k, v) => setF(p => ({ ...p, [k]: v }))
  const bind = k => ({ value: f[k], onChange: e => set(k, e.target.value) })
  const toggle = (k, v) => set(k, f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v])
  const go = n => { setStep(n); setErrors({}); top.current?.scrollIntoView({ behavior: 'smooth' }) }
  function next() {
    const e = validate(step, f, file)
    setErrors(e)
    if (!Object.keys(e).length) go(step + 1)
  }
  function pickFile(ev) {
    const x = ev.target.files?.[0]
    if (!x) return
    if (x.size > 15 * 1024 * 1024) { setErrors({ piece1: 'That file is bigger than 15 MB.' }); return }
    setFile(x); setErrors({})
  }
  async function submit() {
    for (let i = 0; i < 5; i++) { const e = validate(i, f, file); if (Object.keys(e).length) { setErrors(e); go(i); return } }
    setBusy(true); setServerErr('')
    const form = new FormData()
    form.append('payload', JSON.stringify(f))
    if (file) form.append('piece1File', file)
    try {
      const r = await api('/api/applications', { method: 'POST', form })
      setDone({ ref: r.ref, name: f.first_name, email: f.parent_email })
      try { localStorage.removeItem(DRAFT) } catch { /* ignore */ }
      setF(EMPTY); setFile(null)
      top.current?.scrollIntoView({ behavior: 'smooth' })
    } catch (e) { setServerErr(e.message) } finally { setBusy(false) }
  }

  const age = ageOn(f.dob)
  const fileUrl = useMemo(() => file && URL.createObjectURL(file), [file])

  return (
    <>
      <section className="apply-page" ref={top}>
      <div className="wrap apply-head">
        <div className="label">{s.season_label} · Applications {s.call_dates}</div>
        <h1>Apply to KEYS</h1>
        <p>About 10 minutes, filled in with a parent. No grades, no experience, no coding needed.</p>
      </div>
      <div className="wrap apply-grid">
        <aside className="apply-side">
          <div className="side-key"><StitchKey teeth={done ? 6 : step} color="var(--gold, #d9b46a)" dim="rgba(255,255,255,.14)" size={210} /></div>
          <p className="side-cap">{done ? 'All six steps done. Your key is complete.' : `Step ${step + 1} of 6 · one tooth for every step you finish`}</p>
          <ol className="side-steps">
            {STEPS.map((t, i) => {
              const st = done || i < step ? 'done' : i === step ? 'on' : ''
              return (
                <li key={t}>
                  <button className={st} disabled={!!done || i > step} onClick={() => i < step && go(i)}>
                    <span className="side-n">{st === 'done' ? <Icon name="check" size={18} weight="bold" /> : i + 1}</span>
                    <span className="side-t"><b>{t}</b><small>{STEP_HINTS[i]}</small></span>
                  </button>
                </li>
              )
            })}
          </ol>
          <div className="side-info">
            <div><Icon name="clock" size={20} />About 10 minutes</div>
            <div><Icon name="shield" size={20} />Saved on this device until you send</div>
            <div><Icon name="people" size={20} />A parent fills in step 5</div>
          </div>
        </aside>
        <div className="card apply-card">
          {!s.apps_open && !done ? <Notify dates={s.call_dates} /> : done ? (
            <div className="success">
              <img src={asset("/img/key-small-ink.svg")} alt="" style={{ height: 110, margin: "0 auto" }} />
              <h2 className="form-title" style={{ marginTop: 18 }}>Thank you, {done.name}. Your application is in.</h2>
              <p className="muted">Keep this reference. You and your parent can check the status any time.</p>
              <div className="ref">{done.ref}</div>
              <p className="muted" style={{ maxWidth: 520, margin: '0 auto 26px' }}>Two of our team read every application. If you are shortlisted, we will email <b>{done.email}</b> with a date for the Key Trial: a fun 90-minute group challenge, not an exam.</p>
              <div className="hero-actions" style={{ justifyContent: 'center' }}>
                <Link to="/status" className="btn btn-ink">Check status</Link>
                <Link to="/" className="btn btn-ghost">Back to KEYS</Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mobile-step label">Step {step + 1} of 6 · {STEPS[step]}</div>
              <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" {...bind('website')} />

              {step === 0 && <>
                <h2 className="form-title">About you</h2>
                <p className="form-sub">The student fills in this part. We only use it to run the season.</p>
                <div className="grid2">
                  <Field label="First name" req error={errors.first_name}><input {...bind('first_name')} autoComplete="given-name" /></Field>
                  <Field label="Last name" req error={errors.last_name}><input {...bind('last_name')} autoComplete="family-name" /></Field>
                  <Field label="Date of birth" req error={errors.dob} hint={age != null && !errors.dob ? `You will be ${age} when the season starts.` : `Ages ${MIN_AGE} to ${MAX_AGE} on 1 April 2027`}>
                    <input type="date" {...bind('dob')} max="2015-12-31" min="2008-01-01" />
                  </Field>
                  <Field label="I am a" req error={errors.gender}>
                    <div className="chips">{[['girl', 'Girl'], ['boy', 'Boy']].map(([k, l]) => <button type="button" key={k} className={`chip ${f.gender === k ? 'on' : ''}`} onClick={() => set('gender', k)}>{l}</button>)}</div>
                  </Field>
                  <Field label="School" req error={errors.school} hint="Never published."><input {...bind('school')} /></Field>
                  <Field label="Grade"><select {...bind('grade')}><option value="">Choose</option>{[7, 8, 9, 10, 11, 12].map(g => <option key={g}>Grade {g}</option>)}</select></Field>
                  <Field label="Area of Amman" hint="Helps us plan pickup. Never published."><input {...bind('area')} /></Field>
                </div>
              </>}

              {step === 1 && <>
                <h2 className="form-title">What you like</h2>
                <p className="form-sub">There are no wrong answers. This helps us build balanced teams and match you to a problem.</p>
                <Field label="What do you enjoy? Pick any.">
                  <div className="chips">{INTERESTS.map(x => <button type="button" key={x} className={`chip ${f.interests.includes(x) ? 'on' : ''}`} onClick={() => toggle('interests', x)}>{x}</button>)}</div>
                </Field>
                <Field label="Which kinds of problems would you like to work on?" req error={errors.themes}>
                  <div className="chips">{THEMES.map(t => <button type="button" key={t.key} className={`chip ${f.themes.includes(t.key) ? 'on' : ''}`} onClick={() => toggle('themes', t.key)}>{t.label}</button>)}</div>
                </Field>
                <Field label="In a team, which one sounds most like you?" hint="Roles rotate during the season, so you will try them all.">
                  <div>{ROLES.map(r => (
                    <button type="button" key={r.key} className={`choice ${f.self_role === r.key ? 'on' : ''}`} onClick={() => set('self_role', r.key)}>
                      <b>{r.short}</b><span><strong>{r.label}</strong><br /><span className="muted">{r.note}</span></span>
                    </button>
                  ))}</div>
                </Field>
                <Field label="Have you tried robotics, coding or making things before?" hint="Optional. None is perfectly fine."><textarea {...bind('experience')} rows={3} /></Field>
              </>}

              {step === 2 && <>
                <h2 className="form-title">Piece 1 · Show us something</h2>
                <p className="form-sub">Something you fixed or built: a toy, a bike, a game, a drawing, a recipe, anything. What went wrong, and what did you try?</p>
                <Field label="Tell us about it" error={errors.piece1} hint="A few sentences is enough.">
                  <textarea {...bind('piece1_text')} rows={5} placeholder="I fixed..." />
                </Field>
                <div className={`drop ${file ? 'has' : ''}`}>
                  {file ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span>✓ <b>{file.name}</b> · {(file.size / 1024 / 1024).toFixed(1)} MB</span>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setFile(null)}>Remove</button>
                      </div>
                      {file.type.startsWith('image/') && <img src={fileUrl} alt="Your upload" style={{ maxHeight: 220, marginTop: 14, borderRadius: 8 }} />}
                      {file.type.startsWith('audio/') && <audio controls src={fileUrl} style={{ width: '100%', marginTop: 14 }} />}
                    </div>
                  ) : (
                    <>
                      <div>Add a photo, a drawing or a 1-minute voice note <span className="muted">(optional, up to 15 MB)</span></div>
                      <div className="drop-row">
                        <label className="btn btn-ink btn-sm">Upload a file<input type="file" accept="image/*,audio/*,video/*,application/pdf" onChange={pickFile} hidden /></label>
                        <VoiceRecorder onDone={x => { setFile(x); setErrors({}) }} />
                      </div>
                    </>
                  )}
                </div>
              </>}

              {step === 3 && <>
                <h2 className="form-title">Piece 2 · Tech mini-challenge</h2>
                <p className="form-sub">Pick one problem and tell us how tech could solve it. No coding needed. A good idea beats a perfect drawing.</p>
                <Field label="Pick one" req error={errors.challenge}>
                  <div>{CHALLENGES.map((c, i) => (
                    <button type="button" key={i} className={`choice ${f.challenge === i ? 'on' : ''}`} onClick={() => set('challenge', i)}><b>{i + 1}</b><span>{c}</span></button>
                  ))}</div>
                </Field>
                <Field label="Who does it help?" req error={errors.ch_who}><textarea {...bind('ch_who')} rows={2} /></Field>
                <Field label="How does it work, in simple steps?" req error={errors.ch_how} hint="Step 1, step 2, step 3 is perfect."><textarea {...bind('ch_how')} rows={5} /></Field>
                <Field label="How would you test that it works?"><textarea {...bind('ch_test')} rows={2} /></Field>
              </>}

              {step === 4 && <>
                <h2 className="form-title">For a parent or guardian</h2>
                <p className="form-sub">Please fill this part together. Applying is free; the season seat price is shared with picked families.</p>
                <div className="grid2">
                  <Field label="Parent or guardian name" req error={errors.parent_name}><input {...bind('parent_name')} autoComplete="name" /></Field>
                  <Field label="Relationship"><select {...bind('parent_relation')}><option value="">Choose</option>{['Mother', 'Father', 'Guardian', 'Other'].map(x => <option key={x}>{x}</option>)}</select></Field>
                  <Field label="Email" req error={errors.parent_email} hint="We send updates here."><input type="email" {...bind('parent_email')} autoComplete="email" /></Field>
                  <Field label="Mobile" req error={errors.parent_phone}><input type="tel" {...bind('parent_phone')} autoComplete="tel" placeholder="07..." /></Field>
                  <Field label="How did you hear about KEYS?"><select {...bind('heard')}><option value="">Choose</option>{HEARD.map(x => <option key={x}>{x}</option>)}</select></Field>
                  <Field label="Allergies or health notes" hint="Optional. Shared only with staff."><input {...bind('allergies')} /></Field>
                </div>
                <div style={{ marginTop: 18 }}>
                  <Field label="Any sessions your child might miss in April to May?" hint="Optional. Be honest, it helps us plan."><input {...bind('missed_sessions')} /></Field>
                </div>
                {errors.consent && <div className="alert alert-bad">{errors.consent}</div>}
                <label className="check"><input type="checkbox" checked={f.commit_sessions} onChange={e => set('commit_sessions', e.target.checked)} /><span><b>Commitment *</b> My child can attend the 16 sessions (two a week after school, April to May 2027) and the Vault night.</span></label>
                <label className="check"><input type="checkbox" checked={f.parent_confirms} onChange={e => set('parent_confirms', e.target.checked)} /><span><b>Parent confirms *</b> I am the parent or guardian, I filled this in with my child, and I can arrange pickup and drop-off.</span></label>
                <label className="check"><input type="checkbox" checked={f.consent_data} onChange={e => set('consent_data', e.target.checked)} /><span><b>Data *</b> KEYS may store this application to run selection. Only the data needed, stored securely, deleted on request.</span></label>
                <label className="check"><input type="checkbox" checked={f.photo_consent} onChange={e => set('photo_consent', e.target.checked)} /><span><b>Photos (optional)</b> My child may appear in KEYS photos and video. You can change this any time. Schools and home areas are never published.</span></label>
              </>}

              {step === 5 && <>
                <h2 className="form-title">Check and send</h2>
                <p className="form-sub">Look it over. Tap a step above to change anything.</p>
                {serverErr && <div className="alert alert-bad">{serverErr}</div>}
                <div className="review">
                  <h4>Student</h4>
                  <dl>
                    <dt>Name</dt><dd>{f.first_name} {f.last_name}</dd>
                    <dt>Age on 1 April 2027</dt><dd>{age}</dd>
                    <dt>School</dt><dd>{f.school} {f.grade && `· ${f.grade}`}</dd>
                    <dt>Interests</dt><dd>{f.interests.join(', ') || '—'}</dd>
                    <dt>Problem areas</dt><dd>{f.themes.map(t => THEMES.find(x => x.key === t)?.label).join(', ')}</dd>
                    <dt>Sounds like me</dt><dd>{ROLES.find(r => r.key === f.self_role)?.label || '—'}</dd>
                  </dl>
                  <h4>Show us something</h4>
                  <dl><dt>Story</dt><dd>{f.piece1_text || '—'}</dd><dt>File</dt><dd>{file?.name || '—'}</dd></dl>
                  <h4>Mini-challenge</h4>
                  <dl>
                    <dt>Problem</dt><dd>{CHALLENGES[f.challenge]}</dd>
                    <dt>Who it helps</dt><dd>{f.ch_who}</dd>
                    <dt>How it works</dt><dd>{f.ch_how}</dd>
                    <dt>How to test</dt><dd>{f.ch_test || '—'}</dd>
                  </dl>
                  <h4>Parent</h4>
                  <dl>
                    <dt>Name</dt><dd>{f.parent_name} {f.parent_relation && `(${f.parent_relation})`}</dd>
                    <dt>Contact</dt><dd>{f.parent_email} · {f.parent_phone}</dd>
                    <dt>Photo consent</dt><dd>{f.photo_consent ? 'Yes' : 'No'}</dd>
                  </dl>
                </div>
              </>}

              <div className="form-nav">
                {step > 0 ? <button className="btn btn-ghost" onClick={() => go(step - 1)}>← Back</button> : <span />}
                {step < 5
                  ? <button className="btn btn-ink arrow" onClick={next}>Next</button>
                  : <button className="btn btn-ink" onClick={submit} disabled={busy}>{busy ? 'Sending…' : 'Send my application'}</button>}
              </div>
              <p className="label" style={{ marginTop: 16, textAlign: 'center' }}>Your answers are saved on this device until you send them{file ? ' (the file is not, so keep this tab open)' : ''}.</p>
            </>
          )}
        </div>
      </div>
      </section>
    </>
  )
}

function Notify({ dates }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [state, setState] = useState('')
  async function send(e) {
    e.preventDefault()
    try { await api('/api/notify', { method: 'POST', body: { email, name } }); setState('ok') } catch (err) { setState(err.message) }
  }
  return (
    <div>
      <h2 className="form-title">Applications open {dates}.</h2>
      <p className="form-sub">{STATIC ? 'Until then, read how the season works and get your two pieces ready.' : "Leave a parent's email and we will tell you the day the form opens."}</p>
      {STATIC ? <div className="static-note"><b>Coming 1 March 2027.</b> The application form opens on the first day of the open call. Read how it works and get ready.</div> : state === 'ok' ? <div className="alert alert-ok">Thank you. We will email you when applications open.</div> : (
        <form onSubmit={send}>
          {state && <div className="alert alert-bad">{state}</div>}
          <div className="grid2">
            <Field label="Parent name"><input value={name} onChange={e => setName(e.target.value)} /></Field>
            <Field label="Parent email" req><input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></Field>
          </div>
          <button className="btn btn-red" style={{ marginTop: 22 }}>Notify me</button>
        </form>
      )}
    </div>
  )
}
