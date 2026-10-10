# RecallGuard — Demo Script (Target: under 5 minutes)

## Setup (before the interviewer arrives)

```bash
# Terminal 1
cd backend && npm run dev
# Terminal 2
cd frontend && npm run dev
# Terminal 3 — ready, but do NOT run yet
cd automation && source venv/bin/activate
```

Open `http://localhost:5173` in a browser. Confirm the header shows
"System Status: OPERATIONAL" and the KPI row is populated (not zeros —
historical data is already seeded).

---

## Script

**1. Open the dashboard.**
> "This is a simulated food safety operations environment. I've already
> loaded a few historical regulatory alerts and our supplier master."

Point at the KPI row and the alert feed — click a resolved alert to show the
impact panel still works for historical data.

**2. Show the supplier list.**
> "Nile Delta Agricultural Co. supplies us Frozen Strawberries out of Egypt,
> currently a MEDIUM risk-tier supplier."

**3. Open the mock regulatory portal** (`automation/mock_regulatory_portal.html`
in a second browser tab) and point at the card marked **NEW** — EU RASFF,
Frozen Strawberries, Hepatitis A virus.

> "This is a self-hosted simulator — not a live government feed. Let's have
> an automation agent pick this up the way it would monitor a real one."

**4. Run the scraper (Terminal 3):**
```bash
python scraper.py
```

Narrate the terminal output as it streams:
```
[PLAYWRIGHT] Opening regulatory portal...
[PLAYWRIGHT] New alert found: EU RASFF | Frozen Strawberries | Hepatitis A virus
[VALIDATION] Alert payload validated.
[INGESTION] Sending alert to RecallGuard API...
[SUCCESS] Alert accepted.
[MATCH ENGINE] Supplier matched: Nile Delta Agricultural Co. (EXACT)
[RISK ENGINE] Score: 92/100 -> CRITICAL
[ACTION ENGINE] Containment status: HOLD
[SSE] Dashboard event published. Check the RecallGuard UI.
```

**5. Cut back to the browser — do not refresh.**

Active Alerts flips **0 → 1** (or increments), Impacted Suppliers updates, and
the new EU RASFF card appears at the top of the feed, already selected.

**6. Open the Impact Analysis panel** (auto-selected).

> "The system automatically matched the ingredient to our supplier master —
> exact match — scored the operational risk, and recommended containment."

Point at:
- Risk score: **92/100**
- Severity: **CRITICAL**
- Containment: **HOLD**

**7. Click "Explain Risk".**

> "Every number here is explainable — this isn't an unexplained red flag."

Read the breakdown: hazard severity, supplier tier, alert urgency, match
confidence, regulatory source.

**8. Click "Initiate Supplier Audit".**

> "This creates a real, auditable action — it's a simulation, so no email
> actually goes out, but the state change and audit trail are real."

**9. Scroll to the System Automation Log.**

> "Every step — ingestion, matching, risk assessment, containment,
> audit request — is logged with a timestamp. This is the traceability a
> food-safety workflow needs."

**10. (Optional) Briefly open VS Code** and show
`backend/src/services/riskEngine.js` and `docs/business-rules.md` to prove
the scoring model is transparent, not a black box.

---

## If asked "why did you build this?"

See `docs/business-rules.md` §5 and the talking points in the original
project recommendations doc — lead with the business/food-safety framing,
not "I built an AI system."

## Reset between demo runs

```bash
rm backend/data/recallguard.db backend/data/recallguard.db-wal backend/data/recallguard.db-shm
rm automation/.seen_alerts.json
```
Then restart the backend — it will reseed automatically since the DB is empty.
