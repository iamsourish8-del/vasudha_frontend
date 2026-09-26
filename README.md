# Vasudha — Green Habitat Energy Intelligence

**Prem Jain Memorial Trust · National Green Earth Challenge · Sustainable Habitat**

## Demo flow (evaluation)

1. **Command center** — Panchabhutas strip (Agni, Vaayu, Jal, Prithvi, Gagan)
2. **Digital Twin** — thermal / airflow / presence layers, heatwave slider, room drawer
3. **Solar & Grid NOC** — power-flow vectors, ToD arbitrage, **Simulate grid blackout**
4. **Tenant Hub** — log eco-action, green credits, leaderboard

Login: `facility@demo.com` / `demo123`  
(also: `tenant@demo.com`, `maintenance@demo.com` — same password)

---

## Local run

```bash
# Backend
cd backend
python -m pip install -r requirements.txt
python run.py
# → http://127.0.0.1:8000/health
```

```bash
# Frontend
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

Optional: copy `frontend/.env.example` → `frontend/.env` and set `VITE_API_BASE`.

---

## Deploy: Backend on Render + Frontend on Vercel

### 1. Backend → Render

1. Push this repo (or the `backend/` folder) to GitHub.
2. [Render Dashboard](https://dashboard.render.com) → **New → Web Service**.
3. Connect the repo. Settings:
   - **Root Directory**: `backend`
   - **Runtime**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app.main:app --bind 0.0.0.0:$PORT --workers 1 --threads 4 --timeout 120`
     (or leave blank if `Procfile` is detected)
4. Environment variables:
   - `SECRET_KEY` = long random string
   - (optional) `CORS_ORIGINS` = `https://your-app.vercel.app,http://localhost:5173`
   - (optional) `FRONTEND_URL` = `https://your-app.vercel.app`
5. Deploy. Note the URL, e.g. `https://vasudha-backend.onrender.com`.

Health check path: `/health`  
Keep-alive path: `/api/v1/keepalive`

### 2. Frontend → Vercel

1. [Vercel](https://vercel.com) → **Add New Project** → import the same repo.
2. Settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Environment variable (Production + Preview):
   - `VITE_API_BASE` = `https://vasudha-backend.onrender.com/api/v1`
     (use your real Render URL)
4. Deploy.

### 3. Connect front ↔ back

- Frontend talks to backend only via `VITE_API_BASE`.
- Backend CORS accepts `https://*.vercel.app` and any origin listed in `CORS_ORIGINS` / `FRONTEND_URL`.
- No shared server; pure HTTP/JSON.

---

## Render free-tier “hold / sleep” (cold start)

Render free web services sleep after ~15 minutes with no traffic. The next request then waits ~30–60s (cold start).

**Built-in mitigation (this project):**

1. **Frontend keep-alive** — while the app tab is open, the client pings `/api/v1/keepalive` every 12 minutes (`frontend/src/services/keepAlive.ts`). This keeps the backend awake during demos.
2. **Explicit keepalive endpoint** — `GET /api/v1/keepalive` (and `/health`).

**For always-on without a browser open:**

- Free monitor (e.g. [cron-job.org](https://cron-job.org) or UptimeRobot) → HTTP GET  
  `https://YOUR-RENDER-URL/api/v1/keepalive` every 10–14 minutes.

That is the explicit method to avoid the hold/spin-down delay.

---

## Production notes (Gunicorn)

- Use the `Procfile` / start command above. Do **not** use `python run.py` on Render.
- `--workers 1` is recommended on free tier (512 MB).
- `--timeout 120` avoids worker kills on slower responses.
- App entry: `app.main:app` (Flask application object).

---

## Docs

- `docs/ARCHITECTURE.md`
- `shared/contracts/api-contracts.md`
