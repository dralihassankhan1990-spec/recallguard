# RecallGuard — Business Rules (PoC)

> **Disclaimer:** Every rule below is a configurable demonstration rule for
> this proof of concept. None of it is an official regulatory calculation, an
> FDA or EU RASFF decision, a legally validated recall determination, or a
> substitute for a qualified food safety professional's judgment. The purpose
> is to demonstrate digital workflow automation, not to make real safety
> decisions.

## 1. Supplier Matching Rules

Implemented in `backend/src/services/matchingService.js`. Deterministic and
explainable by design — no AI/LLM matching, because a food-safety matching
decision needs to be reproducible and auditable.

Four strategies are tried in order of strength:

| Match type | Example | Confidence |
|---|---|---|
| `EXACT` | "Frozen Strawberries" = "Frozen Strawberries" | 1.00 |
| `CASE_INSENSITIVE` | "frozen strawberries" ~ "Frozen Strawberries" | 0.95 |
| `NORMALIZED` | "Frozen, Strawberries!" ~ "frozen strawberries" | 0.90 |
| `PARTIAL` | "Strawberries" ⊂ "Frozen Strawberries" | 0.70 |

The match type and confidence are persisted on every `impact_assessments`
row and shown in the UI so the decision is never an unexplained black box.

## 2. RecallGuard PoC Risk Model

Implemented in `backend/src/services/riskEngine.js`, function
`calculateRisk(alert, supplier, matchResult)`. The score is the transparent
sum of five weighted factors (capped at 100):

| Factor | Rule | Points |
|---|---|---|
| Hazard severity | Category baseline: BIOLOGICAL 32, ALLERGEN 26, CHEMICAL 20, PHYSICAL 12. **+5** if the hazard text matches a recognized severe-pathogen keyword (hepatitis, listeria, botulinum, E. coli O157, salmonella, norovirus). | up to 37 |
| Supplier risk tier | LOW 5 / MEDIUM 15 / HIGH 25 | 5–25 |
| Alert urgency | ACTIVE 20 / RESOLVED 5 | 5–20 |
| Match confidence | `round(confidence × 15)` | 0–15 |
| Regulatory source weight | Major agency (FDA, EU RASFF, CFIA, FSA) 5, other 3 | 3–5 |

**Severity bands:** 80–100 `CRITICAL`, 50–79 `ELEVATED`, 1–49 `LOW`.

**Containment mapping:** `CRITICAL → HOLD`, `ELEVATED → MONITOR`, `LOW → NONE`.
`BLOCKED` is reserved for a manual escalation via the "Trigger Batch Hold"
action — the system never auto-escalates past HOLD.

### Hero scenario worked example

Alert: EU RASFF, Frozen Strawberries, Hepatitis A virus, BIOLOGICAL, ACTIVE.
Supplier: Nile Delta Agricultural Co., MEDIUM risk tier, EXACT match.

```
Hazard severity   32 (BIOLOGICAL) + 5 (hepatitis keyword)   = 37
Supplier risk     MEDIUM                                     = 15
Alert urgency     ACTIVE                                     = 20
Match confidence  EXACT (1.00) × 15                           = 15
Regulatory source EU RASFF (major agency)                     =  5
                                                        TOTAL  = 92
```

Score 92 → `CRITICAL` → containment `HOLD`. This matches the documented hero
demonstration scenario exactly.

## 3. Containment & System Actions

| Trigger | `action_type` | Automatic? |
|---|---|---|
| Any alert stored | `ALERT_INGESTED` | Yes |
| Supplier match found | (implicit via SSE `SUPPLIER_MATCHED`) | Yes |
| Impact assessment created | `RISK_ASSESSMENT_CREATED` | Yes |
| Severity = CRITICAL | `AUTOMATED_HOLD` | Yes |
| No supplier match | `NO_SUPPLIER_MATCH` | Yes |
| Operator clicks "Trigger Batch Hold" | `BATCH_HOLD_TRIGGERED` (containment → `BLOCKED`) | No — manual |
| Operator clicks "Initiate Supplier Audit" | `SUPPLIER_AUDIT_REQUESTED` | No — manual |

Every manual action is explicitly labeled in the UI and API response as
**"Simulation — no external communication sent."** This keeps the PoC honest:
buttons perform real, auditable state changes, but they never contact a real
supplier, regulator, or email system.

## 4. What This PoC Deliberately Does Not Include

To keep the demonstration focused and credible rather than sprawling:

- Authentication / multi-tenancy
- Cloud deployment, Kubernetes, Kafka, Redis, microservices
- Real FDA/EU RASFF scraping or integration
- Real email/SMS supplier notification
- Complex ML or an LLM making autonomous safety decisions

## 5. Where AI Should Eventually Fit

Not in the deterministic scoring path. A natural next step is an
**"AI Food Safety Copilot"** — an LLM layer *on top of* the deterministic
facts already computed (alert, match, score breakdown, action log) that can
answer questions like *"Why was Nile Delta Agricultural Co. placed on
hold?"* by retrieving and explaining, not recalculating, the underlying
numbers. This keeps the audit trail deterministic while still showcasing
AI-assisted delivery.
