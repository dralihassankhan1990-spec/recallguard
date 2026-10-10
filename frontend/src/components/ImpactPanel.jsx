import { useState } from 'react';
import { HelpCircle, OctagonPause, ClipboardCheck, MousePointerClick } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

function scoreColor(score) {
    if (score >= 80) return 'text-rose-300';
    if (score >= 50) return 'text-amber-300';
    return 'text-emerald-300';
}

function scoreBar(score) {
    if (score >= 80) return 'from-rose-500 to-red-400';
    if (score >= 50) return 'from-amber-500 to-yellow-400';
    return 'from-emerald-500 to-teal-400';
}

/**
 * Impact analysis for the selected alert: matched suppliers, explainable
 * risk scores, containment state, and the two simulated operator actions.
 */
export default function ImpactPanel({ alert, busy, onBatchHold, onSupplierAudit }) {
    const [explainedId, setExplainedId] = useState(null);

    if (!alert) {
        return (
            <div data-tour="impact" className="glass-panel flex h-full min-h-[320px] flex-col items-center justify-center rounded-xl p-6 text-center">
                <MousePointerClick size={36} className="mb-3 text-slate-600" />
                <p className="text-sm font-medium text-slate-300">No alert selected</p>
                <p className="mt-1 max-w-xs text-xs text-slate-500">
                    Select an alert from the feed to see its supplier matches, risk scores and containment recommendations.
                </p>
            </div>
        );
    }

    const assessments = alert.assessments || [];

    return (
        <div data-tour="impact" className="glass-panel rounded-xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Impact analysis</h3>
                    <div className="mt-1 text-lg font-bold text-white">
                        {alert.source_agency} — {alert.ingredient_name}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-400">
                        {alert.hazard_type} · {alert.alert_date}
                        {alert.external_alert_id && <span className="text-slate-500"> · {alert.external_alert_id}</span>}
                    </div>
                </div>
                <div className="flex gap-2">
                    <StatusBadge value={alert.hazard_category} />
                    <StatusBadge value={alert.status} />
                </div>
            </div>

            {assessments.length === 0 ? (
                <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] p-6 text-center">
                    <p className="text-sm font-medium text-slate-300">No supplier matches</p>
                    <p className="mx-auto mt-1 max-w-md text-xs text-slate-500">
                        The matching engine ran "{alert.ingredient_name}" against all {''}suppliers in the master and found no match.
                        The alert is still stored and audit-logged for traceability.
                    </p>
                </div>
            ) : (
                <div className="mt-4 space-y-3">
                    {assessments.map((a) => (
                        <div key={a.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <div className="font-semibold text-white">{a.supplier?.company_name}</div>
                                    <div className="text-xs text-slate-400">
                                        {a.supplier?.ingredient_supplied} · {a.supplier?.country_of_origin} · Tier{' '}
                                        <StatusBadge value={a.supplier?.risk_tier} /> · Match <StatusBadge value={a.match_type} />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-2xl font-bold ${scoreColor(a.calculated_risk_score)}`}>
                                        {a.calculated_risk_score}
                                        <span className="text-sm font-normal text-slate-500">/100</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
                                <div
                                    className={`h-full rounded-full bg-gradient-to-r ${scoreBar(a.calculated_risk_score)} transition-all`}
                                    style={{ width: `${a.calculated_risk_score}%` }}
                                />
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span className="text-xs text-slate-400">Severity</span>
                                <StatusBadge value={a.severity_level} />
                                <span className="text-xs text-slate-400">Containment</span>
                                <StatusBadge value={a.containment_status} />
                                <button
                                    onClick={() => setExplainedId(explainedId === a.id ? null : a.id)}
                                    className="ml-auto inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300 transition hover:border-brand-indigo/50 hover:text-white"
                                >
                                    <HelpCircle size={13} />
                                    {explainedId === a.id ? 'Hide explanation' : 'Explain Risk'}
                                </button>
                            </div>

                            {explainedId === a.id && (
                                <div className="mt-2 rounded-md border border-brand-indigo/20 bg-brand-indigo/10 p-3 text-xs leading-relaxed text-slate-300">
                                    <span className="font-semibold text-white">Why this score?</span>
                                    <p className="mt-1">{a.assessment_reason}</p>
                                </div>
                            )}

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => onBatchHold && onBatchHold(a.id)}
                                    disabled={busy || a.containment_status === 'BLOCKED'}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/15 px-3 py-1.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-40"
                                    title="Escalate this assessment's containment to BLOCKED"
                                >
                                    <OctagonPause size={13} />
                                    {a.containment_status === 'BLOCKED' ? 'Batch Hold Active' : 'Trigger Batch Hold'}
                                </button>
                                <button
                                    onClick={() => onSupplierAudit && onSupplierAudit(a.supplier?.id)}
                                    disabled={busy}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-200 transition hover:bg-amber-500/25 disabled:opacity-40"
                                    title="Log a supplier audit request"
                                >
                                    <ClipboardCheck size={13} />
                                    Initiate Supplier Audit
                                </button>
                            </div>
                        </div>
                    ))}
                    <p className="text-center text-[11px] italic text-slate-500">
                        Simulation — no external communication sent.
                    </p>
                </div>
            )}
        </div>
    );
}
