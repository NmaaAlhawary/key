import express from 'express'
import multer from 'multer'
import { randomBytes } from 'node:crypto'
import { existsSync, unlinkSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { db, UPLOAD_DIR, getSettings, newRef, hashPassword, checkPassword } from './db.js'
import { CRITERIA, summarise, statusOf, STATUSES, ROLES, THEMES, TRACKS, ageOn, MIN_AGE, MAX_AGE } from '../src/shared/rules.js'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT || (process.env.NODE_ENV === 'production' ? 5208 : 8792))
const app = express()
app.use(express.json({ limit: '1mb' }))

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${randomBytes(6).toString('hex')}${path.extname(file.originalname).toLowerCase().slice(0, 8)}`),
  }),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, /^(image|audio|video)\//.test(file.mimetype) || file.mimetype === 'application/pdf'),
})

const clean = (v, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const fail = (res, code, error) => res.status(code).json({ error })

// ---------- public ----------

app.get('/api/public/settings', (_req, res) => {
  const s = getSettings()
  res.json({ apps_open: s.apps_open === 'true', call_dates: s.call_dates, season_label: s.season_label, seat_price: s.seat_price })
})

app.post('/api/applications', upload.single('piece1File'), (req, res) => {
  const drop = () => req.file && unlinkSync(req.file.path)
  if (getSettings().apps_open !== 'true') { drop(); return fail(res, 403, 'Applications are closed right now.') }
  let p
  try { p = JSON.parse(req.body.payload || '{}') } catch { drop(); return fail(res, 400, 'Bad form data.') }
  if (p.website) { drop(); return res.json({ ref: 'KEYS-27-0000' }) } // honeypot

  const age = ageOn(p.dob)
  const errors = []
  if (!clean(p.first_name) || !clean(p.last_name)) errors.push('Student name')
  if (age == null || age < MIN_AGE || age > MAX_AGE) errors.push(`Age ${MIN_AGE} to ${MAX_AGE} on 1 April 2027`)
  if (!['girl', 'boy'].includes(p.gender)) errors.push('Gender')
  if (!clean(p.school)) errors.push('School')
  if (!clean(p.piece1_text) && !req.file) errors.push('Show us something')
  if (![0, 1].includes(p.challenge) || !TRACKS.some(t => t.key === p.ch_track) || !clean(p.ch_obvious) || (!clean(p.ch_answer) && !clean(p.ch_link))) errors.push('Key Challenge')
  if (!clean(p.parent_name) || !isEmail(clean(p.parent_email)) || !clean(p.parent_phone)) errors.push('Parent details')
  if (!p.commit_sessions || !p.consent_data || !p.parent_confirms) errors.push('Commitment and consent')
  if (errors.length) { drop(); return fail(res, 400, `Please check: ${errors.join(', ')}.`) }

  const dup = db.prepare(`SELECT ref FROM applications WHERE lower(first_name)=lower(?) AND lower(last_name)=lower(?) AND dob=? AND status!='withdrawn'`)
    .get(clean(p.first_name), clean(p.last_name), p.dob)
  if (dup) { drop(); return fail(res, 409, `This student has already applied (reference ${dup.ref}).`) }

  const data = {
    area: clean(p.area, 120), interests: (p.interests || []).slice(0, 10), themes: (p.themes || []).filter(t => THEMES.some(x => x.key === t)),
    self_role: ROLES.some(r => r.key === p.self_role) ? p.self_role : '', experience: clean(p.experience, 600),
    piece1_text: clean(p.piece1_text, 3000), ch_track: p.ch_track, ch_obvious: clean(p.ch_obvious, 1500), ch_answer: clean(p.ch_answer, 4000), ch_link: /^https?:\/\//i.test(clean(p.ch_link)) ? clean(p.ch_link, 500) : '',
    parent_relation: clean(p.parent_relation, 60), heard: clean(p.heard, 80), allergies: clean(p.allergies, 400),
    missed_sessions: clean(p.missed_sessions, 400), photo_consent: !!p.photo_consent,
    commit_sessions: !!p.commit_sessions, consent_data: !!p.consent_data, parent_confirms: !!p.parent_confirms,
  }
  const ref = newRef()
  const r = db.prepare(`INSERT INTO applications (ref, first_name, last_name, dob, age, gender, school, grade, parent_name, parent_email, parent_phone, challenge, data, file_name, file_path, file_type)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
    ref, clean(p.first_name, 60), clean(p.last_name, 60), p.dob, age, p.gender, clean(p.school, 120), clean(p.grade, 20),
    clean(p.parent_name, 120), clean(p.parent_email, 160).toLowerCase(), clean(p.parent_phone, 40), p.challenge, JSON.stringify(data),
    req.file?.originalname?.slice(0, 120) || null, req.file?.filename || null, req.file?.mimetype || null)
  db.prepare('INSERT INTO activity (app_id, kind, body) VALUES (?, ?, ?)').run(r.lastInsertRowid, 'status', 'Application submitted')
  res.json({ ref })
})

