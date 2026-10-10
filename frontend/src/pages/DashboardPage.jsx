import { FlaskConical, X } from 'lucide-react';
import HeroBanner from '../components/HeroBanner.jsx';
import MetricsRibbon from '../components/MetricsRibbon.jsx';
import SupplyChainFlow from '../components/SupplyChainFlow.jsx';
import AlertFeed from '../components/AlertFeed.jsx';
import ImpactPanel from '../components/ImpactPanel.jsx';
import ActionLog from '../components/ActionLog.jsx';
import GuidedTour from '../components/GuidedTour.jsx';

/**
 * Dashboard tab: hero + KPIs + live pipeline + alert feed / impact analysis
 * + automation log, plus the demo-mode banner and first-run guided tour.
 */
export default function DashboardPage({
    summary,
    alerts,
    selectedAlertId,
    setSelectedAlertId,
    selectedAlert,
    actions,
    busy,
    activeStage,
    onBatchHold,
    onSupplierAudit,
    tourOpen,
    onCloseTour,
    demoMode,
    onDismissDemo
}) {
    return (
        <div className="space-y-6">
            {demoMode && (
                <div className="flex items-center gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3">
                    <FlaskConical size={18} className="shrink-0 text-amber-300" />
                    <p className="text-xs font-semibold tracking-wide text-amber-200">
                        SIMULATION MODE — the hero demo injected demo data into the pipeline. No external communication is sent.
                    </p>
                    <button
                        onClick={onDismissDemo}
                        className="ml-auto shrink-0 text-amber-300/70 transition hover:text-amber-200"
                        aria-label="Dismiss demo banner"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            <GuidedTour open={tourOpen} onClose={onCloseTour} />

            <HeroBanner />

            <MetricsRibbon summary={summary} />

            <SupplyChainFlow activeStage={activeStage} />

            <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
                <AlertFeed alerts={alerts} selectedAlertId={selectedAlertId} onSelect={setSelectedAlertId} />
                <ImpactPanel alert={selectedAlert} busy={busy} onBatchHold={onBatchHold} onSupplierAudit={onSupplierAudit} />
            </div>

            <ActionLog actions={actions} />
        </div>
    );
}
