const test = require('node:test');
const assert = require('node:assert/strict');
const { matchIngredient } = require('../../backend/src/services/matchingService');

test('exact match', () => {
    const result = matchIngredient('Frozen Strawberries', 'Frozen Strawberries');
    assert.equal(result.matched, true);
    assert.equal(result.matchType, 'EXACT');
});

test('case-insensitive match', () => {
    const result = matchIngredient('frozen strawberries', 'Frozen Strawberries');
    assert.equal(result.matched, true);
    assert.equal(result.matchType, 'CASE_INSENSITIVE');
});

test('normalized match ignores punctuation/whitespace', () => {
    const result = matchIngredient('Frozen, Strawberries!', 'frozen   strawberries');
    assert.equal(result.matched, true);
    assert.equal(result.matchType, 'NORMALIZED');
});

test('partial match', () => {
    const result = matchIngredient('Strawberries', 'Frozen Strawberries');
    assert.equal(result.matched, true);
    assert.equal(result.matchType, 'PARTIAL');
});

test('no match', () => {
    const result = matchIngredient('Peanut Butter', 'Frozen Strawberries');
    assert.equal(result.matched, false);
    assert.equal(result.matchType, null);
});
