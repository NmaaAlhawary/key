import { DatabaseSync } from 'node:sqlite'
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
export const DATA_DIR = path.join(HERE, 'data')
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads')
mkdirSync(UPLOAD_DIR, { recursive: true })

export const db = new DatabaseSync(path.join(DATA_DIR, 'keys.db'))
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;')

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
  pass_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'reviewer', created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY, name TEXT NOT NULL, sector TEXT, theme TEXT, partner TEXT, problem TEXT, build TEXT
);
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY, ref TEXT UNIQUE NOT NULL, status TEXT NOT NULL DEFAULT 'submitted',
  first_name TEXT, last_name TEXT, dob TEXT, age INTEGER, gender TEXT, school TEXT, grade TEXT,
  parent_name TEXT, parent_email TEXT, parent_phone TEXT, challenge INTEGER,
  data TEXT NOT NULL, file_name TEXT, file_path TEXT, file_type TEXT,
  team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL, trial_role TEXT, final_role TEXT,
  is_demo INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS scores (
  app_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  teamwork INTEGER, curiosity INTEGER, tech INTEGER, commitment INTEGER, fairmix INTEGER,
  comment TEXT, updated_at TEXT DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (app_id, user_id)
);
CREATE TABLE IF NOT EXISTS activity (
  id INTEGER PRIMARY KEY, app_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
  partner_id INTEGER, user_id INTEGER, kind TEXT NOT NULL, body TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS partners (
  id INTEGER PRIMARY KEY, org TEXT NOT NULL, kind TEXT, sector TEXT, contact_name TEXT, role TEXT,
  email TEXT, phone TEXT, message TEXT, status TEXT NOT NULL DEFAULT 'new', checklist TEXT DEFAULT '{}',
  team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL, is_demo INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS notify (
  id INTEGER PRIMARY KEY, name TEXT, email TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
`)

try { db.exec('ALTER TABLE partners ADD COLUMN logo_path TEXT') } catch { /* already there */ }

const DEFAULT_SETTINGS = {
  apps_open: 'true',
  publish_results: 'false',
  season_label: 'Season one · Amman',
  call_dates: '1 to 14 March 2027',
  seat_price: '350 JOD',
}
for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) {
  db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)').run(k, v)
}

if (db.prepare('SELECT COUNT(*) n FROM teams').get().n === 0) {
  const t = db.prepare('INSERT INTO teams (name, sector, theme, partner, problem, build) VALUES (?, ?, ?, ?, ?, ?)')
  t.run('Team 1', 'Telecom', 'people', '', 'Older people struggle with phone apps.', 'A voice helper that explains an app step by step.')
  t.run('Team 2', 'Logistics', 'city', '', 'Couriers cannot find addresses.', 'A smart parcel box with a keypad lock.')
  t.run('Team 3', 'Hospitality', 'planet', '', 'Too much food is wasted at the buffet.', 'A smart scale that counts daily waste.')
  t.run('Team 4', 'Banking', 'money', '', 'Kids never learn to save.', 'A smart piggy bank that tracks a goal.')
}

export function hashPassword(pw) {
  const salt = randomBytes(16).toString('hex')
  return `${salt}:${scryptSync(pw, salt, 64).toString('hex')}`
}

export function checkPassword(pw, stored) {
  const [salt, hash] = stored.split(':')
  const a = scryptSync(pw, salt, 64)
  const b = Buffer.from(hash, 'hex')
  return a.length === b.length && timingSafeEqual(a, b)
}

// First run: create one admin and write the password to a local file.
if (db.prepare('SELECT COUNT(*) n FROM users').get().n === 0) {
  const email = 'admin@keys.local'
  const pw = randomBytes(6).toString('base64url')
  db.prepare('INSERT INTO users (name, email, pass_hash, role) VALUES (?, ?, ?, ?)').run('Admin', email, hashPassword(pw), 'admin')
  const note = `KEYS admin, first login\n\nEmail:    ${email}\nPassword: ${pw}\n\nChange it in Admin → Settings, then delete this file.\n`
  writeFileSync(path.join(DATA_DIR, 'FIRST-LOGIN.txt'), note)
  console.log('\n' + note)
} else if (existsSync(path.join(DATA_DIR, 'FIRST-LOGIN.txt'))) {
  console.log('First admin login is in server/data/FIRST-LOGIN.txt')
}

export function getSettings() {
  const out = {}
  for (const r of db.prepare('SELECT key, value FROM settings').all()) out[r.key] = r.value
  return out
}

export function newRef() {
  for (;;) {
    const n = Math.floor(1000 + Math.random() * 9000)
    const ref = `KEYS-27-${n}`
    if (!db.prepare('SELECT 1 FROM applications WHERE ref = ?').get(ref)) return ref
  }
}
