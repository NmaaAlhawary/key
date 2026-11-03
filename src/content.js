// Public copy, taken from the KEYS Concept Book (Draft 4) and the Pilot Playbook (Draft 2).
// Kept out: prices, budgets, investor terms, unsigned company names and the secret seventh key.

export const NUMBERS = [
  ['20', 'Students'],
  ['04', 'Teams of 5'],
  ['04', 'Real companies'],
  ['16', 'Sessions'],
  ['06', 'Keys to earn'],
  ['01', 'Vault'],
]

export const JOURNEY = [
  { when: 'Week 0', title: 'The locked box', text: 'Your team meets its company. It hands you a sealed box: inside, a real problem on a card and a photo of the place.', img: '/img/slate.jpg' },
  { when: 'Week 1', title: 'The Door Visit', text: 'A supervised two-hour visit to the company. Interview the people who feel the problem, then map it.', img: '/img/hands.jpg' },
  { when: 'Weeks 1 to 7', title: 'Six keys', text: 'Train twice a week in robotics, AI and business. Pass each stage\'s challenge and earn its key.', img: '/img/keys.jpg' },
  { when: 'Week 8', title: 'The Vault', text: 'Pitch your working prototype to the people who hold the keys. Three keys open the vault on stage.', img: '/img/stage.jpg' },
]

export const KEYS = [
  { n: '01', name: 'Discovery key', ar: 'مفتاح الاكتشاف', week: 'Week 1', text: 'Interviews, the Door Visit and a problem map.', challenge: 'A 3-minute map, 3 real quotes and one "How might we".' },
  { n: '02', name: 'Build key', ar: 'مفتاح البناء', week: 'Weeks 2 to 3', text: 'Circuits, sensors and a cardboard prototype, tested with real users.', challenge: 'The prototype does one real thing, live.' },
  { n: '03', name: 'Code and AI key', ar: 'مفتاح البرمجة والذكاء', week: 'Week 4', text: 'Program the board and train a simple AI model.', challenge: 'The AI works 3 times out of 5, and everyone can explain it.' },
  { n: '04', name: 'Money key', ar: 'مفتاح المال', week: 'Week 5', text: 'Who pays, what it costs, and a one-page business model.', challenge: 'Answer 5 questions from a mock investor.' },
  { n: '05', name: 'Check key', ar: 'مفتاح المراجعة', week: 'Week 6', text: 'A mentor from your company reviews the prototype and pushes back hard.', challenge: 'Show the mentor\'s 3 points and how you fixed them.' },
  { n: '06', name: 'Pitch key', ar: 'مفتاح العرض', week: 'Week 7', text: 'Story, demo, five slides and a full rehearsal.', challenge: 'A 5-minute pitch and demo, plus 2 surprise questions.' },
]

export const VAULT_STEPS = [
  { title: 'The Keyholders', text: 'Leaders from the four companies, a partner and a young founder sit on stage. Each holds one golden key.' },
  { title: 'The pitches', text: 'Each team has five minutes to pitch and demo its working prototype, then five minutes of questions.' },
  { title: 'The keys', text: 'After the last pitch, each Keyholder walks to the team they believe in most and hands over their key. The audience votes one more: the People\'s Key.' },
  { title: 'The opening', text: 'A team holding three or more golden keys turns them in a real vault on stage, with lights and sound. Inside is its prize.' },
]

export const VAULT_INSIDE = [
  'A real pilot of the idea with the team\'s company',
  'Seed money or a grant',
  'An incubator place and mentoring',
  'A golden key for every member, whatever happens',
]

export const EXPECT = [
  { title: 'Real problems', text: 'Your team works on a problem a real company is facing today, not a textbook project.' },
  { title: 'Learn, then prove', text: 'Eight weeks of training before anyone pitches, so your idea arrives with a working prototype behind it.' },
  { title: 'New people', text: 'You work with four students from other schools. Each one is good at something you are not. By the Vault, you will be too.' },
  { title: 'Proof, not a certificate', text: 'Leave with a working prototype, a filmed pitch and a ring of smart keys you earned.' },
]

export const MOMENTS = [
  { title: 'Smart keys', text: 'Every key is real metal, stamped with the stage and the season, with an NFC chip inside. Tap it on a phone and it opens your team\'s project page. Projects only, never personal details.' },
  { title: 'The People\'s Key', text: 'One extra golden key, voted by the audience on their phones during Vault night. It counts like any other key.' },
  { title: 'The Key Wall', text: 'Every graduate\'s key hangs on the Key Wall, with a first name and consent. Proof for every new family that walks in.' },
]

