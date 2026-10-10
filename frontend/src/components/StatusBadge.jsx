/** Severity / status / containment pill. */

const STYLES = {
    CRITICAL: 'border-rose-500/40 bg-rose-500/15 text-rose-300',
    ELEVATED: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
    LOW: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
    ACTIVE: 'border-sky-500/40 bg-sky-500/15 text-sky-300',
    RESOLVED: 'border-slate-500/40 bg-slate-500/15 text-slate-300',
    HOLD: 'border-rose-500/40 bg-rose-500/15 text-rose-300',
    MONITOR: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
    NONE: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
    BLOCKED: 'border-red-600/50 bg-red-600/20 text-red-200',
    HIGH: 'border-rose-500/40 bg-rose-500/15 text-rose-300',
    MEDIUM: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
    EXACT: 'border-teal-500/40 bg-teal-500/15 text-teal-300',
    CASE_INSENSITIVE: 'border-teal-500/40 bg-teal-500/15 text-teal-300',
    NORMALIZED: 'border-teal-500/40 bg-teal-500/15 text-teal-300',
    PARTIAL: 'border-indigo-500/40 bg-indigo-500/15 text-indigo-300'
};

export default function StatusBadge({ value }) {
    const v = String(value || '—');
    const style = STYLES[v] || 'border-white/15 bg-white/5 text-slate-300';
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${style}`}>
            {v.replace(/_/g, ' ')}
        </span>
    );
}
