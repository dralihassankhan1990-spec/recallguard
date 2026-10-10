# RecallGuard — Data Dictionary

SQLite database at `backend/data/recallguard.db`, created automatically on
first run from `backend/src/database/schema.sql`.

## suppliers

| Field | Type | Notes |
|---|---|---|
| id | INTEGER PK | auto-increment |
| company_name | TEXT | e.g. "Nile Delta Agricultural Co." |
| ingredient_supplied | TEXT | matched against incoming alerts |
| country_of_origin | TEXT | |
| risk_tier | TEXT | `LOW` \| `MEDIUM` \| `HIGH` |
| contact_email | TEXT | demo/simulation only — never actually emailed |
| created_at | TEXT | ISO8601, default now |

## safety_alerts

| Field | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| external_alert_id | TEXT UNIQUE | primary duplicate-detection key |
| source_agency | TEXT | e.g. "FDA", "EU RASFF" |
| ingredient_name | TEXT | |
| hazard_type | TEXT | free text, e.g. "Hepatitis A virus" |
| hazard_category | TEXT | `BIOLOGICAL` \| `CHEMICAL` \| `PHYSICAL` \| `ALLERGEN` |
| alert_date | TEXT | YYYY-MM-DD |
| status | TEXT | `ACTIVE` \| `RESOLVED` |
| source_url | TEXT | link back to the mock portal record |
| ingested_at | TEXT | ISO8601, default now |

## impact_assessments

| Field | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| alert_id | INTEGER FK | → safety_alerts.id |
| supplier_id | INTEGER FK | → suppliers.id |
| match_type | TEXT | `EXACT` \| `CASE_INSENSITIVE` \| `NORMALIZED` \| `PARTIAL` |
| calculated_risk_score | INTEGER | 1–100, PoC risk model output |
| severity_level | TEXT | `CRITICAL` \| `ELEVATED` \| `LOW` |
| containment_status | TEXT | `NONE` \| `MONITOR` \| `HOLD` \| `BLOCKED` |
| assessment_reason | TEXT | human-readable score breakdown |
| created_at | TEXT | ISO8601, default now |

## system_actions

| Field | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| action_type | TEXT | e.g. `ALERT_INGESTED`, `AUTOMATED_HOLD`, `BATCH_HOLD_TRIGGERED`, `SUPPLIER_AUDIT_REQUESTED`, `RISK_ASSESSMENT_CREATED`, `NO_SUPPLIER_MATCH` |
| entity_type | TEXT | `ALERT` \| `SUPPLIER` \| `IMPACT_ASSESSMENT` \| `SYSTEM` |
| entity_id | INTEGER \| NULL | id of the related row |
| description | TEXT | human-readable audit line |
| triggered_by | TEXT | `SYSTEM` \| `OPERATIONS_USER` |
| trigger_source | TEXT | `REGULATORY_ALERT` \| `DASHBOARD_ACTION` \| `STARTUP` |
| status | TEXT | `COMPLETED` (PoC does not model long-running/async actions) |
| created_at | TEXT | ISO8601, default now |

## ingestion_logs

| Field | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| source | TEXT | `PLAYWRIGHT_SCRAPER` \| `TEST` \| custom source header |
| external_record_id | TEXT | the alert's external_alert_id, if present |
| received_at | TEXT | ISO8601, default now |
| processing_status | TEXT | `RECEIVED` \| `PROCESSED` \| `DUPLICATE` \| `ERROR` |
| error_message | TEXT \| NULL | populated on validation/DB failures |
| payload | TEXT | raw JSON payload as received — supports troubleshooting the pipeline |

## Entity relationships

```
suppliers 1───* impact_assessments *───1 safety_alerts
system_actions references (entity_type, entity_id) loosely — not a strict FK,
by design, since it logs actions against multiple entity types.
ingestion_logs is intentionally decoupled from safety_alerts (it must be able
to record failed/duplicate ingestions that never became a stored alert).
```
