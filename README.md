# KEYS website

Public site (InCube-style, red tatreez key brand) + application form + admin review system.

## Run
    npm install
    npm run dev          # site http://localhost:5208 · API on 8792
    npm start            # production build, everything on http://localhost:5208

Admin: http://localhost:5208/admin. First login is in `server/data/FIRST-LOGIN.txt`; change the password in Admin → Settings, then delete that file.

## What's where
- `src/pages`: Home, How it works, Application, Challenges, The Vault, Parents, Partners, FAQ, Contact, Apply (6-step form), Status
- `src/admin`: Dashboard, Applications (filter, bulk move, CSV), Application detail (score 1–5 per playbook rubric, notes, status, role, team), Teams (5 team rules checked live), Partners (pipeline + signed checklist), Settings (open/close call, publish results, reviewers, notify list, delete demo data)
- `src/shared/rules.js`: rubric weights, statuses, roles, age rule, team checks (shared by site, admin and API)
- `src/content.js`: public copy from the Concept Book and Pilot Playbook (prices, budgets, unsigned company names and the secret seventh key are left out)
- `server/`: Express + SQLite (`server/data/keys.db`), uploads in `server/data/uploads` (admin-only)
- `npm run seed:demo` adds DEMO applicants; delete them in Admin → Settings
- Photos: replace files in `public/img` with real season photos (same names)

## Publish
    npm run deploy       # builds the public site and pushes it to https://nmaaalhawary.github.io/key/

The GitHub Pages version has no server: forms show "opens 1 March 2027" and the admin is off. Host `server/` (e.g. Render) before the open call to take applications online.
