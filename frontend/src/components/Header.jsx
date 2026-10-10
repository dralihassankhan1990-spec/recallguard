import { ShieldCheck, Wifi, WifiOff, Play, RotateCcw } from 'lucide-react';

/**
 * Top bar: product title, system status pill, SSE connection indicator,
 * guided-tour replay and hero-demo actions.
 */
export default function Header({ connected, lastSync, onReplayTour, onRunDemo }) {
    return (
        <header className="sticky top-0 z-40 border-b border-white/5 bg-surface/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-indigo to-brand-teal shadow-glow">
                        <ShieldCheck size={22} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold leading-tight">
                            Recall<span className="gradient-text">Guard</span>
                        </h1>
                        <p className="text-xs text-slate-400">AI-assisted food safety recall & supplier impact intelligence</p>
                    </div>
                </div>

                <div className="ml-auto flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                        </span>
                        OPERATIONAL
                    </span>
                    <span
                        title={connected ? 'Live event stream connected' : 'Event stream disconnected'}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                            connected
                                ? 'border-teal-500/30 bg-teal-500/10 text-teal-300'
                                : 'border-red-500/30 bg-red-500/10 text-red-300'
                        }`}
                    >
                        {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
                        {connected ? 'LIVE' : 'OFFLINE'}
                    </span>
                    {lastSync && (
                        <span className="hidden rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400 md:inline-block">
                            Last sync {lastSync}
                        </span>
                    )}
                    {onReplayTour && (
                        <button
                            onClick={onReplayTour}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-brand-indigo/50 hover:bg-brand-indigo/20"
                            title="Replay the guided tour"
                        >
                            <RotateCcw size={13} />
                            Replay tour
                        </button>
                    )}
                    {onRunDemo && (
                        <button
                            onClick={onRunDemo}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-violet px-3 py-1.5 text-xs font-semibold text-white shadow-glow transition hover:opacity-90"
                            title="Inject the EU RASFF Frozen Strawberries hero scenario into the pipeline"
                        >
                            <Play size={13} />
                            Run hero demo
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
