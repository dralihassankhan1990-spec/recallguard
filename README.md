# RecallGuard

**AI-Assisted Food Safety Recall & Supplier Impact Intelligence — Local Proof of Concept**

A working digital demonstration of how a regulatory food-safety alert
becomes an internal operational decision:

```
Regulatory Alert → Automated Ingestion → Supplier Matching →
Risk Assessment → Impact Analysis → Containment Action →
Audit Trail → Real-Time Operations Dashboard
```

> ⚠️ **This is a demonstration PoC.** Risk scores, supplier matching, and
> containment decisions are configurable business rules, not official
> regulatory calculations, FDA/EU RASFF decisions, or a replacement for
> qualified food safety professionals. See `docs/business-rules.md`.

---

## 1. The Business Problem

A regulatory alert (an FDA recall notice, an EU RASFF entry) by itself
doesn't tell an organization what it should *do*. The real question is:
does the affected ingredient exist in our supplier network, which suppliers
are exposed, and what containment response should start now? RecallGuard
turns that translation step into a working, auditable digital workflow.

## 2. Target Users

Food safety / quality assurance teams, supply chain operations, and
compliance officers who need to react to external regulatory signals faster
than a manual email/spreadsheet process allows.

## 3. Architecture

See `docs/architecture.md` for the full diagram. Summary:

- **Automation** (Python + Playwright) scrapes a local mock regulatory portal.
- **API** (Node.js + Express) validates, deduplicates, and orchestrates.
- **Business logic** (plain JS services) matches suppliers and scores risk —
  deterministic and explainable, not an LLM black box.
- **Database** (SQLite via better-sqlite3) — 5 tables, see `docs/data-dictionary.md`.
- **Real-time** (Server-Sent Events) pushes updates to the browser.
- **Frontend** (React + Vite + Tailwind) — an operations command-center dashboard.

## 4. Technology Stack

| Layer | Tech |
|---|---|
| Frontend | React, Vite, Tailwind CSS, lucide-react |
| Backend | Node.js, Express |
| Database | SQLite (better-sqlite3) |
| Automation | Python, Playwright, requests |
| Real-time | Server-Sent Events |

## 5. Setup

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.9
- npm

### Install

```bash
git clone <this-repo> recallguard
cd recallguard

# Backend
cd backend
npm install
cp .env.example .env

# Frontend
cd ../frontend
npm install

# Automation
cd ../automation
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
playwright install chromium
```

### Run (3 terminals)

```bash
# Terminal 1 — API (also auto-initializes + seeds SQLite on first run)
cd backend && npm run dev

# Terminal 2 — Dashboard
cd frontend && npm run dev
# open http://localhost:5173

# Terminal 3 — Automation demo
cd automation && source venv/bin/activate && python scraper.py
```

## 6. Demo Procedure

See `docs/demo-script.md` for the full five-minute walkthrough (the
"Egyptian strawberries" hero scenario: EU RASFF → Frozen Strawberries →
Hepatitis A → Nile Delta Agricultural Co. → Risk 92/100 → CRITICAL → HOLD).

## 7. Risk Engine

`backend/src/services/riskEngine.js` implements the **RecallGuard PoC Risk
Model** — a transparent, additive scoring function combining hazard
severity, supplier risk tier, alert urgency, match confidence, and
regulatory source weight. Full breakdown and worked example in
`docs/business-rules.md`.

## 8. APIs

Full endpoint reference in `docs/api-specification.md`. Highlights:

- `POST /api/alerts/ingest` — main ingestion pipeline
- `GET /api/dashboard-summary` — live KPIs (never hardcoded)
- `GET /api/events` — SSE stream
- `POST /api/actions/batch-hold`, `POST /api/actions/supplier-audit` —
  functional action buttons (simulated external communication only)

## 9. Testing

```bash
npm test   # from the project root — runs tests/risk-engine and tests/api
```

Covers: risk engine (including the exact hero-scenario acceptance test:
92/CRITICAL/HOLD), supplier matching (exact/case-insensitive/normalized/
partial/no-match), and the full ingestion pipeline (valid, invalid,
duplicate, no-match).

## 10. Limitations (by design)

No authentication, no multi-tenancy, no cloud deployment, no message queues,
no microservices, no real regulatory integration, no real email/SMS
notifications, no LLM making autonomous safety decisions. See
`docs/business-rules.md` §4 for the full rationale.

## 11. Project Structure

```
recallguard/
├── backend/        Express API, SQLite, business services
├── frontend/        React dashboard
├── automation/       Playwright scraper + mock regulatory portal
├── docs/             architecture, business rules, API spec, data dictionary, demo script
└── tests/            risk engine, matching engine, ingestion pipeline tests
```

## 12. Author's Note

Built to demonstrate the combination of food-safety domain knowledge,
business analysis, digital transformation thinking, and AI-assisted software
delivery — not to claim an autonomous AI safety system. The domain model,
business rules, and acceptance criteria were authored by the project owner;
AI assistance accelerated implementation.