app.post('/api/status', (req, res) => {
  const ref = clean(req.body.ref, 20).toUpperCase(), email = clean(req.body.email, 160).toLowerCase()
  const a = db.prepare('SELECT status, first_name, created_at FROM applications WHERE ref = ? AND parent_email = ?').get(ref, email)
  if (!a) return fail(res, 404, 'We could not find that reference with that email.')
  const hide = getSettings().publish_results !== 'true' && ['selected', 'waitlist', 'declined'].includes(a.status)
  res.json({ first_name: a.first_name, submitted: a.created_at, message: statusOf(hide ? 'submitted' : a.status).public })
})

app.post('/api/notify', (req, res) => {
  const email = clean(req.body.email, 160).toLowerCase()
  if (!isEmail(email)) return fail(res, 400, 'Please enter a valid email.')
  if (!db.prepare('SELECT 1 FROM notify WHERE email = ?').get(email))
    db.prepare('INSERT INTO notify (name, email) VALUES (?, ?)').run(clean(req.body.name, 120), email)
  res.json({ ok: true })
})

// Signed, real partners only: their logos appear on the home page.
app.get('/api/public/partners', (_req, res) => {
  res.json(db.prepare(`SELECT p.id, p.org, p.kind, t.sector AS team_sector, p.logo_path IS NOT NULL AS has_logo
    FROM partners p LEFT JOIN teams t ON t.id = p.team_id WHERE p.status = 'signed' AND p.is_demo = 0 ORDER BY p.id`).all())
})

app.get('/api/public/logo/:id', (req, res) => {
  const p = db.prepare(`SELECT logo_path FROM partners WHERE id = ? AND status = 'signed'`).get(req.params.id)
  const f = p?.logo_path && path.join(UPLOAD_DIR, path.basename(p.logo_path))
  if (!f || !existsSync(f)) return fail(res, 404, 'No logo.')
  res.sendFile(f)
})

app.post('/api/partners', (req, res) => {
  const b = req.body
  if (b.website) return res.json({ ok: true })
  if (!clean(b.org) || !clean(b.contact_name) || !isEmail(clean(b.email))) return fail(res, 400, 'Please add your organisation, name and a valid email.')
  const r = db.prepare('INSERT INTO partners (org, kind, sector, contact_name, role, email, phone, message) VALUES (?,?,?,?,?,?,?,?)')
    .run(clean(b.org, 160), clean(b.kind, 40), clean(b.sector, 80), clean(b.contact_name, 120), clean(b.role, 120), clean(b.email, 160).toLowerCase(), clean(b.phone, 40), clean(b.message, 3000))
  db.prepare('INSERT INTO activity (partner_id, kind, body) VALUES (?, ?, ?)').run(r.lastInsertRowid, 'status', 'Enquiry received from the website')
  res.json({ ok: true })
})

// ---------- admin auth ----------

