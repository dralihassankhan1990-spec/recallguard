import { useEffect, useMemo, useState } from 'react';
import { Search, X, ClipboardCheck, Building2 } from 'lucide-react';
import SupplierCard from '../components/SupplierCard.jsx';
import SupplierRiskCard from '../components/SupplierRiskCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { api } from '../services/api.js';

/**
 * Suppliers tab: searchable / filterable card grid; clicking a card opens
 * a detail modal with the supplier's full assessment history + an
 * "Initiate Supplier Audit" action.
 */
export default function SuppliersPage({ suppliers, onSupplierAudit, busy }) {
    const [query, setQuery] = useState('');
    const [tierFilter, setTierFilter] = useState('ALL');
    const [detail, setDetail] = useState(null); // supplier row
    const [detailAssessments, setDetailAssessments] = useState(null);

    useEffect(() => {
        if (!detail) {
            setDetailAssessments(null);
            return;
        }
        api.getSupplier(detail.id)
            .then((res) => setDetailAssessments(res.supplier.assessments || []))
            .catch(() => setDetailAssessments([]));
    }, [detail]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return (suppliers || []).filter((s) => {
            const matchesQuery =
                !q ||
                s.company_name.toLowerCase().includes(q) ||
                s.ingredient_supplied.toLowerCase().includes(q) ||
                (s.country_of_origin || '').toLowerCase().includes(q);
            const matchesTier = tierFilter === 'ALL' || s.risk_tier === tierFilter;
            return matchesQuery && matchesTier;
        });
    }, [suppliers, query, tierFilter]);

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
                <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                    <Building2 size={20} className="text-brand-indigo" />
                    Supplier master
                </h2>
                <span className="text-xs text-slate-500">{filtered.length} of {(suppliers || []).length} suppliers</span>
                <div className="ml-auto flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search name, ingredient, country…"
                            className="w-64 rounded-lg border border-white/10 bg-white/5 py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-slate-500 focus:border-brand-indigo/60 focus:outline-none"
                        />
                    </div>
                    {['ALL', 'LOW', 'MEDIUM', 'HIGH'].map((tier) => (
                        <button
                            key={tier}
                            onClick={() => setTierFilter(tier)}
                            className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                                tierFilter === tier
                                    ? 'border-brand-indigo/60 bg-brand-indigo/20 text-white'
                                    : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                            }`}
                        >
                            {tier === 'ALL' ? 'All tiers' : tier}
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="glass-panel rounded-xl p-10 text-center">
                    <p className="text-sm font-medium text-slate-300">No suppliers match your filters</p>
                    <p className="mt-1 text-xs text-slate-500">Try a different search term or risk-tier filter.</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((s) => (
                        <SupplierCard key={s.id} supplier={s} onClick={setDetail} />
                    ))}
                </div>
            )}

            {/* Detail modal */}
            {detail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70" onClick={() => setDetail(null)} />
                    <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-surface-panel p-6 shadow-2xl">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="text-lg font-bold text-white">{detail.company_name}</h3>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                    <span>{detail.ingredient_supplied}</span>
                                    <span>·</span>
                                    <span>{detail.country_of_origin}</span>
                                    <StatusBadge value={detail.risk_tier} />
                                </div>
                                {detail.contact_email && (
                                    <div className="mt-1 text-[11px] text-slate-500">
                                        Contact: {detail.contact_email} <span className="italic">(simulation — never emailed)</span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setDetail(null)}
                                className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 transition hover:text-white"
                                aria-label="Close supplier detail"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="mt-4">
                            {detailAssessments === null ? (
                                <p className="py-6 text-center text-xs text-slate-500">Loading assessment history…</p>
                            ) : (
                                <SupplierRiskCard supplier={detail} assessments={detailAssessments} />
                            )}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => onSupplierAudit && onSupplierAudit(detail.id)}
                                disabled={busy}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-200 transition hover:bg-amber-500/25 disabled:opacity-40"
                            >
                                <ClipboardCheck size={13} />
                                Initiate Supplier Audit
                            </button>
                            <span className="text-[11px] italic text-slate-500">Simulation — no external communication sent.</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
