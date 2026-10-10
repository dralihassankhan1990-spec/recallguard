import { Download, GitBranch, Gauge, ShieldAlert, FileCheck2 } from 'lucide-react';

/**
 * Animated visualization of the ingestion pipeline:
 * INGESTED → MATCHED → ASSESSED → CONTAINED → LOGGED.
 * The `activeStage` prop (driven by SSE events) spotlights the stage
 * currently being processed.
 */
const STAGES = [
    { key: 'INGESTED', label: 'Ingested', hint: 'Alert validated & stored', icon: Download },
    { key: 'MATCHED', label: 'Matched', hint: 'Suppliers found in master', icon: GitBranch },
    { key: 'ASSESSED', label: 'Assessed', hint: 'Risk scored 1–100', icon: Gauge },
    { key: 'CONTAINED', label: 'Contained', hint: 'HOLD / MONITOR / NONE', icon: ShieldAlert },
    { key: 'LOGGED', label: 'Logged', hint: 'Audit trail written', icon: FileCheck2 }
];

export default function SupplyChainFlow({ activeStage }) {
    return (
        <div data-tour="flow" className="glass-panel rounded-xl p-5">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Live pipeline</h3>
                <span className="text-xs text-slate-500">Watch the stages light up as an alert is processed</span>
            </div>
            <div className="flex items-stretch">
                {STAGES.map((stage, i) => {
                    const active = activeStage === stage.key;
                    const Icon = stage.icon;
                    return (
                        <div key={stage.key} className="flex flex-1 items-stretch">
                            <div
                                className={`flex flex-1 flex-col items-center rounded-xl border px-2 py-4 text-center transition-all duration-500 ${
                                    active
                                        ? 'border-brand-teal/60 bg-brand-teal/10 shadow-glow-teal'
                                        : 'border-white/5 bg-white/[0.02]'
                                }`}
                                title={stage.hint}
                            >
                                <span
                                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 ${
                                        active
                                            ? 'border-brand-teal bg-brand-teal/20 text-teal-200'
                                            : 'border-white/10 bg-white/5 text-slate-500'
                                    }`}
                                >
                                    <Icon size={18} />
                                </span>
                                <span className={`mt-2 text-xs font-bold tracking-wide ${active ? 'text-teal-200' : 'text-slate-400'}`}>
                                    {stage.label}
                                </span>
                                <span className="mt-0.5 hidden text-[10px] text-slate-500 sm:block">{stage.hint}</span>
                            </div>
                            {i < STAGES.length - 1 && (
                                <div className="flex items-center px-1">
                                    <div className={`h-0.5 w-4 rounded sm:w-8 ${activeStage ? 'bg-brand-teal/50' : 'bg-white/10'}`} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