const tries = new Map()
const cookieOf = req => Object.fromEntries((req.headers.cookie || '').split(';').map(c => c.trim().split('=').map(decodeURIComponent)))

function auth(req, res, next) {
  const token = cookieOf(req).keys_sid
  const row = token && db.prepare('SELECT u.id, u.name, u.email, u.role FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ? AND s.expires > ?').get(token, Date.now())
  if (!row) return fail(res, 401, 'Please sign in.')
  req.user = row
  next()
}
const adminOnly = (req, res, next) => (req.user.role === 'admin' ? next() : fail(res, 403, 'Admins only.'))

app.post('/api/admin/login', (req, res) => {
  const ip = req.ip, t = tries.get(ip) || { n: 0, at: Date.now() }
  if (Date.now() - t.at > 15 * 60e3) { t.n = 0; t.at = Date.now() }
  if (t.n >= 10) return fail(res, 429, 'Too many tries. Wait 15 minutes.')
  const u = db.prepare('SELECT * FROM users WHERE email = ?').get(clean(req.body.email, 160).toLowerCase())
  if (!u || !checkPassword(String(req.body.password || ''), u.pass_hash)) { t.n++; tries.set(ip, t); return fail(res, 401, 'Wrong email or password.') }
  tries.delete(ip)
  const token = randomBytes(32).toString('hex')
  db.prepare('INSERT INTO sessions (token, user_id, expires) VALUES (?, ?, ?)').run(token, u.id, Date.now() + 7 * 864e5)
  res.setHeader('Set-Cookie', `keys_sid=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${7 * 86400}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`)
  res.json({ id: u.id, name: u.name, email: u.email, role: u.role })
})

app.post('/api/admin/logout', (req, res) => {
  db.prepare('DELETE FROM sessions WHERE token = ?').run(cookieOf(req).keys_sid || '')
  res.setHeader('Set-Cookie', 'keys_sid=; Path=/; Max-Age=0')
  res.json({ ok: true })
})

app.use('/api/admin', auth)
app.get('/api/admin/me', (req, res) => res.json(req.user))

// ---------- admin: applications ----------

const parseApp = a => ({ ...a, data: JSON.parse(a.data) })
function scoresFor(id) {
  return db.prepare('SELECT s.*, u.name AS reviewer FROM scores s JOIN users u ON u.id = s.user_id WHERE s.app_id = ? ORDER BY u.name').all(id)
}
function listApps() {
  const all = db.prepare('SELECT a.*, t.name AS team_name FROM applications a LEFT JOIN teams t ON t.id = a.team_id ORDER BY a.created_at DESC').all()
  const scoreRows = db.prepare('SELECT * FROM scores').all()
  return all.map(a => {
    const d = JSON.parse(a.data)
    const s = summarise(scoreRows.filter(r => r.app_id === a.id))
    return {
      id: a.id, ref: a.ref, status: a.status, first_name: a.first_name, last_name: a.last_name, age: a.age, gender: a.gender,
      school: a.school, grade: a.grade, challenge: a.challenge, parent_email: a.parent_email, parent_phone: a.parent_phone, parent_name: a.parent_name,
      team_id: a.team_id, team_name: a.team_name, trial_role: a.trial_role, final_role: a.final_role, self_role: d.self_role,
      themes: d.themes, heard: d.heard, has_file: !!a.file_path, photo_consent: d.photo_consent, is_demo: a.is_demo,
      created_at: a.created_at, score: s.total, score_done: s.done, score_complete: s.complete, reviewers: s.reviewers,
    }
  })
}

app.get('/api/admin/applications', (req, res) => {
  const mineIds = new Set(db.prepare('SELECT app_id FROM scores WHERE user_id = ?').all(req.user.id).map(r => r.app_id))
  res.json(listApps().map(a => ({ ...a, mine: mineIds.has(a.id) })))
})

