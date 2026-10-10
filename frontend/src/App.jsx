import React, { useCallback, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CheckCircle2, AlertOctagon } from 'lucide-react';
import Header from './components/Header.jsx';
import NavTabs from './components/NavTabs.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import SuppliersPage from './pages/SuppliersPage.jsx';
import AlertsPage from './pages/AlertsPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import AuditLogPage from './pages/AuditLogPage.jsx';
import { api } from './services/api.js';
import { useRealtimeEvents } from './hooks/useRealtimeEvents.js';
import { TOUR_STORAGE_KEY } from './components/GuidedTour.jsx';

// Maps SSE event types -> pipeline stage key used by <SupplyChainFlow />
const EVENT_TO_STAGE = {
  ALERT_INGESTED: 'INGESTED',
  SUPPLIER_MATCHED: 'MATCHED',
  RISK_ASSESSED: 'ASSESSED',
  SUPPLIER_FLAGGED: 'CONTAINED',
  BATCH_HOLD_TRIGGERED: 'CONTAINED',
  ACTION_CREATED: 'LOGGED',
  SUPPLIER_AUDIT_REQUESTED: 'LOGGED'
};

export default function App() {
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [selectedAlertId, setSelectedAlertId] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [actions, setActions] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeStage, setActiveStage] = useState(null);
  const [demoMode, setDemoMode] = useState(false);
  // First run: open the guided tour unless it was dismissed before.
  const [tourOpen, setTourOpen] = useState(() => {
    try {
      return !localStorage.getItem(TOUR_STORAGE_KEY);
    } catch {
      return true;
    }
  });

  const showToast = (message, tone = 'success') => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 3500);
  };

  const refreshSummary = useCallback(async () => {
    const { summary } = await api.getDashboardSummary();
    setSummary(summary);
  }, []);

  const refreshAlerts = useCallback(async () => {
    const { alerts } = await api.getAlerts();
    setAlerts(alerts);
    return alerts;
  }, []);

  const refreshActions = useCallback(async () => {
    const { actions } = await api.getActions();
    setActions(actions);
  }, []);

  const refreshSuppliers = useCallback(async () => {
    const { suppliers } = await api.getSuppliers();
    setSuppliers(suppliers);
  }, []);

  const refreshSelectedAlert = useCallback(async (id) => {
    if (!id) return;
    const { alert } = await api.getAlert(id);
    setSelectedAlert(alert);
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshSummary(), refreshAlerts(), refreshActions(), refreshSuppliers()]);
  }, [refreshSummary, refreshAlerts, refreshActions, refreshSuppliers]);

  useEffect(() => {
    refreshAll().then(async () => {
      const { alerts } = await api.getAlerts();
      if (alerts.length > 0) setSelectedAlertId(alerts[0].id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedAlertId) refreshSelectedAlert(selectedAlertId);
  }, [selectedAlertId, refreshSelectedAlert]);

  const { connected } = useRealtimeEvents((type, data) => {
    if (EVENT_TO_STAGE[type]) {
      setActiveStage(EVENT_TO_STAGE[type]);
      setTimeout(() => setActiveStage(null), 4000);
    }

    if (type === 'ALERT_INGESTED') {
      refreshAlerts().then(() => setSelectedAlertId(data.id));
      refreshSummary();
      showToast(`New alert ingested: ${data.source_agency} — ${data.ingredient_name}`);
    }
    if (
      ['RISK_ASSESSED', 'SUPPLIER_MATCHED', 'SUPPLIER_FLAGGED', 'ACTION_CREATED', 'BATCH_HOLD_TRIGGERED', 'SUPPLIER_AUDIT_REQUESTED'].includes(
        type
      )
    ) {
      refreshSummary();
      refreshActions();
      refreshSuppliers();
      if (selectedAlertId) refreshSelectedAlert(selectedAlertId);
    }
  });

  const handleBatchHold = async (assessmentId) => {
    setBusy(true);
    try {
      const res = await api.triggerBatchHold(assessmentId);
      showToast(res.message, 'success');
      await Promise.all([refreshSummary(), refreshActions(), refreshSelectedAlert(selectedAlertId)]);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleSupplierAudit = async (supplierId) => {
    setBusy(true);
    try {
      const res = await api.triggerSupplierAudit(supplierId);
      showToast(res.message, 'success');
      await Promise.all([refreshSummary(), refreshActions()]);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  /**
   * Demo mode: inject the hero scenario (EU RASFF / Frozen Strawberries /
   * Hepatitis A, external id RASFF-2026-4102) straight into the ingestion
   * pipeline, so the 5-minute demo works without the Python scraper.
   * Clearly labeled as simulation everywhere it surfaces.
   */
  const handleRunDemo = async () => {
    setBusy(true);
    try {
      const res = await fetch('http://localhost:4000/api/alerts/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-RecallGuard-Source': 'DEMO_MODE' },
        body: JSON.stringify({
          external_alert_id: 'RASFF-2026-4102',
          source_agency: 'EU RASFF',
          ingredient_name: 'Frozen Strawberries',
          hazard_type: 'Hepatitis A virus',
          hazard_category: 'BIOLOGICAL',
          alert_date: new Date().toISOString().slice(0, 10),
          status: 'ACTIVE',
          source_url: 'https://recallguard.local/mock-portal/rasff-2026-4102'
        })
      });
      const body = await res.json();
      if (body.duplicate) {
        showToast('Hero demo alert already ingested — showing existing result.', 'success');
      } else {
        showToast('Hero demo injected: EU RASFF — Frozen Strawberries (92/CRITICAL/HOLD).', 'success');
      }
      setDemoMode(true);
      await Promise.all([refreshSummary(), refreshAlerts(), refreshActions(), refreshSuppliers()]);
    } catch (err) {
      showToast(`Demo failed: ${err.message}`, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh-1">
      <Header
        connected={connected}
        lastSync={summary?.latestSync}
        onReplayTour={() => setTourOpen(true)}
        onRunDemo={handleRunDemo}
      />
      <NavTabs />

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                summary={summary}
                alerts={alerts}
                selectedAlertId={selectedAlertId}
                setSelectedAlertId={setSelectedAlertId}
                selectedAlert={selectedAlert}
                actions={actions}
                busy={busy}
                activeStage={activeStage}
                onBatchHold={handleBatchHold}
                onSupplierAudit={handleSupplierAudit}
                tourOpen={tourOpen}
                onCloseTour={() => setTourOpen(false)}
                demoMode={demoMode}
                onDismissDemo={() => setDemoMode(false)}
              />
            }
          />
          <Route
            path="/suppliers"
            element={<SuppliersPage suppliers={suppliers} onSupplierAudit={handleSupplierAudit} busy={busy} />}
          />
          <Route
            path="/alerts"
            element={<AlertsPage alerts={alerts} onOpenInDashboard={(id) => setSelectedAlertId(id)} />}
          />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/audit-log" element={<AuditLogPage actions={actions} />} />
        </Routes>
      </main>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm shadow-lg ${
            toast.tone === 'error'
              ? 'border-red-500/40 bg-red-950 text-red-300'
              : 'border-emerald-500/40 bg-emerald-950 text-emerald-300'
          }`}
        >
          {toast.tone === 'error' ? <AlertOctagon size={16} /> : <CheckCircle2 size={16} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
