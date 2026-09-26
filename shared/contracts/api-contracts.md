# API Contracts — Vasudha — Green Habitat Energy Intelligence

These contracts are the single source of truth between frontend and backend.
Any real external API (Green Habitat habitat systems, DISCOM, etc.) can be adapted to these shapes.

---

## Authentication

### POST /api/v1/auth/login
**Request:** `application/x-www-form-urlencoded`  
`username`, `password`

**Response 200:**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "role": "facility_manager",
  "full_name": "Priya Sharma",
  "building_ids": ["bldg-aspiria-01"]
}
```

JWT payload claims: `sub` (user_id), `role`, `building_ids[]`, `exp`

---

## BFF Aggregator (Dashboard Shell)

### GET /api/v1/bff/dashboard-summary/{building_id}
Returns a thin combined summary used only by the command-center home view.
Each module still exposes its own detailed endpoints.

---

## Module 1 — Occupancy HVAC

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/occupancy/{building_id}/status` | Live room statuses + savings |
| POST | `/occupancy/{building_id}/override` | Manager override |
| GET | `/occupancy/{building_id}/savings` | Historical savings vs baseline |

---

## Module 2 — Digital Twin / ECBC

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/digital-twin/{building_id}/simulate` | Run thermal + retrofit ranking |
| GET | `/digital-twin/{building_id}/ecbc-lookup` | Climate-zone baselines |

---

## Module 3 — Fault Detection

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/faults/{building_id}/health` | Equipment list + severity |
| GET | `/faults/{building_id}/equipment/{id}/trend` | Time-series for one asset |

---

## Module 4 — Grid + Solar + DR

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/grid-solar/{building_id}/solar` | Dispatch schedule + savings |
| GET | `/grid-solar/{building_id}/dr-events` | Active + historical DR |
| GET | `/grid-solar/{building_id}/outage-status` | Critical-load registry |
| POST | `/grid-solar/{building_id}/simulate-outage` | Demo trigger |

---

## Module 5 — XAI + NLQ

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/xai/{building_id}/explanations/recent` | Recent SHAP explanations |
| POST | `/xai/nlq` | Natural-language question |

---

## Module 6 — Tenant Gamification

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/tenant/{building_id}/me` | Personal stats + badges |
| GET | `/tenant/{building_id}/leaderboard` | Floor / building ranking |
| GET | `/tenant/{building_id}/nudges` | Actionable tips |

---

## Security Rules Applied Everywhere

- Every protected endpoint requires a valid JWT.
- Every building-scoped endpoint calls `require_building_access`.
- High-impact actions (overrides, outage simulation) require `facility_manager` or `super_admin`.
- NLQ runs only against a read-only path and an allowlist.