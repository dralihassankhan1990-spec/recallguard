/**
 * Thin async wrappers around the RecallGuard API.
 * Base URL (local): http://localhost:4000/api
 */

const BASE_URL = 'http://localhost:4000/api';

async function request(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options
    });
    let body = null;
    try {
        body = await res.json();
    } catch {
        body = null;
    }
    if (!res.ok) {
        const message =
            (body && body.errors && body.errors.join('; ')) ||
            `Request failed (${res.status})`;
        throw new Error(message);
    }
    return body;
}

export const api = {
    getDashboardSummary: () => request('/dashboard-summary'),
    getAlerts: () => request('/alerts'),
    getAlert: (id) => request(`/alerts/${id}`),
    getActions: () => request('/actions'),
    getSuppliers: () => request('/suppliers'),
    getSupplier: (id) => request(`/suppliers/${id}`),
    getImpactedSuppliers: () => request('/impacted-suppliers'),
    getAnalyticsSummary: () => request('/analytics-summary'),
    triggerBatchHold: (assessmentId) =>
        request('/actions/batch-hold', {
            method: 'POST',
            body: JSON.stringify({ assessmentId })
        }),
    triggerSupplierAudit: (supplierId) =>
        request('/actions/supplier-audit', {
            method: 'POST',
            body: JSON.stringify({ supplierId })
        }),
    /** Plain URL for the CSV download link — not fetched, opened directly. */
    exportActionsCsvUrl: () => `${BASE_URL}/actions/export.csv`
};

export const API_BASE_URL = BASE_URL;
