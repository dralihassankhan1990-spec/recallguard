/**
 * Hero banner with an ORIGINAL inline SVG illustration (no external images —
 * the page never depends on a stock-photo URL being reachable or licensed).
 *
 * Scene: a stylized supply chain — farm → truck → factory → warehouse →
 * shield (RecallGuard) — with animated dashes flowing along the route.
 */
function SupplyChainIllustration() {
    return (
        <svg viewBox="0 0 560 220" className="h-full w-full" role="img" aria-label="Illustration of a food supply chain flowing into RecallGuard">
            <defs>
                <linearGradient id="heroRoute" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#2dd4bf" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="heroNode" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1b2547" />
                    <stop offset="100%" stopColor="#0f1730" />
                </linearGradient>
                <filter id="heroGlow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* route line with animated flow */}
            <path d="M40 150 C 120 150, 150 110, 200 110 S 320 150, 380 110 S 480 120, 520 120"
                  fill="none" stroke="url(#heroRoute)" strokeWidth="3" strokeDasharray="10 8"
                  className="animate-dash" opacity="0.9" />

            {/* nodes */}
            {[
                { x: 40, y: 150, label: 'FARM', icon: 'M32 142 h16 v-8 l-8 -10 -8 10 z M36 142 v10 h8 v-10' },
                { x: 200, y: 110, label: 'TRUCK', icon: 'M192 104 h10 v8 h4 l2 4 h-2 v-4 h-14 z M196 114 a3 3 0 1 0 0.1 0' },
                { x: 320, y: 135, label: 'PLANT', icon: 'M312 128 h16 v8 h-16 z M314 128 l2 -6 2 6 2 -6 2 6' },
                { x: 450, y: 118, label: 'WAREHOUSE', icon: 'M442 112 h16 v10 h-16 z M442 112 l8 -6 8 6' }
            ].map((n) => (
                <g key={n.label}>
                    <circle cx={n.x} cy={n.y} r="24" fill="url(#heroNode)" stroke="url(#heroRoute)" strokeWidth="2" />
                    <path d={n.icon} fill="none" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <text x={n.x} y={n.y + 42} textAnchor="middle" fill="#64748b" fontSize="10" letterSpacing="2">{n.label}</text>
                </g>
            ))}

            {/* RecallGuard shield — the intelligence layer watching the chain */}
            <g filter="url(#heroGlow)" className="animate-float-slow">
                <path d="M520 84 l22 8 v16 c0 16 -10 26 -22 32 c-12 -6 -22 -16 -22 -32 v-16 z"
                      fill="#141d38" stroke="#2dd4bf" strokeWidth="2.5" />
                <path d="M514 112 l7 7 l12 -13" fill="none" stroke="#2dd4bf" strokeWidth="3"
                      strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <text x="520" y="168" textAnchor="middle" fill="#2dd4bf" fontSize="11" fontWeight="700" letterSpacing="1.5">RECALLGUARD</text>

            {/* floating alert pings */}
            <circle cx="150" cy="70" r="4" fill="#f43f5e" opacity="0.8" className="animate-float" />
            <circle cx="380" cy="60" r="3" fill="#f59e0b" opacity="0.8" className="animate-float" style={{ animationDelay: '1.5s' }} />
            <circle cx="270" cy="180" r="3" fill="#6366f1" opacity="0.8" className="animate-float" style={{ animationDelay: '3s' }} />
        </svg>
    );
}

export default function HeroBanner() {
    return (
        <section className="glass-panel shimmer-border relative overflow-hidden rounded-2xl">
            <div className="blob left-[-40px] top-[-40px] h-48 w-48 bg-brand-indigo/40" />
            <div className="blob bottom-[-60px] right-[10%] h-56 w-56 bg-brand-teal/30" />
            <div className="relative grid gap-6 p-6 md:grid-cols-[1.2fr_1fr] md:p-8">
                <div className="flex flex-col justify-center">
                    <span className="mb-3 inline-flex w-fit items-center rounded-full border border-brand-teal/30 bg-brand-teal/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-teal-300">
                        Proof of concept · local demo
                    </span>
                    <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">
                        From regulatory alert to{' '}
                        <span className="gradient-text">containment decision</span>{' '}
                        — in seconds.
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
                        RecallGuard watches regulatory signals, matches them against your supplier master,
                        scores the operational risk with a transparent, explainable model, and recommends
                        containment — every step written to an auditable log and pushed live to this dashboard.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-500">
                        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1">Deterministic risk model — no black box</span>
                        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1">4-stage supplier matching</span>
                        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1">Real-time SSE updates</span>
                    </div>
                </div>
                <div className="min-h-[200px]">
                    <SupplyChainIllustration />
                </div>
            </div>
        </section>
    );
}
