# RecallGuard — v2 Upgrade Guide

This package contains **only new/changed files**, laid out in the same folder
structure as your existing project, so you can drop each one into place.
Nothing here touches your already-working `backend/data/recallguard.db`
directly — you'll reset it once at the end (Step 5) to pick up the richer
demo data.

## What's new

1. **Visual overhaul** — no more flat black screen. Dark theme kept (it reads
   as an "operations command center," which is the right tone for this kind
   of app) but rebuilt with: an animated gradient-mesh background, glass
   (frosted) panels, an original hand-built SVG hero illustration + animated
   supply-chain diagram, gradient text/icons, and 3D-tilt-on-hover cards
   (pure CSS/JS — no risky extra dependency).
   > I deliberately used original SVG/CSS art instead of stock photos, so
   > the page never depends on an external image URL being reachable or
   > licensed. See **"Using your own images/photos"** below if you'd rather
   > swap in real photography.
2. **5 tabs instead of one screen**: Dashboard, Suppliers, Alerts, Analytics,
   Audit Log — using `react-router-dom`.
3. **Suppliers page** — searchable/filterable card grid (12 suppliers now,
   up from 5), click a card for its full assessment history + an "Initiate
   Supplier Audit" action.
4. **Alerts page** — full alert history table with status/category filters;
   clicking a row jumps to the Dashboard with that alert selected.
5. **Analytics page** — real charts (via `recharts`): alerts by hazard
   category, risk severity distribution, suppliers by risk tier, top-risk
   suppliers leaderboard. Backed by a new `GET /api/analytics-summary`
   endpoint.
6. **Audit Log page** — the full action log with a **CSV export** button
   (new `GET /api/actions/export.csv` endpoint).
7. **Richer seed data** — 12 suppliers (up from 5) across 10 countries, 8
   historical alerts (up from 3) spanning all 4 hazard categories, and — new
   — the seed script now runs every historical alert through the real
   impact/risk engine, so Analytics has real numbers from the very first
   run instead of an empty chart.
8. **4 ready-to-run demo scenarios** in the mock portal (CRITICAL ×2,
   ELEVATED, LOW) instead of just one, so you can show the risk engine
   producing genuinely different, explainable outcomes live — see
   `automation/README.md`.

---

## Step 1 — Copy the files

Copy every file below from this package into your existing `recallguard/`
project at the same relative path, overwriting when a file already exists.

**Frontend — replace existing files:**
```
frontend/package.json
frontend/tailwind.config.js
frontend/src/main.jsx
frontend/src/App.jsx
frontend/src/index.css
frontend/src/services/api.js
frontend/src/components/Header.jsx
frontend/src/components/MetricsRibbon.jsx
frontend/src/components/AlertFeed.jsx
frontend/src/components/ImpactPanel.jsx
frontend/src/components/ActionLog.jsx
```

**Frontend — brand new files:**
```
frontend/src/components/HeroBanner.jsx
frontend/src/components/SupplyChainFlow.jsx
frontend/src/components/TiltCard.jsx
frontend/src/components/NavTabs.jsx
frontend/src/components/SupplierCard.jsx
frontend/src/pages/DashboardPage.jsx
frontend/src/pages/SuppliersPage.jsx
frontend/src/pages/AlertsPage.jsx
frontend/src/pages/AnalyticsPage.jsx
frontend/src/pages/AuditLogPage.jsx
```
(`frontend/src/pages/` is a new folder — create it.)

**Not changed, keep as-is:** `frontend/src/components/StatusBadge.jsx`,
`frontend/src/components/SupplierRiskCard.jsx`, `frontend/src/hooks/useRealtimeEvents.js`,
`frontend/index.html`, `frontend/vite.config.js`, `frontend/postcss.config.js`.

**Backend — replace existing files:**
```
backend/src/server.js
backend/src/routes/actions.js
backend/src/database/seed.js
```

**Backend — brand new file:**
```
backend/src/routes/analytics.js
```

**Not changed, keep as-is:** everything else in `backend/` — `config/`,
`services/`, `routes/alerts.js`, `routes/suppliers.js`, `routes/dashboard.js`,
`middleware/`, `database/schema.sql` (schema is unchanged; only the seed
*data* grew).

**Automation — replace existing files:**
```
automation/mock_regulatory_portal.html
automation/README.md
```

---

## Step 2 — Install the two new frontend packages

```bash
cd frontend
npm install react-router-dom@^6.26.2 recharts@^2.12.7
```
(This is already reflected in the `package.json` you copied in Step 1 —
running `npm install` with no arguments from `frontend/` also works.)

No new backend packages are required.

---

## Step 3 — Reset the database so the new seed data loads

Your existing `recallguard.db` already has data in it, so the app's
"seed only if empty" startup logic will otherwise skip the new suppliers
and alerts. Reset it once:

```bash
# from the project root
rm backend/data/recallguard.db backend/data/recallguard.db-wal backend/data/recallguard.db-shm
```

---

## Step 4 — Run it

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Open `http://localhost:5173`. You should see:
- The new gradient hero section and animated pipeline diagram at the top of
  the Dashboard tab (instead of a flat black screen).
- A 12-supplier, richer Suppliers tab.
- A populated Analytics tab immediately (no need to run the scraper first).
- Four tabs in the nav bar in addition to Dashboard.

Then run the automation demo as before:
```bash
# Terminal 3
cd automation && source venv/bin/activate && python scraper.py
```

---

## Step 5 — Verify nothing broke

```bash
# from project root — the risk-engine/matching/ingestion tests still apply unchanged
npm test
```
All tests should still pass — none of this upgrade touched the risk engine
or matching logic, so the previously-verified 92/CRITICAL/HOLD hero result
is unchanged.

---

## Using your own images/photos (optional)

If you'd like a real photo instead of the custom SVG illustration:

1. Put an image file (e.g. `warehouse.jpg`) in `frontend/public/`.
2. In `frontend/src/components/HeroBanner.jsx`, replace the
   `<SupplyChainIllustration />` usage with:
   ```jsx
   <img src="/warehouse.jpg" alt="Food supply chain" className="h-full w-full rounded-xl object-cover" />
   ```
3. For a full-bleed background image behind the whole dashboard instead of
   the gradient mesh, add this to `frontend/src/index.css`'s `body` rule:
   ```css
   background-image: linear-gradient(rgba(7,11,22,0.85), rgba(7,11,22,0.85)), url('/your-background.jpg');
   background-size: cover;
   background-position: center;
   ```
   Only use images you have the rights to use (your own photos, or a
   properly licensed stock source) since this becomes part of a project
   you're distributing/presenting.

## Rollback

Every file this upgrade replaces is a plain overwrite — if you keep a copy
of your current `frontend/` and `backend/` folders (or are using git), you
can revert with `git checkout -- frontend backend` or by restoring your
backup.
