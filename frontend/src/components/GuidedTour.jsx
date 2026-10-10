import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { X, ArrowRight, PartyPopper } from 'lucide-react';

export const TOUR_STORAGE_KEY = 'recallguard.tour.dismissed';

const STEPS = [
    {
        id: 'welcome',
        target: null,
        title: 'Welcome to RecallGuard',
        body: 'This is a simulated food-safety operations console. A regulatory alert flows through ingestion, supplier matching, risk scoring and containment — all live, all audit-logged. Let me show you around in 5 steps.'
    },
    {
        id: 'kpis',
        target: 'kpis',
        title: 'Live KPIs',
        body: 'Every number here is computed live from the database — never hardcoded. Watch Active Alerts and Critical Suppliers jump when a new alert lands.'
    },
    {
        id: 'flow',
        target: 'flow',
        title: 'The pipeline, visualized',
        body: 'Ingested → Matched → Assessed → Contained → Logged. When an alert is processed, each stage lights up in real time via the SSE event stream.'
    },
    {
        id: 'feed',
        target: 'feed',
        title: 'Alert feed',
        body: 'Regulatory alerts arrive here, newest first. Click any card to open its impact analysis — including the explainable risk breakdown.'
    },
    {
        id: 'impact',
        target: 'impact',
        title: 'Impact analysis',
        body: 'Matched suppliers, risk score out of 100, severity and containment recommendation. "Explain Risk" shows exactly how the score was calculated — no black box. The two action buttons are real state changes, clearly labeled as simulations.'
    },
    {
        id: 'log',
        target: 'log',
        title: 'Audit trail',
        body: 'Every step — ingestion, matching, scoring, containment, operator actions — is written to the system log with a timestamp. This is the traceability a food-safety workflow needs. Enjoy the demo!'
    }
];

/**
 * First-run guided tour overlay. 6 steps, Next/Skip, dismissal persisted
 * to localStorage. Reopened any time via the "Replay tour" header button.
 */
export default function GuidedTour({ open, onClose }) {
    const [stepIndex, setStepIndex] = useState(0);
    const [spot, setSpot] = useState(null);

    const step = STEPS[stepIndex];

    const measure = useCallback(() => {
        if (!step || !step.target) {
            setSpot(null);
            return;
        }
        const el = document.querySelector(`[data-tour="${step.target}"]`);
        if (!el) {
            setSpot(null);
            return;
        }
        const rect = el.getBoundingClientRect();
        setSpot({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
        });
    }, [step]);

    useLayoutEffect(() => {
        if (open) {
            setStepIndex(0);
        }
    }, [open ]);

    useEffect(() => {
        if (!open) return;
        measure();
        window.addEventListener('resize', measure);
        window.addEventListener('scroll', measure, true);
        const t = setTimeout(measure, 350); // let dashboard data settle
        return () => {
            window.removeEventListener('resize', measure);
            window.removeEventListener('scroll', measure, true);
            clearTimeout(t);
        };
    }, [open, measure]);

    if (!open) return null;

    const last = stepIndex === STEPS.length - 1;

    const dismiss = (finished) => {
        try {
            localStorage.setItem(TOUR_STORAGE_KEY, finished ? 'finished' : 'skipped');
        } catch {
            /* storage unavailable — tour just won't persist */
        }
        onClose();
    };

    // Card placement: below the spotlight when there is room, else above.
    let cardStyle = { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };
    if (spot) {
        const cardWidth = 340;
        let left = Math.min(Math.max(spot.left, 16), window.innerWidth - cardWidth - 16);
        const below = spot.top + spot.height + 16 + 220 < window.innerHeight + window.scrollY;
        const top = below ? spot.top + spot.height + 16 : Math.max(16, spot.top - 236);
        cardStyle = { left, top, width: cardWidth };
    }

    return (
        <div className="fixed inset-0 z-[100]">
            {/* dim layer */}
            <div className="absolute inset-0 bg-black/70" onClick={() => dismiss(false)} />

            {/* spotlight ring */}
            {spot && (
                <div
                    className="absolute rounded-xl border-2 border-brand-teal shadow-glow-teal transition-all duration-300"
                    style={{ top: spot.top - 6, left: spot.left - 6, width: spot.width + 12, height: spot.height + 12, pointerEvents: 'none' }}
                />
            )}

            {/* step card */}
            <div className="absolute rounded-xl border border-white/10 bg-surface-panel p-5 shadow-2xl" style={cardStyle}>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                        {last ? <PartyPopper size={18} className="text-brand-teal" /> : null}
                        <h3 className="text-sm font-bold text-white">{step.title}</h3>
                    </div>
                    <button onClick={() => dismiss(false)} className="text-slate-500 transition hover:text-white" aria-label="Close tour">
                        <X size={16} />
                    </button>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{step.body}</p>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                        Step {stepIndex + 1} of {STEPS.length}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => dismiss(false)}
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10"
                        >
                            Skip
                        </button>
                        <button
                            onClick={() => (last ? dismiss(true) : setStepIndex(stepIndex + 1))}
                            className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-violet px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
                        >
                            {last ? 'Finish' : 'Next'}
                            {!last && <ArrowRight size={13} />}
                        </button>
                    </div>
                </div>
                {/* progress dots */}
                <div className="mt-3 flex gap-1.5">
                    {STEPS.map((s, i) => (
                        <span
                            key={s.id}
                            className={`h-1.5 flex-1 rounded-full ${i <= stepIndex ? 'bg-brand-teal' : 'bg-white/10'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
