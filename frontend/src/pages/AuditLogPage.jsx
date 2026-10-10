import { ScrollText, Download } from 'lucide-react';
import { api } from '../services/api.js';

/**
 * Audit Log tab: the full system automation log (newest 200) as a table,
 * plus the CSV export button (GET /api/actions/export.csv).
 */
export default function AuditLogPage({ actions }) {
    const rows = actions || [];

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
                <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                    <ScrollText size={20} className="text-brand-indigo" />
                    Audit log
                </h2>
                <span className="text-xs text-slate-500">{rows.length} events (newest 200)</span>
                <a
                    href={api.exportActionsCsvUrl()}
                    download
                    className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-brand-teal/40 bg-brand-teal/15 px-3 py-1.5 text-xs font-semibold text-teal-200 transition hover:bg-brand-teal/25"
                >
                    <Download size={13} />
                    Export CSV
                </a>
            </div>

            <div className="glass-panel overflow-hidden rounded-xl">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                            <th className="px-4 py-3">Time</th>
                            <th className="px-4 py-3">Action</th>
                            <th className="px-4 py-3">Entity</th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3">By</th>
                            <th className="px-4 py-3">Source</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-10 text-center">
                                    <p className="text-sm font-medium text-slate-300">No audit events yet</p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Ingest an alert (hero demo or Playwright scraper) to start the trail.
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            rows.map((a) => (
                                <tr key={a.id} className="border-b border-white/5 transition hover:bg-white/[0.03]">
                                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[11px] text-slate-500">
                                        {String(a.created_at || '').replace('T', ' ').slice(0, 19)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2.5 text-[11px] font-bold tracking-wide text-slate-200">
                                        {String(a.action_type || '').replace(/_/g, ' ')}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-slate-400">
                                        {a.entity_type}
                                        {a.entity_id ? ` #${a.entity_id}` : ''}
                                    </td>
                                    <td className="max-w-md px-4 py-2.5 text-xs text-slate-300">{a.description}</td>
                                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-slate-400">{a.triggered_by}</td>
                                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-slate-400">
                                        {String(a.trigger_source || '').replace(/_/g, ' ')}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
