const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateRisk } = require('../../backend/src/services/riskEngine');

// --- Hero scenario acceptance test -----------------------------------------
// Frozen Strawberries + Hepatitis A + EU RASFF (ACTIVE) + Nile Delta (MEDIUM) + EXACT match
// Expected: 92 / CRITICAL / HOLD  (see docs/business-rules.md)
test('hero scenario: Egyptian strawberries produces 92 / CRITICAL / HOLD', () => {
    const alert = {
        source_agency: 'EU RASFF',
        ingredient_name: 'Frozen Strawberries',
        hazard_type: 'Hepatitis A virus',
        hazard_category: 'BIOLOGICAL',
        status: 'ACTIVE'
    };
    const supplier = { risk_tier: 'MEDIUM' };
    const match = { matchType: 'EXACT', confidence: 1.0 };

    const result = calculateRisk(alert, supplier, match);

    assert.equal(result.score, 92);
    assert.equal(result.severity, 'CRITICAL');
    assert.equal(result.containment, 'HOLD');
});

test('low hazard + low supplier risk + resolved alert produces LOW severity', () => {
    const alert = {
        source_agency: 'EU RASFF',
        ingredient_name: 'Wheat Flour',
        hazard_type: 'Ochratoxin A (mycotoxin)',
        hazard_category: 'CHEMICAL',
        status: 'RESOLVED'
    };
    const supplier = { risk_tier: 'LOW' };
    const match = { matchType: 'PARTIAL', confidence: 0.7 };

    const result = calculateRisk(alert, supplier, match);

    assert.ok(result.score < 50, `expected score < 50, got ${result.score}`);
    assert.equal(result.severity, 'LOW');
    assert.equal(result.containment, 'NONE');
});

test('high supplier risk tier increases score relative to low tier', () => {
    const alert = {
        source_agency: 'FDA',
        ingredient_name: 'Romaine Lettuce',
        hazard_type: 'E. coli O157:H7',
        hazard_category: 'BIOLOGICAL',
        status: 'ACTIVE'
    };
    const match = { matchType: 'EXACT', confidence: 1.0 };

    const lowResult = calculateRisk(alert, { risk_tier: 'LOW' }, match);
    const highResult = calculateRisk(alert, { risk_tier: 'HIGH' }, match);

    assert.ok(highResult.score > lowResult.score);
});

test('score is always clamped between 1 and 100', () => {
    const alert = {
        source_agency: 'Unknown Agency',
        ingredient_name: 'Salt',
        hazard_type: 'Minor labeling issue',
        hazard_category: 'PHYSICAL',
        status: 'RESOLVED'
    };
    const result = calculateRisk(alert, { risk_tier: 'LOW' }, { matchType: 'PARTIAL', confidence: 0.7 });
    assert.ok(result.score >= 1 && result.score <= 100);
});
