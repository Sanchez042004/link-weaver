import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`fixed top-0 left-0 bottom-0 w-72 h-full border-r border-border-dark/40 bg-background-dark transition-transform duration-300 z-[70] lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-24 flex items-center px-8">
                    {location.pathname !== '/dashboard' ? (
                        <Link to="/dashboard">
                            <Logo />
                        </Link>
                    ) : (
                        <Logo />
                    )}
                    <button onClick={onClose} className="lg:hidden ml-auto p-2 text-slate-500 hover:bg-surface-dark rounded-lg">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="px-6 pb-6 flex-1 flex flex-col justify-between h-[calc(100%-96px)]">
                    <div className="flex flex-col gap-6">
                        <nav className="flex flex-col gap-2">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={onClose}
                                        className={`flex items-center gap-3 px-6 py-3.5 rounded-full transition-all border ${isActive
                                            ? 'bg-primary/5 border-primary/40 text-primary shadow-[inset_0_0_12px_rgba(236,91,19,0.05)]'
                                            : 'text-slate-400 border-transparent hover:bg-surface-dark/40 hover:text-white'}`}
                                    >
                                        <span className={`material-symbols-outlined text-[24px] ${isActive ? 'text-primary' : 'group-hover:text-primary'} transition-colors`}>
                                            {item.icon}
                                        </span>
                                        <p className={`text-sm tracking-wide ${isActive ? 'font-bold' : 'font-medium'} font-display`}>
                                            {item.name}
                                        </p>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Tips Section */}
                        <div className="mt-4 p-5 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 size-20 bg-primary/10 rounded-full blur-2xl" />
                            <div className="relative z-10 flex flex-col items-center text-center gap-4">
                                <div className="flex flex-col items-center gap-1 text-primary">
                                    <span className="material-symbols-outlined text-[24px]">lightbulb</span>
                                    <h4 className="text-white font-bold text-sm uppercase tracking-wider">Quick Tips</h4>
                                </div>
                                <ul className="space-y-4">
                                    <li>
                                        <p className="text-slate-400 text-[11px] leading-snug">
                                            <span className="text-slate-200 font-bold block mb-1">Custom Aliases</span>
                                            Increase CTR by up to 30% with memorable names.
                                        </p>
                                    </li>
                                    <li>
                                        <p className="text-slate-400 text-[11px] leading-snug">
                                            <span className="text-slate-200 font-bold block mb-1">QR Codes</span>
                                            Perfect for offline marketing and business cards.
                                        </p>
                                    </li>
                                    <li>
                                        <p className="text-slate-400 text-[11px] leading-snug">
                                            <span className="text-slate-200 font-bold block mb-1">Smart Search</span>
                                            Use the header search for instant analytics.
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2 border-t border-border-dark/30 pt-6">
                            <Link
                                to="/settings"
                                onClick={onClose}
                                className={`flex items-center gap-3 px-6 py-3 transition-all ${location.pathname === '/settings' ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
                            >
                                <span className="material-symbols-outlined text-[22px]">settings</span>
                                <p className="text-sm font-bold font-display">Settings</p>
                            </Link>
                        </div>

                        {/* Create Link Button matching design */}
                        <button
                            onClick={() => navigate('/dashboard', { state: { openCreateModal: true } })}
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-primary hover:brightness-110 text-white font-black text-sm shadow-xl shadow-primary/20 transition-all active:scale-[0.98] font-display group"
                        >
                            <span className="material-symbols-outlined text-[20px] font-black group-hover:rotate-90 transition-all duration-300">add</span>
                            <span>Create New Link</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};