app.get('/api/admin/applications.csv', (_req, res) => {
  const cols = ['ref', 'status', 'first_name', 'last_name', 'age', 'gender', 'school', 'grade', 'parent_name', 'parent_email', 'parent_phone', 'challenge', 'self_role', 'trial_role', 'final_role', 'team_name', 'score', 'reviewers', 'heard', 'photo_consent', 'created_at']
  const esc = v => { const s = Array.isArray(v) ? v.join('; ') : v == null ? '' : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
  const rows = listApps().map(a => cols.map(c => esc(c === 'challenge' ? a.challenge + 1 : a[c])).join(','))
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="keys-applications-${new Date().toISOString().slice(0, 10)}.csv"`)
  res.send('﻿' + [cols.join(','), ...rows].join('\n'))
})

app.get('/api/admin/applications/:id', (req, res) => {
  const a = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id)
  if (!a) return fail(res, 404, 'Not found.')
  const scores = scoresFor(a.id)
  const activity = db.prepare('SELECT ac.*, u.name AS who FROM activity ac LEFT JOIN users u ON u.id = ac.user_id WHERE ac.app_id = ? ORDER BY ac.created_at DESC, ac.id DESC').all(a.id)
  const ids = db.prepare('SELECT id FROM applications ORDER BY created_at DESC').all().map(r => r.id)
  const i = ids.indexOf(a.id)
  res.json({ ...parseApp(a), file_path: undefined, has_file: !!a.file_path, scores, summary: summarise(scores), activity, prev: ids[i - 1] || null, next: ids[i + 1] || null })
})

app.patch('/api/admin/applications/:id', (req, res) => {
  const a = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id)
  if (!a) return fail(res, 404, 'Not found.')
  const b = req.body, log = []
  if (b.status !== undefined && b.status !== a.status) {
    if (!STATUSES.some(s => s.key === b.status)) return fail(res, 400, 'Unknown status.')
    db.prepare('UPDATE applications SET status = ? WHERE id = ?').run(b.status, a.id)
    log.push(`Status: ${statusOf(a.status).label} → ${statusOf(b.status).label}`)
  }
  for (const k of ['trial_role', 'final_role']) {
    if (b[k] !== undefined && b[k] !== a[k]) {
      if (b[k] && !ROLES.some(r => r.key === b[k])) return fail(res, 400, 'Unknown role.')
      db.prepare(`UPDATE applications SET ${k} = ? WHERE id = ?`).run(b[k] || null, a.id)
      log.push(`${k === 'trial_role' ? 'Key Trial role' : 'Team role'}: ${ROLES.find(r => r.key === b[k])?.label || 'none'}`)
    }
  }
  if (b.team_id !== undefined && b.team_id !== a.team_id) {
    const team = b.team_id ? db.prepare('SELECT * FROM teams WHERE id = ?').get(b.team_id) : null
    if (b.team_id && !team) return fail(res, 400, 'Unknown team.')
    if (team && db.prepare('SELECT COUNT(*) n FROM applications WHERE team_id = ? AND id != ?').get(team.id, a.id).n >= 5) return fail(res, 400, `${team.name} already has 5 members.`)
    db.prepare('UPDATE applications SET team_id = ? WHERE id = ?').run(team?.id || null, a.id)
    log.push(team ? `Placed in ${team.name}` : 'Removed from team')
  }
  db.prepare('UPDATE applications SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(a.id)
  for (const l of log) db.prepare('INSERT INTO activity (app_id, user_id, kind, body) VALUES (?, ?, ?, ?)').run(a.id, req.user.id, 'status', l)
  res.json({ ok: true })
})

app.put('/api/admin/applications/:id/score', (req, res) => {
  const a = db.prepare('SELECT id FROM applications WHERE id = ?').get(req.params.id)
  if (!a) return fail(res, 404, 'Not found.')
  const v = {}
  for (const c of CRITERIA) {
    const n = req.body[c.key]
    v[c.key] = n == null || n === '' ? null : Math.max(1, Math.min(5, Math.round(Number(n))))
  }
  db.prepare(`INSERT INTO scores (app_id, user_id, teamwork, curiosity, tech, commitment, fairmix, comment, updated_at)
    VALUES (?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)
    ON CONFLICT(app_id, user_id) DO UPDATE SET teamwork=excluded.teamwork, curiosity=excluded.curiosity, tech=excluded.tech,
    commitment=excluded.commitment, fairmix=excluded.fairmix, comment=excluded.comment, updated_at=CURRENT_TIMESTAMP`)
    .run(a.id, req.user.id, v.teamwork, v.curiosity, v.tech, v.commitment, v.fairmix, clean(req.body.comment, 2000))
  db.prepare('INSERT INTO activity (app_id, user_id, kind, body) VALUES (?, ?, ?, ?)').run(a.id, req.user.id, 'score', 'Saved a score')
  res.json({ ok: true })
})

app.post('/api/admin/applications/:id/notes', (req, res) => {
  const body = clean(req.body.body, 3000)
  if (!body) return fail(res, 400, 'Empty note.')
  db.prepare('INSERT INTO activity (app_id, user_id, kind, body) VALUES (?, ?, ?, ?)').run(req.params.id, req.user.id, 'note', body)
  res.json({ ok: true })
})

app.get('/api/admin/files/:id', (req, res) => {
  const a = db.prepare('SELECT file_path, file_type, file_name FROM applications WHERE id = ?').get(req.params.id)
  const p = a?.file_path && path.join(UPLOAD_DIR, path.basename(a.file_path))
  if (!p || !existsSync(p)) return fail(res, 404, 'No file.')
  res.setHeader('Content-Type', a.file_type)
  res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(a.file_name || 'file')}"`)
  res.sendFile(p)
})

