import { Building2, MapPin, Package } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

/** Grid card for the Suppliers page — click opens the detail modal. */
export default function SupplierCard({ supplier, onClick }) {
    return (
        <button
            onClick={() => onClick && onClick(supplier)}
            className="glass-panel glass-panel-hover w-full rounded-xl p-4 text-left"
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Building2 size={16} className="shrink-0 text-brand-indigo" />
                    <span className="font-semibold text-white">{supplier.company_name}</span>
                </div>
                <StatusBadge value={supplier.risk_tier} />
            </div>
            <div className="mt-3 space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                    <Package size={13} className="text-slate-500" />
                    {supplier.ingredient_supplied}
                </div>
                <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-slate-500" />
                    {supplier.country_of_origin}
                </div>
            </div>
            <div className="mt-3 border-t border-white/5 pt-2 text-[11px] text-slate-500">
                Click for assessment history
            </div>
        </button>
    );
}
