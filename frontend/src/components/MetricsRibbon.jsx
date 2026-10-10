import { BellRing, CalendarPlus, Truck, AlertTriangle, Zap, ShieldCheck } from 'lucide-react';

/** KPI cards — every value comes from GET /api/dashboard-summary, never hardcoded. */
export default function MetricsRibbon({ summary }) {
    const cards = [
        {
            label: 'Active Alerts',
            value: summary?.activeAlerts,
            hint: 'Regulatory alerts awaiting resolution',
            icon: BellRing,
            accent: 'text-sky-300'
        },
        {
            label: 'Alerts Added Today',
            value: summary?.alertsAddedToday,
            hint: 'Ingested in the last 24h window',
            icon: CalendarPlus,
            accent: 'text-teal-300'
        },
        {
            label: 'Impacted Suppliers',
            value: summary?.impactedSuppliers,
            hint: 'Suppliers with ≥1 risk assessment',
            icon: Truck,
            accent: 'text-indigo-300'
        },
        {
            label: 'Critical Suppliers',
            value: summary?.criticalSuppliers,
            hint: 'Suppliers with a CRITICAL assessment',
            icon: AlertTriangle,
            accent: 'text-amber-300'
        },
        {
            label: 'Critical Assessments',
            value: summary?.criticalActions,
            hint: 'Assessments scored CRITICAL (80+)',
            icon: Zap,
            accent: 'text-rose-300'
        },
        {
            label: 'Safe Inventory',
            value: summary ? `${summary.safeInventoryPct}%` : undefined,
            hint: 'Suppliers with no open impact',
            icon: ShieldCheck,
            accent: 'text-emerald-300'
        }
    ];

    return (
        <div data-tour="kpis" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="glass-panel glass-panel-hover rounded-xl p-4"
                    title={card.hint}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">{card.label}</span>
                        <card.icon size={16} className={card.accent} />
                    </div>
                    <div className="mt-2 text-3xl font-bold text-white">
                        {card.value === undefined || card.value === null ? '–' : card.value}
                    </div>
                    <div className="mt-1 text-[11px] leading-snug text-slate-500">{card.hint}</div>
                </div>
            ))}
        </div>
    );
}