// ---------- admin: stats ----------

app.get('/api/admin/stats', (_req, res) => {
  const apps = listApps()
  const count = (arr, f) => arr.reduce((m, x) => { const k = f(x) ?? 'Unknown'; m[k] = (m[k] || 0) + 1; return m }, {})
  const byStatus = count(apps, a => a.status)
  const days = count(apps, a => a.created_at.slice(0, 10))
  res.json({
    total: apps.length, byStatus,
    gender: count(apps, a => a.gender), age: count(apps, a => a.age), challenge: count(apps, a => a.challenge + 1),
    heard: count(apps, a => a.heard || 'Not said'), schools: new Set(apps.map(a => a.school.toLowerCase())).size,
    days: Object.entries(days).sort(([a], [b]) => a.localeCompare(b)).slice(-21),
    unscored: apps.filter(a => a.reviewers === 0 && a.status !== 'withdrawn').length,
    needSecond: apps.filter(a => a.reviewers === 1).length,
    partnersSigned: db.prepare(`SELECT COUNT(*) n FROM partners WHERE status = 'signed' AND kind = 'Lock Partner'`).get().n,
    partnersOpen: db.prepare(`SELECT COUNT(*) n FROM partners WHERE status IN ('new','talking')`).get().n,
    notify: db.prepare('SELECT COUNT(*) n FROM notify').get().n,
    placed: apps.filter(a => a.team_id).length,
    demo: apps.filter(a => a.is_demo).length,
  })
})

// ---------- admin: teams ----------

app.get('/api/admin/teams', (_req, res) => {
  const teams = db.prepare('SELECT * FROM teams ORDER BY id').all()
  const apps = listApps()
  res.json({ teams: teams.map(t => ({ ...t, members: apps.filter(a => a.team_id === t.id) })), pool: apps.filter(a => a.status === 'selected' && !a.team_id) })
})

app.patch('/api/admin/teams/:id', (req, res) => {
  const t = db.prepare('SELECT * FROM teams WHERE id = ?').get(req.params.id)
  if (!t) return fail(res, 404, 'Not found.')
  const n = { ...t }
  for (const k of ['name', 'sector', 'theme', 'partner', 'problem', 'build']) if (req.body[k] !== undefined) n[k] = clean(req.body[k], 400)
  db.prepare('UPDATE teams SET name=?, sector=?, theme=?, partner=?, problem=?, build=? WHERE id=?').run(n.name, n.sector, n.theme, n.partner, n.problem, n.build, t.id)
  res.json({ ok: true })
})

