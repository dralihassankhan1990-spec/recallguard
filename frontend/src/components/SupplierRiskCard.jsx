import StatusBadge from './StatusBadge.jsx';

/**
 * Compact risk card for an impacted supplier: company, tier, top score,
 * and its assessment history. Used in the supplier detail modal.
 */
export default function SupplierRiskCard({ supplier, assessments }) {
    const rows = assessments || [];
    const maxScore = rows.length ? Math.max(...rows.map((a) => a.calculated_risk_score)) : null;

    return (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                    <div className="font-semibold text-white">{supplier.company_name}</div>
                    <div className="mt-0.5 text-xs text-slate-400">
                        {supplier.ingredient_supplied} · {supplier.country_of_origin}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <StatusBadge value={supplier.risk_tier} />
                    {maxScore !== null && (
                        <span
                            className={`text-xl font-bold ${
                                maxScore >= 80 ? 'text-rose-300' : maxScore >= 50 ? 'text-amber-300' : 'text-emerald-300'
                            }`}
                        >
                            {maxScore}
                            <span className="text-xs font-normal text-slate-500">/100</span>
                        </span>
                    )}
                </div>
            </div>

            {rows.length === 0 ? (
                <p className="mt-3 text-xs text-slate-500">No risk assessments on record — this supplier is not currently impacted.</p>
            ) : (
                <div className="mt-3 space-y-2">
                    {rows.map((a) => (
                        <div key={a.id} className="rounded-lg border border-white/5 bg-black/20 p-3">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                <span className="text-slate-300">
                                    {a.alert ? `${a.alert.source_agency} — ${a.alert.ingredient_name}` : `Alert #${a.alert_id}`}
                                </span>
                                <span className="font-bold text-white">{a.calculated_risk_score}/100</span>
                            </div>
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                                <StatusBadge value={a.severity_level} />
                                <StatusBadge value={a.containment_status} />
                                <StatusBadge value={a.match_type} />
                                {a.alert && <StatusBadge value={a.alert.status} />}
                            </div>
                            {a.assessment_reason && (
                                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">{a.assessment_reason}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
