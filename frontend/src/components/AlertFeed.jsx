import { Inbox } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

/**
 * Clickable list of regulatory alerts, newest first.
 * Clicking a card selects it in the ImpactPanel (no page reload).
 */
export default function AlertFeed({ alerts, selectedAlertId, onSelect }) {
    if (!alerts || alerts.length === 0) {
        return (
            <div data-tour="feed" className="glass-panel rounded-xl p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Alert feed</h3>
                <div className="flex flex-col items-center py-10 text-center">
                    <Inbox size={36} className="mb-3 text-slate-600" />
                    <p className="text-sm font-medium text-slate-300">No alerts yet</p>
                    <p className="mt-1 max-w-xs text-xs text-slate-500">
                        Run the hero demo (header button) or the Playwright scraper to ingest the first regulatory alert.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div data-tour="feed" className="glass-panel rounded-xl p-4">
            <div className="mb-3 flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Alert feed</h3>
                <span className="text-xs text-slate-500">{alerts.length} total</span>
            </div>
            <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
                {alerts.map((alert) => {
                    const selected = alert.id === selectedAlertId;
                    return (
                        <button
                            key={alert.id}
                            onClick={() => onSelect && onSelect(alert.id)}
                            className={`w-full rounded-lg border p-3 text-left transition ${
                                selected
                                    ? 'border-brand-indigo/60 bg-brand-indigo/15 shadow-glow'
                                    : 'border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.05]'
                            }`}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold text-slate-300">{alert.source_agency}</span>
                                <StatusBadge value={alert.status} />
                            </div>
                            <div className="mt-1.5 text-sm font-medium text-white">{alert.ingredient_name}</div>
                            <div className="mt-0.5 truncate text-xs text-slate-400">{alert.hazard_type}</div>
                            <div className="mt-2 flex items-center justify-between">
                                <StatusBadge value={alert.hazard_category} />
                                <span className="text-[11px] text-slate-500">{alert.alert_date}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