export const TIMELINE = [
  { when: '1 to 14 Mar 2027', title: 'Open call', text: 'Anyone aged 13 to 16 in Amman can apply. A 10-minute form.' },
  { when: '15 to 21 Mar 2027', title: 'Key Trial', text: 'About 40 shortlisted students join a fun 90-minute group challenge. Not an exam.' },
  { when: '22 to 28 Mar 2027', title: 'Teams', text: '20 students are picked into 4 teams of 5. Everyone hears back within 7 days.' },
  { when: 'Early April', title: 'Team day and handover', text: 'Meet your team, then open the locked box from your company.' },
  { when: 'April to May', title: 'Six keys', text: 'Two sessions a week after school, about two and a half hours each.' },
  { when: 'Late May', title: 'Vault night', text: 'A public evening with families, schools, the companies and media. Filmed.' },
]

export const PICK = [
  { title: 'Curiosity', text: 'Something you fixed or built, and what you tried when it did not work.' },
  { title: 'Teamwork', text: 'How you work with strangers at the Key Trial. Listening counts as much as talking.' },
  { title: 'Tech thinking', text: 'A simple, clear idea for a real person. No coding needed.' },
  { title: 'Commitment', text: 'Being there for the 16 sessions, with a parent who confirms it.' },
  { title: 'A fair mix', text: 'Girls and boys, many schools, and students from schools without robotics.' },
]

export const ROLES_PUBLIC = [
  ['Builder', 'Grabs the materials, tests again and again'],
  ['Coder', 'Thinks in steps: "if this, then that"'],
  ['Researcher', 'Asks who has the problem and why'],
  ['Storyteller', 'Explains the idea best'],
  ['Captain', 'Keeps time, gets quiet ones to speak'],
]

export const SAFE = [
  ['Vetted adults', 'A non-conviction certificate and safeguarding training for every facilitator, mentor and volunteer.'],
  ['Two-adult rule', 'No adult alone with a child, in person or online. No private messages between adults and students.'],
  ['Ratios', 'At least one trained adult per eight students. Female staff always present.'],
  ['Door Visits', 'Two staff with every team, transport arranged by us, signed consent per visit, meeting areas only, never more than two hours.'],
  ['Sign in, sign out', 'Every student is signed in and signed out to a named adult, every session.'],
  ['Photos are opt-in', 'Photo and video only with signed consent. Schools and home areas are never published.'],
]

export const PARTNER_KINDS = [
  { name: 'Lock Partner', who: 'Banks, telecoms, hospitals, hotels, logistics', gives: 'A real problem in a locked box, a Door Visit and a mentor check.', gets: 'A Keyholder seat, its name on the team, impact data and filmed content.', many: 'One per team' },
  { name: 'Master Key Partner', who: 'A bank or a telecom', gives: 'Funds the Vault night and the seed prize.', gets: 'Its name on the Vault night, the stage and the film. A Keyholder seat.', many: 'One per season' },
  { name: 'Spare Key', who: 'NGOs and foundations', gives: 'Funds seats for students, including the picked pilot cohort.', gets: 'Named in the impact report, with impact data.', many: 'Any number' },
  { name: 'Locksmith', who: 'Venues, media, printers', gives: 'Venue, food, filming or print, in kind.', gets: 'Recognised as an official partner of the season.', many: 'As needed' },
]

export const LOCK_GIVES = [
  ['30 min', 'Locked-box handover'],
  ['2 hours', 'One Door Visit for its team of five'],
  ['1 hour', 'One mentor check in week 6'],
  ['1 seat', 'A Keyholder seat at the Vault'],
]

export const LOCK_GETS = [
  'Fresh ideas from the young users of tomorrow',
  'A real education story, with impact data',
  'Filmed content from the season and the Vault',
  'Early sight of future talent',
  'Its name on the season, the team and the stage',
]

export const PROBLEMS = [
  { sector: 'Telecom', problem: 'Older people struggle with phone apps', build: 'A voice helper that explains an app step by step' },
  { sector: 'Logistics', problem: 'Couriers cannot find addresses', build: 'A smart parcel box with a keypad lock' },
  { sector: 'Hospitality', problem: 'Too much food is wasted at the buffet', build: 'A smart scale that counts daily waste' },
  { sector: 'Banking', problem: 'Kids never learn to save', build: 'A smart piggy bank that tracks a savings goal' },
  { sector: 'Health', problem: 'Long, stressful waiting rooms', build: 'A queue screen with an alert buzzer for each patient' },
  { sector: 'Water', problem: 'Hidden water leaks at home', build: 'A leak sensor that sends an alert' },
  { sector: 'City', problem: 'Overflowing street bins', build: 'A smart bin that signals when it is full' },
  { sector: 'Travel', problem: 'Lost luggage', build: 'A bag tag tracker with a simple app' },
]

