import { ScrollText } from 'lucide-react';

const ACTION_TONES = {
    ALERT_INGESTED: 'text-sky-300',
    SUPPLIER_MATCHED: 'text-indigo-300',
    RISK_ASSESSMENT_CREATED: 'text-violet-300',
    AUTOMATED_HOLD: 'text-rose-300',
    NO_SUPPLIER_MATCH: 'text-slate-400',
    BATCH_HOLD_TRIGGERED: 'text-red-300',
    SUPPLIER_AUDIT_REQUESTED: 'text-amber-300'
};

/** Recent slice of the system automation audit log. */
export default function ActionLog({ actions, limit = 8 }) {
    const rows = (actions || []).slice(0, limit);

    return (
        <div data-tour="log" className="glass-panel rounded-xl p-5">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                    <ScrollText size={15} className="text-slate-500" />
                    System automation log
                </h3>
                <span className="text-xs text-slate-500">{(actions || []).length} events</span>
            </div>
            {rows.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-500">
                    No automation events yet — ingest an alert to start the audit trail.
                </p>
            ) : (
                <ol className="space-y-2">
                    {rows.map((a) => (
                        <li
                            key={a.id}
                            className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2"
                        >
                            <span className="min-w-[64px] shrink-0 pt-0.5 font-mono text-[11px] text-slate-500">
                                {String(a.created_at || '').slice(11, 19)}
                            </span>
                            <div className="min-w-0">
                                <div className={`text-[11px] font-bold tracking-wide ${ACTION_TONES[a.action_type] || 'text-slate-300'}`}>
                                    {String(a.action_type || '').replace(/_/g, ' ')}
                                </div>
                                <div className="truncate text-xs text-slate-400" title={a.description}>
                                    {a.description}
                                </div>
                            </div>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}
