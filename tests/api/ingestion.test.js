// Uses a throwaway temp SQLite file so tests never touch backend/data/recallguard.db.
const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');
const test = require('node:test');
const assert = require('node:assert/strict');

process.env.DB_PATH = path.join(os.tmpdir(), `recallguard-test-${Date.now()}.db`);

// IMPORTANT: schema must exist before any service module is required, because
// several services prepare their SQL statements at module-load time.
const { initSchema } = require('../../backend/src/config/database');
initSchema();

const { seed } = require('../../backend/src/database/seed');
seed();

const alertService = require('../../backend/src/services/alertService');

test.after(() => {
    try { fs.unlinkSync(process.env.DB_PATH); } catch { /* ignore */ }
    try { fs.unlinkSync(process.env.DB_PATH + '-wal'); } catch { /* ignore */ }
    try { fs.unlinkSync(process.env.DB_PATH + '-shm'); } catch { /* ignore */ }
});

test('valid ingestion: hero scenario stores alert, matches supplier, creates HOLD', () => {
    const payload = {
        external_alert_id: 'RASFF-2026-4102',
        source_agency: 'EU RASFF',
        ingredient_name: 'Frozen Strawberries',
        hazard_type: 'Hepatitis A virus',
        hazard_category: 'BIOLOGICAL',
        alert_date: '2026-09-19',
        status: 'ACTIVE'
    };

    const result = alertService.ingestAlert(payload, 'TEST');

    assert.equal(result.status, 'processed');
    assert.equal(result.httpStatus, 201);
    assert.equal(result.body.assessments.length, 1);

    const assessment = result.body.assessments[0];
    assert.equal(assessment.supplier.company_name, 'Nile Delta Agricultural Co.');
    assert.equal(assessment.calculated_risk_score, 92);
    assert.equal(assessment.severity_level, 'CRITICAL');
    assert.equal(assessment.containment_status, 'HOLD');
});

test('invalid payload is rejected with 400 and does not crash', () => {
    const result = alertService.ingestAlert({ source_agency: 'FDA' }, 'TEST');
    assert.equal(result.status, 'error');
    assert.equal(result.httpStatus, 400);
    assert.ok(result.body.errors.length > 0);
});

test('duplicate alert (same external_alert_id) is detected, not re-processed', () => {
    const payload = {
        external_alert_id: 'DUPLICATE-TEST-01',
        source_agency: 'FDA',
        ingredient_name: 'Peanut Butter',
        hazard_type: 'Salmonella spp.',
        hazard_category: 'BIOLOGICAL',
        alert_date: '2026-09-01',
        status: 'ACTIVE'
    };

    const first = alertService.ingestAlert(payload, 'TEST');
    assert.equal(first.status, 'processed');

    const second = alertService.ingestAlert(payload, 'TEST');
    assert.equal(second.status, 'duplicate');
    assert.equal(second.body.duplicate, true);
});

test('no supplier match still stores the alert without crashing', () => {
    const payload = {
        external_alert_id: 'NO-MATCH-TEST-01',
        source_agency: 'FDA',
        ingredient_name: 'Exotic Space Vegetable',
        hazard_type: 'Unknown',
        hazard_category: 'PHYSICAL',
        alert_date: '2026-09-01',
        status: 'ACTIVE'
    };

    const result = alertService.ingestAlert(payload, 'TEST');
    assert.equal(result.status, 'processed');
    assert.equal(result.body.assessments.length, 0);
});
