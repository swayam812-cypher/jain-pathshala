# Jain Pathshala — Learning Journey (LMS)

A full-stack learning management system: student auth, 7-book sequential
curriculum, YouTube progress tracking, quizzes, and dynamically generated
PDF certificates.

## Stack
- **Backend**: Node.js (v22.5+ required), Express, SQLite (built-in `node:sqlite`
  module — no native compilation needed), JWT auth, pdf-lib for certificates
- **Frontend**: React (Vite), React Router, Tailwind CSS v4, YouTube IFrame API

> This uses Node's built-in SQLite module instead of `better-sqlite3`, so
> there's no native addon to compile — no Visual Studio / build tools
> required on Windows. Just make sure you're on Node 22.5 or newer
> (`node --version`). The module is marked "experimental" by Node but is
> stable for this app's needs; you'll see a one-line warning on startup,
> which is expected.

## Running locally

### 1. Backend
```
cd backend
npm install
npm run dev
```
Runs on http://localhost:4000. On first run it auto-seeds:
- 7 books (Balpothi → Vitrag Vigyan 3), each with 3 chapters and a quiz
- Admin account: `admin@jainpathshala.org` / `admin123`

The SQLite database file is created at `backend/data.sqlite`.

### 2. Frontend
```
cd frontend
npm install
npm run dev
```
Runs on http://localhost:5175 and proxies `/api` to the backend at :4000.

Open http://localhost:5175, sign up as a student, and go through the journey.
Visit `/admin` while logged in as the admin account to set real YouTube
video IDs and PDF URLs per chapter, and to view quiz scores + theory answers.

## Notes on the seed data
Every chapter is seeded with a placeholder YouTube video ID and an empty
PDF url — update these from the Admin panel (`/admin`) with your real
video IDs and hosted PDF links. Quiz questions are placeholder text per
book; edit them directly in the `quizzes` table or extend the admin UI's
create/edit endpoints (`POST/PUT /api/admin/quizzes`) to manage them from
the UI.

## Deploying
- Backend: any Node host (Render, Railway, Fly.io) — set `JWT_SECRET` and
  a persistent disk/volume for `data.sqlite`.
- Frontend: `npm run build` produces `dist/` — deploy to Vercel/Netlify/
  any static host, and point it at your deployed backend's URL (update
  the API base URL in `src/api/client.js` or set up a proxy/rewrite).
