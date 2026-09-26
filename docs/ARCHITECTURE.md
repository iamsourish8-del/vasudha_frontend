# System Architecture — Vasudha — Green Habitat Energy Intelligence

## 1. Separation of Concerns (Rule 1 & 2)

```
┌─────────────────────────────┐          HTTP / WebSocket          ┌─────────────────────────────┐
│         FRONTEND            │ ◄────────────────────────────────► │         BACKEND             │
│  (React + Vite)             │                                    │  (FastAPI)                  │
│                             │                                    │                             │
│  src/modules/shell/         │                                    │  app/core/                  │
│  src/modules/occupancy_…    │                                    │  app/api/                   │
│  src/modules/digital_twin/  │                                    │  app/modules/occupancy_…    │
│  …                          │                                    │  app/modules/digital_twin/  │
│  src/components/            │                                    │  …                          │
│  src/contexts/              │                                    │  app/models/                │
│  src/services/              │                                    │  app/services/              │
└─────────────────────────────┘                                    └─────────────────────────────┘
         ▲                                                                    ▲
         │                                                                    │
         └──────────────────── shared/contracts + mock_data ─────────────────┘
```

Frontend and backend never share code. They only share **contracts** (JSON shapes) defined in `/shared`.

---

## 2. Backend Module Isolation

Every idea lives in its own folder under `backend/app/modules/`:

```
modules/
├── occupancy_hvac/          # Idea 1
│   ├── router.py            # All HTTP endpoints for this module
│   ├── service.py           # Business logic (to be added)
│   ├── models.py            # Module-specific Pydantic / DB models
│   └── ...
├── digital_twin/            # Idea 2
├── fault_detection/         # Idea 3
├── grid_solar/              # Idea 4 (DR + Outage + Solar)
├── xai_nlq/                 # Idea 5
├── tenant_gamification/     # Idea 6
└── shared/                  # Only truly cross-cutting helpers
```

No module imports another module’s internal logic. Cross-module data flows only through:

1. Shared database tables / time-series store
2. Explicit service calls that go through a thin interface
3. The BFF aggregator (read-only summary)

---

## 3. Frontend Module Isolation

```
src/modules/
├── shell/                   # THE foundation — build this first
│   ├── Shell.tsx            # Auth gate + building context + layout
│   ├── CommandCenter.tsx    # Home overview
│   ├── TopBar.tsx
│   └── SkeletonDashboard.tsx
├── occupancy_hvac/          # Full page for Idea 1
├── digital_twin/
├── fault_detection/
├── grid_solar/
├── xai_nlq/
└── tenant_gamification/
```

Shared UI lives in `src/components/` (ModuleCard, AlertBanner, ExplanationTooltip, etc.).  
Shared state lives in `src/contexts/` (AuthContext, BuildingContext).

---

## 4. Data Flow (Cross-Module)

```
Sensors / Synthetic Generators
        │
        ▼
┌───────────────────┐
│  Occupancy HVAC   │──────► live load curve
└─────────┬─────────┘               │
          │                         ▼
          │               ┌───────────────────┐
          │               │  Grid + Solar     │
          │               │  (reads HVAC load │
          │               │   + battery state)│
          │               └─────────┬─────────┘
          │                         │
          ▼                         ▼
┌───────────────────┐     ┌───────────────────┐
│  Fault Detection  │     │  Tenant Gamif.    │
└─────────┬─────────┘     └───────────────────┘
          │
          ▼
┌───────────────────┐
│  XAI / NLQ        │  ← wraps decisions from HVAC, DR, Faults
└───────────────────┘
```

Digital Twin is largely independent (planning tool).

---

## 5. Authorization Flow

```
Login → JWT issued with { sub, role, building_ids[] }
                │
                ▼
Every API request
                │
                ├─ get_current_user()          → validates JWT
                ├─ require_roles(...)          → checks role
                └─ require_building_access()   → checks building_ids
```

UI may hide buttons, but **security is always enforced server-side**.

---

## 6. Recommended Implementation Order

1. Shared foundation (this scaffold already provides it)
2. Occupancy HVAC (feeds the most downstream modules)
3. Digital Twin (independent)
4. Fault Detection
5. Grid + Solar + DR
6. XAI + NLQ (depends on decisions existing)
7. Tenant Gamification (depends on HVAC + Solar numbers)

---

## 7. Demo Credentials

| Email              | Password | Role              |
|--------------------|----------|-------------------|
| facility@demo.com  | demo123  | Facility Manager  |
| tenant@demo.com    | demo123  | Tenant            |

---

This structure satisfies every constraint you listed:

- Frontend / backend completely separate  
- Clear, structural architecture  
- Each idea in its own folders on both sides  
- Logical naming and data flow  
- Data contracts designed so real APIs can be ported later  

You now have a solid, debuggable, extensible foundation ready for module-by-module implementation.