export const GOOD_PROBLEM = [
  'Real today, and the company cares about the answer',
  'Safe for kids: no private data, no dangerous sites',
  'Can be prototyped in four weeks with our kits',
  'Fits in one sentence a 13-year-old can explain',
]

export const FAQ = [
  ['Who can apply?', 'Students aged 13 to 16 on 1 April 2027, from any school in Amman. No experience and no grades needed.'],
  ['How much does it cost?', 'Applying is free. A season seat is 350 JOD, with 10% off for early bird and siblings. Scholarship seats, funded by partners, are there for students who cannot pay, so cost never decides who gets in.'],
  ['What does the application ask for?', 'A 10-minute form: the basics, your interests, and two short pieces. Show us something you fixed or built (a photo, a drawing or a 1-minute voice note), and a tech mini-challenge where you explain how tech could solve a small problem. No coding needed.'],
  ['How are students picked?', 'Two staff read every application and score it separately. About 40 students are invited to the Key Trial, a fun 90-minute group challenge. Then 20 are picked into four teams of five. Everyone hears back within 7 days.'],
  ['Can I join with my friends?', 'Teams are built on purpose with students from different schools. Friends are split up. That is how a coder learns to pitch and a talker learns to build.'],
  ['When and where are the sessions?', 'Two sessions a week after school, about two and a half hours each, from April to May 2027, in a safe, supervised partner space in Amman. The exact venue is shared with picked families.'],
  ['What do parents need to do?', 'Sign the consent form, commit to pickup and drop-off, and come to Vault night. That is it.'],
  ['What if my team misses a key?', 'It gets one catch-up session to earn it. Nobody is dropped. Every team reaches the Vault.'],
  ['Who owns the ideas?', 'The students. Students are minors, so no one buys a share of their idea, and ownership is agreed in writing before the season.'],
  ['What if I am not picked?', 'The waiting list gets priority next season, and you are welcome to apply again.'],
]

export const HOW_ROWS = [
  { when: '1 to 14 March 2027', title: 'Online application', img: '/img/kids-robot.jpg', credit: 'Photo: Virginia Department of Education, CC BY 2.0', text: ['Fill in a 10-minute form with a parent. Be yourself: an honest answer beats a polished one.', 'Two of our team read every application and score it separately.'] , list: ['The basics and your interests', 'Piece 1: show us something you fixed or built', 'Piece 2: a tech mini-challenge, no coding needed'] },
  { when: '15 to 21 March 2027', title: 'The Key Trial', img: '/img/team-table.jpg', credit: 'Photo: Rick Naystatt, Public domain', text: ['About 40 shortlisted students join a fun 90-minute group challenge, in groups of 10 who have never met. Fun, not an exam.'], list: ['Welcome and a name game', 'Tower challenge: the tallest tower that holds a phone, from 20 straws, tape and string', 'Mini problem: "The canteen line is too long. Sketch one fix."', 'Reflection, then goodbye. Feedback is always kind.'] },
  { when: '22 to 28 March 2027', title: 'Teams of five', art: 'roles', text: ['20 students are picked into four teams of five. Everyone hears back within 7 days, and the waiting list gets priority next season.'], list: ['All five roles in every team', 'No two students from the same school', 'At least 2 girls and 2 boys', 'Younger and older together'] },
  { when: 'Early April 2027', title: 'Team day and the locked box', img: '/img/brainstorm.jpg', credit: 'Photo: Nathan Kit Kennedy, CC0', text: ['Meet your team, swap skills, and pick a team name, flag and three rules.', 'Then your Lock Partner hands you a sealed box. Inside: the real problem on a card and a photo of the place. Open it, read it, and plan your Door Visit.'] },
  { when: 'April to May 2027', title: 'Six keys', art: 'keys', text: ['Two sessions a week after school, about two and a half hours each. Every stage ends with a short challenge. Pass it, and your team earns that stage\'s key.'], list: ['Discovery, Build, Code and AI', 'Money, Check, Pitch', 'Miss a key? One catch-up session. Nobody is dropped.'] },
  { when: 'Late May 2027', title: 'Vault night', img: '/img/stage.jpg', text: ['Pitch your working prototype to the leaders who hold the keys, in front of families, schools and media. Three keys open the vault on stage.'] },
  { when: 'After the Vault', title: 'Beyond KEYS', icon: 'spark', text: ['Your keys go on a ring and the Key Wall. Tap one on a phone to open your team\'s project page: proof for school and university applications.'] },
]
