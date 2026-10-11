# 0 to Shipped — Resume × Job Description Matcher

Upload a resume **PDF** and paste a **job description (JD)** to see how well they
match: a score out of 100, the skills you already have, and the ones to add.

The project is split into a **React frontend** and an **Express + MongoDB backend**.

```
zero-to-shipped-web/
├── frontend/   React + Vite UI (calls the backend API)
└── backend/    Express API + MongoDB (parses PDF, compares to JD, stores results)
```

> The comparison engine is currently **deterministic keyword/weight matching**.
> The AI part will be added later — it is isolated in
> `backend/service/compare.js` behind a stable input/output contract, so
> swapping in a model won't touch the rest of the app.

---

## Prerequisites

- Node.js 18+
- A MongoDB connection string (local `mongodb://127.0.0.1:27017/...` or MongoDB Atlas)

## 1. Backend setup

```bash
cd backend
cp .env.example .env        # then edit MONGODB_URI
npm install
npm run dev                 # starts on http://localhost:5000
```

## 2. Frontend setup

```bash
cd frontend
npm install
npm run dev                 # starts on http://localhost:5173
```

The Vite dev server proxies `/api` → `http://localhost:5000`, so the two run
independently and just work together.

## Or run both at once (from the repo root)

```bash
npm install                 # installs `concurrently`
npm run dev                 # boots backend + frontend together
```

---

## API

| Method | Endpoint           | Description                                  |
| ------ | ------------------ | -------------------------------------------- |
| GET    | `/api/health`      | Health check.                                |
| POST   | `/api/analyze`     | multipart: `resume` (PDF) + `jobDescription`.|
| GET    | `/api/analyses`    | Recent analyses (list).                      |
| GET    | `/api/analyses/:id`| A single analysis.                           |

Example `POST /api/analyze`:

```bash
curl -F "resume=@./my-resume.pdf" \
     -F "jobDescription=We are looking for a React and Node.js engineer with AWS and Docker experience." \
     http://localhost:5000/api/analyze
```

Response:

```json
{
  "id": "...",
  "score": 78,
  "present": ["AWS", "Docker", "Node.js", "React"],
  "missing": ["Kubernetes", "TypeScript"],
  "jdSkills": ["AWS", "Docker", "Node.js", "React", "Kubernetes", "TypeScript"],
  "summary": "Compared your resume against the job description: ..."
}
```

## Where the AI will go

`backend/service/compare.js` → `compareResumeToJd({ resumeText, jobDescription })`.
Replace its body with a call to your model and keep the same return shape; the
route, database, and frontend already speak that contract.

---

## Deploying to Vercel (two projects)

Each folder has its own `vercel.json`. Create **two** Vercel projects from this
same repo, pointing each at its subdirectory.

### 1. Backend project
- **Root Directory:** `backend`
- **Framework Preset:** Other
- **Environment Variables** (Project → Settings → Environment Variables):
  - `MONGODB_URI` — your MongoDB connection string (e.g. MongoDB Atlas)
  - `CORS_ORIGIN` — your deployed frontend URL, e.g. `https://your-frontend.vercel.app`
  - (optional) `NODE_ENV=production`

The backend runs as a single serverless function (`api/index.js`) and
`vercel.json` routes every path to it. DB connections are cached across warm
invocations.

### 2. Frontend project
- **Root Directory:** `frontend`
- **Framework Preset:** Vite
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `dist` (auto-detected)
- **Environment Variables:**
  - `VITE_API_BASE` — your deployed backend URL **including** `/api`, e.g.
    `https://your-backend.vercel.app/api`

> Order matters: deploy the backend first so you know its URL, then set
> `VITE_API_BASE` on the frontend to that URL and redeploy the frontend.
> Because the frontend calls the backend cross-origin, make sure the backend's
> `CORS_ORIGIN` matches the frontend's domain.