// ---------- admin: partners ----------

app.get('/api/admin/partners', (_req, res) => {
  res.json(db.prepare('SELECT p.*, t.name AS team_name FROM partners p LEFT JOIN teams t ON t.id = p.team_id ORDER BY p.created_at DESC').all()
    .map(p => ({ ...p, checklist: JSON.parse(p.checklist || '{}') })))
})

app.post('/api/admin/partners', (req, res) => {
  const b = req.body
  if (!clean(b.org)) return fail(res, 400, 'Organisation name is required.')
  const r = db.prepare('INSERT INTO partners (org, kind, sector, contact_name, role, email, phone, message) VALUES (?,?,?,?,?,?,?,?)')
    .run(clean(b.org, 160), clean(b.kind, 40) || 'Lock Partner', clean(b.sector, 80), clean(b.contact_name, 120), clean(b.role, 120), clean(b.email, 160), clean(b.phone, 40), clean(b.message, 3000))
  res.json({ id: r.lastInsertRowid })
})

app.patch('/api/admin/partners/:id', (req, res) => {
  const p = db.prepare('SELECT * FROM partners WHERE id = ?').get(req.params.id)
  if (!p) return fail(res, 404, 'Not found.')
  const b = req.body
  if (b.status !== undefined && b.status !== p.status) {
    db.prepare('UPDATE partners SET status = ? WHERE id = ?').run(clean(b.status, 20), p.id)
    db.prepare('INSERT INTO activity (partner_id, user_id, kind, body) VALUES (?, ?, ?, ?)').run(p.id, req.user.id, 'status', `Status → ${b.status}`)
  }
  if (b.checklist !== undefined) db.prepare('UPDATE partners SET checklist = ? WHERE id = ?').run(JSON.stringify(b.checklist), p.id)
  if (b.team_id !== undefined) db.prepare('UPDATE partners SET team_id = ? WHERE id = ?').run(b.team_id || null, p.id)
  for (const k of ['org', 'kind', 'sector', 'contact_name', 'role', 'email', 'phone', 'message'])
    if (b[k] !== undefined) db.prepare(`UPDATE partners SET ${k} = ? WHERE id = ?`).run(clean(b[k], 3000), p.id)
  if (b.note) db.prepare('INSERT INTO activity (partner_id, user_id, kind, body) VALUES (?, ?, ?, ?)').run(p.id, req.user.id, 'note', clean(b.note, 2000))
  res.json({ ok: true })
})

app.get('/api/admin/partners/:id/activity', (req, res) => {
  res.json(db.prepare('SELECT ac.*, u.name AS who FROM activity ac LEFT JOIN users u ON u.id = ac.user_id WHERE ac.partner_id = ? ORDER BY ac.created_at DESC, ac.id DESC').all(req.params.id))
})

const logoUpload = multer({
  storage: upload.storage, limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, /^image\/(png|jpeg|svg\+xml|webp)$/.test(file.mimetype)),
})
app.post('/api/admin/partners/:id/logo', logoUpload.single('logo'), (req, res) => {
  const p = db.prepare('SELECT logo_path FROM partners WHERE id = ?').get(req.params.id)
  if (!p) { if (req.file) unlinkSync(req.file.path); return fail(res, 404, 'Not found.') }
  if (!req.file) return fail(res, 400, 'Upload a PNG, JPG, SVG or WebP logo under 3 MB.')
  if (p.logo_path && existsSync(path.join(UPLOAD_DIR, p.logo_path))) unlinkSync(path.join(UPLOAD_DIR, p.logo_path))
  db.prepare('UPDATE partners SET logo_path = ? WHERE id = ?').run(req.file.filename, req.params.id)
  res.json({ ok: true })
})
app.get('/api/admin/partners/:id/logo', (req, res) => {
  const p = db.prepare('SELECT logo_path FROM partners WHERE id = ?').get(req.params.id)
  const f = p?.logo_path && path.join(UPLOAD_DIR, path.basename(p.logo_path))
  if (!f || !existsSync(f)) return fail(res, 404, 'No logo.')
  res.sendFile(f)
})

