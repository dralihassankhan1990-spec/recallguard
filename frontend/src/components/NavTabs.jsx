import { NavLink } from 'react-router-dom';

const TABS = [
    { to: '/', label: 'Dashboard', end: true },
    { to: '/suppliers', label: 'Suppliers' },
    { to: '/alerts', label: 'Alerts' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/audit-log', label: 'Audit Log' }
];

export default function NavTabs() {
    return (
        <nav className="border-b border-white/5">
            <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-6">
                {TABS.map((tab) => (
                    <NavLink
                        key={tab.to}
                        to={tab.to}
                        end={tab.end}
                        className={({ isActive }) =>
                            `relative px-4 py-3 text-sm font-medium transition ${
                                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {tab.label}
                                {isActive && (
                                    <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-brand-indigo to-brand-teal" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
