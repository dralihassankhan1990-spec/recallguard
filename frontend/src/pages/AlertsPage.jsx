import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellRing, ArrowUpRight } from 'lucide-react';
import StatusBadge from '../components/StatusBadge.jsx';

/**
 * Alerts tab: full alert history table with status/category filters.
 * Clicking a row jumps back to the Dashboard with that alert selected.
 */
export default function AlertsPage({ alerts, onOpenInDashboard }) {
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const navigate = useNavigate();

    const filtered = useMemo(() => {
        return (alerts || []).filter((a) => {
            const okStatus = statusFilter === 'ALL' || a.status === statusFilter;
            const okCat = categoryFilter === 'ALL' || a.hazard_category === categoryFilter;
            return okStatus && okCat;
        });
    }, [alerts, statusFilter, categoryFilter]);

    const openInDashboard = (id) => {
        if (onOpenInDashboard) onOpenInDashboard(id);
        navigate('/');
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
                <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                    <BellRing size={20} className="text-brand-indigo" />
                    Regulatory alerts
                </h2>
                <span className="text-xs text-slate-500">{filtered.length} of {(alerts || []).length} alerts</span>
                <div className="ml-auto flex flex-wrap items-center gap-2">
                    {['ALL', 'ACTIVE', 'RESOLVED'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                                statusFilter === s
                                    ? 'border-brand-indigo/60 bg-brand-indigo/20 text-white'
                                    : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                            }`}
                        >
                            {s === 'ALL' ? 'All statuses' : s}
                        </button>
                    ))}
                    {['ALL', 'BIOLOGICAL', 'CHEMICAL', 'PHYSICAL', 'ALLERGEN'].map((c) => (
                        <button
                            key={c}
                            onClick={() => setCategoryFilter(c)}
                            className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                                categoryFilter === c
                                    ? 'border-brand-teal/60 bg-brand-teal/15 text-white'
                                    : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                            }`}
                        >
                            {c === 'ALL' ? 'All categories' : c}
                        </button>
                    ))}
                </div>
            </div>

            <div className="glass-panel overflow-hidden rounded-xl">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                            <th className="px-4 py-3">Alert ID</th>
                            <th className="px-4 py-3">Agency</th>
                            <th className="px-4 py-3">Ingredient</th>
                            <th className="px-4 py-3">Hazard</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-10 text-center">
                                    <p className="text-sm font-medium text-slate-300">No alerts match these filters</p>
                                    <p className="mt-1 text-xs text-slate-500">Try widening the status or category filter.</p>
                                </td>
                            </tr>
                        ) : (
                            filtered.map((a) => (
                                <tr
                                    key={a.id}
                                    onClick={() => openInDashboard(a.id)}
                                    className="cursor-pointer border-b border-white/5 transition hover:bg-white/[0.04]"
                                >
                                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{a.external_alert_id || `—`}</td>
                                    <td className="px-4 py-3 text-xs font-semibold text-slate-200">{a.source_agency}</td>
                                    <td className="px-4 py-3 font-medium text-white">{a.ingredient_name}</td>
                                    <td className="max-w-[220px] truncate px-4 py-3 text-xs text-slate-400" title={a.hazard_type}>
                                        {a.hazard_type}
                                    </td>
                                    <td className="px-4 py-3"><StatusBadge value={a.hazard_category} /></td>
                                    <td className="px-4 py-3 text-xs text-slate-400">{a.alert_date}</td>
                                    <td className="px-4 py-3"><StatusBadge value={a.status} /></td>
                                    <td className="px-4 py-3 text-right">
                                        <span className="inline-flex items-center gap-1 text-xs text-brand-teal">
                                            Open <ArrowUpRight size={13} />
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
