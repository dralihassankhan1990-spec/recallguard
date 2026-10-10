import { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { BarChart3, Trophy } from 'lucide-react';
import StatusBadge from '../components/StatusBadge.jsx';
import { api } from '../services/api.js';

const CATEGORY_COLORS = {
    BIOLOGICAL: '#f43f5e',
    CHEMICAL: '#f59e0b',
    PHYSICAL: '#6366f1',
    ALLERGEN: '#2dd4bf'
};
const SEVERITY_COLORS = { CRITICAL: '#f43f5e', ELEVATED: '#f59e0b', LOW: '#34d399' };
const TIER_COLORS = { LOW: '#34d399', MEDIUM: '#f59e0b', HIGH: '#f43f5e' };

const tooltipStyle = {
    backgroundColor: '#0f1730',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#e6ecf5'
};

function ChartCard({ title, hint, children }) {
    return (
        <div className="glass-panel rounded-xl p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">{title}</h3>
            {hint && <p className="mt-0.5 text-[11px] text-slate-500">{hint}</p>}
            <div className="mt-3 h-64">{children}</div>
        </div>
    );
}

/**
 * Analytics tab: real charts (recharts) backed by GET /api/analytics-summary —
 * alerts by hazard category, severity distribution, suppliers by risk tier,
 * and the top-risk suppliers leaderboard.
 */
export default function AnalyticsPage() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.getAnalyticsSummary()
            .then(setData)
            .catch((err) => setError(err.message));
    }, []);

    if (error) {
        return (
            <div className="glass-panel rounded-xl p-10 text-center">
                <p className="text-sm font-medium text-rose-300">Could not load analytics</p>
                <p className="mt-1 text-xs text-slate-500">{error}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="glass-panel rounded-xl p-10 text-center">
                <p className="text-sm text-slate-400">Loading analytics…</p>
            </div>
        );
    }

    const categoryData = (data.byCategory || []).map((r) => ({
        name: r.category,
        count: r.count,
        fill: CATEGORY_COLORS[r.category] || '#6366f1'
    }));
    const severityData = (data.severityDist || []).map((r) => ({
        name: r.severity,
        value: r.count,
        fill: SEVERITY_COLORS[r.severity] || '#6366f1'
    }));
    const tierData = (data.byTier || []).map((r) => ({
        name: r.tier,
        count: r.count,
        fill: TIER_COLORS[r.tier] || '#6366f1'
    }));
    const topRisk = data.topRisk || [];

    const hasAssessments = severityData.length > 0;

    return (
        <div className="space-y-5">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                <BarChart3 size={20} className="text-brand-indigo" />
                Risk analytics
            </h2>

            {!hasAssessments && (
                <div className="glass-panel rounded-xl p-6 text-center">
                    <p className="text-sm font-medium text-slate-300">No risk data yet</p>
                    <p className="mt-1 text-xs text-slate-500">
                        Charts populate as soon as alerts are ingested and matched — run the hero demo or the Playwright scraper.
                    </p>
                </div>
            )}

            <div className="grid gap-5 lg:grid-cols-2">
                <ChartCard title="Alerts by hazard category" hint="From the seeded regulatory history + live ingestions">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Bar dataKey="count" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Risk severity distribution" hint="Across all impact assessments">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={severityData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                                {severityData.map((entry) => (
                                    <Cell key={entry.name} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend formatter={(v) => <span style={{ color: '#cbd5e1', fontSize: 12 }}>{v}</span>} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Suppliers by risk tier" hint="The supplier master composition">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={tierData} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                            <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                            <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} width={70} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Bar dataKey="count" radius={[0, 6, 6, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <div className="glass-panel rounded-xl p-5">
                    <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                        <Trophy size={14} className="text-amber-300" />
                        Top-risk suppliers
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-500">Highest engine-scored assessment per supplier</p>
                    <div className="mt-3 max-h-56 space-y-2 overflow-y-auto pr-1">
                        {topRisk.length === 0 ? (
                            <p className="py-4 text-center text-xs text-slate-500">No assessments yet.</p>
                        ) : (
                            topRisk.map((row, i) => (
                                <div key={row.supplier_id} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                                    <span className="w-6 text-center text-sm font-bold text-slate-500">#{i + 1}</span>
                                    <span className="min-w-0 flex-1 truncate text-xs font-medium text-white">{row.company_name}</span>
                                    <StatusBadge value={row.severity} />
                                    <span className="text-sm font-bold text-white">{row.max_score}<span className="text-[10px] font-normal text-slate-500">/100</span></span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