app.delete('/api/admin/partners/:id', adminOnly, (req, res) => {
  db.prepare('DELETE FROM activity WHERE partner_id = ?').run(req.params.id)
  db.prepare('DELETE FROM partners WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

app.get('/api/admin/notify', (_req, res) => res.json(db.prepare('SELECT * FROM notify ORDER BY created_at DESC').all()))

// ---------- admin: settings and people ----------

app.get('/api/admin/settings', (_req, res) => res.json(getSettings()))
app.patch('/api/admin/settings', adminOnly, (req, res) => {
  for (const k of ['apps_open', 'publish_results', 'season_label', 'call_dates', 'seat_price'])
    if (req.body[k] !== undefined) db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').run(k, String(req.body[k]))
  res.json(getSettings())
})

app.get('/api/admin/users', (_req, res) => res.json(db.prepare('SELECT id, name, email, role, created_at FROM users ORDER BY id').all()))
app.post('/api/admin/users', adminOnly, (req, res) => {
  const email = clean(req.body.email, 160).toLowerCase(), name = clean(req.body.name, 120), pw = String(req.body.password || '')
  if (!name || !isEmail(email) || pw.length < 8) return fail(res, 400, 'Name, valid email and a password of 8+ characters.')
  if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(email)) return fail(res, 409, 'That email already has an account.')
  db.prepare('INSERT INTO users (name, email, pass_hash, role) VALUES (?, ?, ?, ?)').run(name, email, hashPassword(pw), req.body.role === 'admin' ? 'admin' : 'reviewer')
  res.json({ ok: true })
})
app.delete('/api/admin/users/:id', adminOnly, (req, res) => {
  if (Number(req.params.id) === req.user.id) return fail(res, 400, 'You cannot remove yourself.')
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})
app.post('/api/admin/me/password', (req, res) => {
  const u = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)
  if (!checkPassword(String(req.body.current || ''), u.pass_hash)) return fail(res, 400, 'Current password is wrong.')
  if (String(req.body.next || '').length < 8) return fail(res, 400, 'New password needs 8+ characters.')
  db.prepare('UPDATE users SET pass_hash = ? WHERE id = ?').run(hashPassword(req.body.next), u.id)
  res.json({ ok: true })
})

app.delete('/api/admin/demo', adminOnly, (_req, res) => {
  const files = db.prepare('SELECT file_path FROM applications WHERE is_demo = 1 AND file_path IS NOT NULL').all()
  for (const f of files) { const p = path.join(UPLOAD_DIR, f.file_path); if (existsSync(p)) unlinkSync(p) }
  db.prepare('DELETE FROM applications WHERE is_demo = 1').run()
  db.prepare('DELETE FROM activity WHERE partner_id IN (SELECT id FROM partners WHERE is_demo = 1)').run()
  db.prepare('DELETE FROM partners WHERE is_demo = 1').run()
  res.json({ ok: true })
})

app.use('/api', (_req, res) => fail(res, 404, 'Not found.'))
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) return fail(res, 400, err.code === 'LIMIT_FILE_SIZE' ? 'The file is bigger than 15 MB.' : 'Upload problem.')
  console.error(err)
  fail(res, 500, 'Something went wrong.')
})

// Production: serve the built site from the same port.
const DIST = path.join(HERE, '..', 'dist')
if (process.env.NODE_ENV === 'production' && existsSync(DIST)) {
  app.use(express.static(DIST))
  app.get('*', (_req, res) => res.sendFile(path.join(DIST, 'index.html')))
}

app.listen(PORT, '127.0.0.1', () => console.log(`KEYS API on http://127.0.0.1:${PORT}`))
