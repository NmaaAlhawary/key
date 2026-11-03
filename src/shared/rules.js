// Shared by the site, the admin and the API, so the numbers never drift apart.

// Selection rubric from the Pilot Playbook: each criterion 1 to 5, two staff score separately.
export const CRITERIA = [
  { key: 'teamwork', label: 'Teamwork', weight: 30, source: 'Watched at the Key Trial', low: 'Works alone or takes over', high: 'Listens, shares, lifts others' },
  { key: 'curiosity', label: 'Curiosity', weight: 20, source: '"Show us something"', low: 'Nothing shown', high: 'A story of trying, failing, fixing' },
  { key: 'tech', label: 'Tech thinking', weight: 20, source: 'The mini-challenge', low: 'No idea', high: 'A simple, clear fix for a real person' },
  { key: 'commitment', label: 'Commitment', weight: 15, source: '16 sessions, parent confirms', low: 'Will miss more than 3 sessions', high: 'Full attendance confirmed' },
  { key: 'fairmix', label: 'Fair mix', weight: 15, source: 'Across the whole group', low: 'Adds little to the balance', high: 'Brings a voice the group is missing' },
]

// Average each criterion across reviewers, then weight to a score out of 100.
export function summarise(scores) {
  const avg = {}
  let done = 0, total = 0
  for (const c of CRITERIA) {
    const vals = scores.map(s => s[c.key]).filter(v => v != null)
    if (vals.length) {
      avg[c.key] = vals.reduce((a, b) => a + b, 0) / vals.length
      total += (avg[c.key] / 5) * c.weight
      done++
    } else avg[c.key] = null
  }
  return { avg, done, total: done ? Math.round(total * 10) / 10 : null, complete: done === CRITERIA.length, reviewers: scores.length }
}

export const STATUSES = [
  { key: 'submitted', label: 'New', public: 'Received. We are reading every application.' },
  { key: 'shortlisted', label: 'Key Trial', public: 'Invited to the Key Trial. Check your email for the day and time.' },
  { key: 'selected', label: 'Picked', public: 'Picked for season one. Welcome to KEYS.' },
  { key: 'waitlist', label: 'Waiting list', public: 'On the waiting list, with priority for next season.' },
  { key: 'declined', label: 'Not this time', public: 'Not picked this season. Thank you for applying. You are welcome to apply again.' },
  { key: 'withdrawn', label: 'Withdrawn', public: 'Withdrawn.' },
]
export const statusOf = k => STATUSES.find(s => s.key === k) || STATUSES[0]

export const ROLES = [
  { key: 'captain', label: 'Captain', short: 'C', note: 'Keeps time, gets quiet ones to speak' },
  { key: 'coder', label: 'Coder', short: 'CO', note: 'Thinks in steps: "if this, then that"' },
  { key: 'builder', label: 'Builder', short: 'B', note: 'Grabs the materials, tests again and again' },
  { key: 'researcher', label: 'Researcher', short: 'R', note: 'Asks who has the problem and why' },
  { key: 'storyteller', label: 'Storyteller', short: 'S', note: 'Explains the idea best' },
]

// Problem themes a student can pick in the form; each team is matched to one.
export const THEMES = [
  { key: 'people', label: 'Helping people use technology' },
  { key: 'city', label: 'Deliveries, streets and the city' },
  { key: 'planet', label: 'Food, waste and the planet' },
  { key: 'money', label: 'Money and saving' },
  { key: 'health', label: 'Health and waiting rooms' },
  { key: 'water', label: 'Water and the home' },
]

export const CHALLENGES = [
  'Your grandmother forgets her medicine. How could tech help her remember?',
  'The plants at your school die over the weekend. Design something that saves them.',
  'Students wait for the bus in the sun and never know when it comes. What would you build?',
]

// Age on the first day of the season decides eligibility (13 to 16).
export const SEASON_START = '2027-04-01'
export const MIN_AGE = 13, MAX_AGE = 16
export function ageOn(dob, on = SEASON_START) {
  const d = new Date(dob), t = new Date(on)
  if (isNaN(d)) return null
  let a = t.getFullYear() - d.getFullYear()
  if (t.getMonth() < d.getMonth() || (t.getMonth() === d.getMonth() && t.getDate() < d.getDate())) a--
  return a
}

// The five team rules from the playbook, checked against a team's members.
export function teamChecks(team, members) {
  const roles = new Set(members.map(m => m.final_role || m.trial_role).filter(Boolean))
  const schools = members.map(m => (m.school || '').trim().toLowerCase()).filter(Boolean)
  const girls = members.filter(m => m.gender === 'girl').length
  const boys = members.filter(m => m.gender === 'boy').length
  const ages = members.map(m => m.age).filter(Boolean)
  const matched = members.filter(m => (m.themes || []).includes(team.theme)).length
  return [
    { label: 'Five members', ok: members.length === 5, detail: `${members.length} of 5` },
    { label: 'All 5 roles', ok: ROLES.every(r => roles.has(r.key)), detail: `${roles.size} of 5 roles` },
    { label: 'New faces', ok: new Set(schools).size === schools.length, detail: new Set(schools).size === schools.length ? 'No two from one school' : 'Two from the same school' },
    { label: 'Girls and boys', ok: girls >= 2 && boys >= 2, detail: `${girls} girls, ${boys} boys` },
    { label: 'Mixed ages', ok: ages.length > 1 && Math.max(...ages) - Math.min(...ages) >= 2, detail: ages.length ? `Ages ${Math.min(...ages)} to ${Math.max(...ages)}` : 'No ages' },
    { label: 'Right problem', ok: members.length > 0 && matched >= Math.ceil(members.length / 2), detail: `${matched} picked this theme` },
  ]
}
