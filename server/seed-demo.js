// Fills the database with clearly-marked demo applicants and partners so the admin can be tried out.
// Remove them any time from Admin → Settings → Delete demo data.
import { randomBytes } from 'node:crypto'
import { db, newRef, hashPassword } from './db.js'
import { ageOn, ROLES, THEMES } from '../src/shared/rules.js'

const girls = ['Lina', 'Sara', 'Haya', 'Noor', 'Jana', 'Tala', 'Maryam', 'Dana', 'Leen', 'Yara', 'Rand', 'Farah', 'Aya', 'Salma']
const boys = ['Omar', 'Zaid', 'Yazan', 'Karim', 'Hamza', 'Adam', 'Faris', 'Laith', 'Ahmad', 'Tamer', 'Ali', 'Saif', 'Rami', 'Jad']
const schools = ['School A', 'School B', 'School C', 'School D', 'School E', 'School F', 'School G', 'School H', 'School I', 'School J', 'School K', 'School L']
const heard = ['School', 'Instagram', 'Parent group', 'A friend', 'NGO partner', 'University event']
const pick = a => a[Math.floor(Math.random() * a.length)]
const statuses = [...Array(10).fill('submitted'), ...Array(8).fill('shortlisted'), ...Array(6).fill('selected'), ...Array(3).fill('waitlist'), 'declined']

let reviewer2 = db.prepare(`SELECT id FROM users WHERE email = 'reviewer2.demo@keys.local'`).get()
if (!reviewer2) {
  db.prepare('INSERT INTO users (name, email, pass_hash, role) VALUES (?, ?, ?, ?)').run('Reviewer Two (demo)', 'reviewer2.demo@keys.local', hashPassword(randomBytes(12).toString('hex')), 'reviewer')
  reviewer2 = db.prepare(`SELECT id FROM users WHERE email = 'reviewer2.demo@keys.local'`).get()
}
const admin = db.prepare(`SELECT id FROM users WHERE role = 'admin' ORDER BY id LIMIT 1`).get()

const ins = db.prepare(`INSERT INTO applications (ref, status, first_name, last_name, dob, age, gender, school, grade, parent_name, parent_email, parent_phone, challenge, data, trial_role, is_demo, created_at)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,?)`)
const score = db.prepare('INSERT OR REPLACE INTO scores (app_id, user_id, teamwork, curiosity, tech, commitment, fairmix, comment) VALUES (?,?,?,?,?,?,?,?)')
const r5 = () => 2 + Math.floor(Math.random() * 4)

statuses.forEach((status, i) => {
  const gender = i % 2 ? 'girl' : 'boy'
  const first = gender === 'girl' ? girls[(i >> 1) % girls.length] : boys[(i >> 1) % boys.length]
  const dob = new Date(Date.UTC(2027 - 13 - (i % 4), 2, 1) - ((i * 37) % 300) * 864e5).toISOString().slice(0, 10)
  const created = new Date(Date.now() - (statuses.length - i) * 8 * 3600e3).toISOString().replace('T', ' ').slice(0, 19)
  const data = {
    area: 'Amman', interests: [pick(['Robotics', 'Coding', 'Design']), pick(['Business', 'Storytelling', 'Research'])],
    themes: [THEMES[i % 4].key, pick(THEMES).key], self_role: ROLES[i % 5].key, experience: i % 3 ? 'A little Scratch at school.' : '',
    piece1_text: pick(['I fixed the wheel on my little brother\'s toy car using a bottle cap and glue. The first try fell off, so I added a screw.',
      'I built a cardboard phone stand with a slot for the charger. My mum uses it every day in the kitchen.',
      'I made a small website for my class to vote on the trip. Two friends tested it and found a bug I fixed.',
      'I painted a map of our street so my grandfather can see where the new pharmacy is.']),
    ch_who: 'It helps ' + pick(['my grandmother', 'the school gardener', 'students at the bus stop']) + '.',
    ch_how: '1. A sensor notices the problem. 2. It sends a sound or a light. 3. The person sees it and acts.',
    ch_test: 'Try it for one week and count how many times it worked.',
    parent_relation: pick(['Mother', 'Father']), heard: pick(heard), allergies: i % 7 ? '' : 'Peanuts',
    photo_consent: i % 3 !== 0, commit_sessions: true, consent_data: true, parent_confirms: true, missed_sessions: i % 5 ? '' : 'Might miss one session for a family trip.',
  }
  const r = ins.run(newRef(), status, first, 'Demo', dob, ageOn(dob), gender, schools[i % schools.length], `Grade ${7 + (i % 4)}`,
    `Parent of ${first} (demo)`, `parent${i + 1}.demo@example.com`, '07 0000 0000', i % 3, JSON.stringify(data),
    ['shortlisted', 'selected', 'waitlist', 'declined'].includes(status) ? ROLES[i % 5].key : null, created)
  const id = r.lastInsertRowid
  db.prepare('INSERT INTO activity (app_id, kind, body, created_at) VALUES (?, ?, ?, ?)').run(id, 'status', 'Application submitted', created)
  if (status !== 'submitted' || i % 3 === 0) {
    const trial = status !== 'submitted'
    score.run(id, admin.id, trial ? r5() : null, r5(), r5(), r5(), r5(), '')
    if (i % 2 === 0 || status === 'selected') score.run(id, reviewer2.id, trial ? r5() : null, r5(), r5(), r5(), r5(), '')
  }
})

const p = db.prepare('INSERT INTO partners (org, kind, sector, contact_name, role, email, message, status, checklist, is_demo) VALUES (?,?,?,?,?,?,?,?,?,1)')
p.run('Demo Telecom Co.', 'Lock Partner', 'Telecom', 'R. (demo)', 'CSR Manager', 'csr.demo@example.com', 'We would like to bring a problem about older customers and our app.', 'signed', JSON.stringify({ agreement: true, card: true, dates: true, ownership: false }))
p.run('Demo Logistics Ltd.', 'Lock Partner', 'Logistics', 'S. (demo)', 'Operations Lead', 'ops.demo@example.com', 'Address finding is a real pain for our couriers.', 'talking', '{}')
p.run('Demo Foundation', 'Spare Key', 'NGO', 'M. (demo)', 'Programme Officer', 'grants.demo@example.com', 'Interested in funding seats for students from schools without robotics.', 'new', '{}')
p.run('Demo Print House', 'Locksmith', 'Print', 'K. (demo)', 'Owner', 'print.demo@example.com', 'We can print the problem cards and the keys packaging.', 'new', '{}')

console.log(`Added ${statuses.length} demo applicants and 4 demo partners.`)
