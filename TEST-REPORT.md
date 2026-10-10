# RecallGuard — Reconstruction Test Report

Date: 2026-10-10
Scope: rebuilt every missing implementation file in `backend/src/{config,database,middleware,services,routes}/`
and `frontend/src/{components,pages,services,hooks}/` from the docs + tests, then verified.
Also added the guided tour, demo mode, and empty states.

## 1. Unit / integration tests — ALL PASS (13/13)

Command: `npm test` (from repo root; runs `node --test "tests/**/*.test.js"`)

```
✔ valid ingestion: hero scenario stores alert, matches supplier, creates HOLD
✔ invalid payload is rejected with 400 and does not crash
✔ duplicate alert (same external_alert_id) is detected, not re-processed
✔ no supplier match still stores the alert without crashing
✔ exact match
✔ case-insensitive match
✔ normalized match ignores punctuation/whitespace
✔ partial match
✔ no match
✔ hero scenario: Egyptian strawberries produces 92 / CRITICAL / HOLD
✔ low hazard + low supplier risk + resolved alert produces LOW severity
✔ high supplier risk tier increases score relative to low tier
✔ score is always clamped between 1 and 100
ℹ pass 13, fail 0
```

Seed output during the ingestion test (real pipeline, temp DB):
`100/CRITICAL, 100/CRITICAL, 71/ELEVATED, 42/LOW, 75/ELEVATED, 81/CRITICAL, no match, 50/ELEVATED`

Note: root `package.json` test script uses `node --test "tests/**/*.test.js"` — a bare
`node --test tests/` directory argument does not work on this Node version (it tries to
load the directory as a module).

## 2. Live API verification (backend on :4000, fresh seeded DB)

| Check | Command | Result |
|---|---|---|
| Health | `curl /api/health` | `{"success":true,"status":"OPERATIONAL",...}` |
| Suppliers | `curl /api/suppliers` | 12 suppliers |
| Hero ingest | `POST /api/alerts/ingest` with RASFF-2026-4102 payload | 201 — 1 assessment: Nile Delta Agricultural Co., 92, CRITICAL, HOLD, EXACT |
| Duplicate | re-POST same payload | 200 `duplicate:true`, no second assessment |
| Invalid | `POST` `{"source_agency":"FDA"}` | 400 with errors |
| Dashboard | `curl /api/dashboard-summary` | activeAlerts 7, alertsAddedToday 9, impactedSuppliers 8, criticalSuppliers 4, criticalActions 4, safeInventoryPct 33, OPERATIONAL (after hero ingest) |
| Analytics | `curl /api/analytics-summary` | 4 BIOLOGICAL / 2 CHEMICAL / 2 ALLERGEN / 1 PHYSICAL; severity 4 CRITICAL / 3 ELEVATED / 1 LOW; tiers 3 HIGH / 5 LOW / 4 MEDIUM; topRisk leaderboard correct (Caspian Nut 100, Continental Meat 100, Nile Delta 92, …) |
| Alert detail | `curl /api/alerts/9` | alert + `assessments[]` with nested `supplier` object |
| Supplier detail | `curl /api/suppliers/1` | supplier + `assessments[]` with nested `alert` object |
| Batch hold | `POST /api/actions/batch-hold {"assessmentId":8}` | containment → BLOCKED, note "Simulation — no external communication sent." |
| Supplier audit | `POST /api/actions/supplier-audit {"supplierId":1}` | SUPPLIER_AUDIT_REQUESTED logged, same simulation note |
| CSV export | `curl /api/actions/export.csv` | valid CSV, `Content-Disposition: attachment` |
| SSE | `curl -N /api/events` | `event: CONNECTED` + payload received |

The DB was reset afterwards to a pristine seeded state (6 active alerts, 7 impacted suppliers, 42% safe inventory).

## 3. Frontend build — SUCCESS

Command: `cd frontend && npm run build` → `✓ built in 42.37s`, no errors.
(Only warning: chunk > 500 kB — expected for a recharts bundle in a PoC; harmless.)

## 4. Environment workarounds (documented for reproducibility)

- `better-sqlite3@11.10.0` ships no prebuilt binary for Node 24 (ABI 137), and the
  sandboxed proxy blocked node-gyp's header download. Pinned `better-sqlite3` to
  `12.11.1` (exact, has node-v137-linux-x64 prebuilds), installed with
  `npm install --ignore-scripts`, then placed the prebuilt `better_sqlite3.node`
  (downloaded from the GitHub release via curl) into
  `backend/node_modules/better-sqlite3/build/Release/`. Verified working.
  On a normal machine with direct network access, plain `npm install` works.

## 5. What was NOT verified

- The Playwright scraper end-to-end (needs a browser run against the live backend;
  manual procedure in `tests/automation/README.md`). The API contract it depends on
  (`POST /api/alerts/ingest` + `X-RecallGuard-Source` header) is verified above.
- Visual check of the dashboard in a real browser (no live-browser access in this
  environment); the production build compiles and the data contracts match what the
  components consume.
