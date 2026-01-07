import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../../components/Logo';

interface NavItemProps {
    to: string;
    icon: string;
    label: string;
    isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-6 py-3.5 rounded-full transition-all border ${isActive
            ? 'bg-primary/5 border-primary/40 text-primary shadow-[inset_0_0_12px_rgba(236,91,19,0.05)]'
            : 'text-slate-400 border-transparent hover:bg-surface-dark/40 hover:text-white'}`}
    >
        <span className={`material-symbols-outlined text-[24px] ${isActive ? 'text-primary' : ''}`}>
            {icon}
        </span>
        <p className={`text-sm tracking-wide ${isActive ? 'font-bold' : 'font-medium'} font-display`}>
            {label}
        </p>
    </Link>
);

interface DashboardSidebarProps {
    onCreateLink: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ onCreateLink }) => {
    const location = useLocation();

    const navItems = [
        { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    ];

    return (
        <aside className="flex flex-col w-72 border-r border-border-dark/40 bg-background-dark h-full shrink-0 transition-all duration-300 hidden lg:flex">
            <div className="h-24 flex items-center px-8">
                {location.pathname !== '/dashboard' ? (
                    <Link to="/dashboard">
                        <Logo />
                    </Link>
                ) : (
                    <Logo />
                )}
            </div>

            <div className="px-6 pb-6 flex-1 flex flex-col justify-between h-[calc(100%-96px)]">
                <div className="flex flex-col gap-6">
                    <nav className="flex flex-col gap-2 mt-4">
                        {navItems.map((item) => (
                            <NavItem
                                key={item.to}
                                to={item.to}
                                icon={item.icon}
                                label={item.label}
                                isActive={location.pathname === item.to}
                            />
                        ))}
                    </nav>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2 border-t border-border-dark/30 pt-6">
                        <Link
                            to="/settings"
                            className={`flex items-center gap-3 px-6 py-3 transition-all ${location.pathname === '/settings' ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined text-[22px]">settings</span>
                            <p className="text-sm font-bold font-display">Settings</p>
                        </Link>
                    </div>

                    {/* Create Link Button matching design */}
                    <button
                        onClick={onCreateLink}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-primary hover:brightness-110 text-white font-black text-sm shadow-xl shadow-primary/20 transition-all active:scale-[0.98] font-display group"
                    >
                        <span className="material-symbols-outlined text-[20px] font-black group-hover:rotate-90 transition-all duration-300">add</span>
                        <span>Create New Link</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
