import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
    children: React.ReactNode;
    noScroll?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, noScroll = false }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const menuRef = useRef<HTMLDivElement>(null);

    const handleSearch = () => {
        const alias = searchTerm.trim().replace(/^\//, '');
        if (alias) {
            navigate(`/analytics/${alias}`);
            setSearchTerm('');
        }
    };

    const initial = user?.name?.charAt(0).toUpperCase() || '?';

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="h-screen w-screen overflow-hidden flex antialiased bg-background text-text-primary">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="h-[56px] border-b border-border-primary flex items-center justify-between px-6 bg-background flex-shrink-0 z-30">
                    {/* Logo on mobile, text title on desktop */}
                    <div className="text-[18px] font-medium text-text-primary hidden md:block">Overview</div>
                    <div className="md:hidden">
                        <img src="/logo.png" alt="Knot.ly" className="h-[34px] w-auto" />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative group hidden sm:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-text-muted">search</span>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="bg-surface border border-border-secondary rounded-md pl-9 pr-4 py-1.5 text-[13px] w-64 focus:outline-none focus:ring-1 focus:ring-accent transition-all text-text-primary placeholder-text-muted"
                                placeholder="Search alias…"
                            />
                            {searchTerm && (
                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-text-muted border border-border-secondary rounded px-1 py-0.5 leading-none select-none pointer-events-none">↵</span>
                            )}
                        </div>

                        {/* Avatar + Dropdown */}
                        <div className="relative flex-shrink-0" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen(prev => !prev)}
                                className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-[13px] font-semibold hover:opacity-90 transition-opacity select-none"
                            >
                                {initial}
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 top-full mt-3 w-52 bg-surface border border-border-primary rounded-xl shadow-xl overflow-hidden z-50">
                                    <div className="px-4 py-3 border-b border-border-primary">
                                        <p className="text-[13px] font-medium text-text-primary truncate">{user?.name}</p>
                                        <p className="text-[11px] text-text-muted truncate">{user?.email}</p>
                                    </div>
                                    {/* Mobile-only: nav links */}
                                    <div className="md:hidden border-b border-border-primary py-1">
                                        {[
                                            { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
                                            { to: '/links', icon: 'link', label: 'My Links' },
                                            { to: '/settings', icon: 'settings', label: 'Settings' },
                                        ].map(({ to, icon, label }) => (
                                            <NavLink
                                                key={to}
                                                to={to}
                                                onClick={() => setMenuOpen(false)}
                                                className={({ isActive }) =>
                                                    `w-full flex items-center gap-2 px-4 py-2.5 text-[13px] transition-colors ${isActive ? 'text-text-primary bg-surface-hover' : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
                                                    }`
                                                }
                                            >
                                                <span className="material-symbols-outlined text-[16px]">{icon}</span>
                                                {label}
                                            </NavLink>
                                        ))}
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-2.5 text-[13px] text-danger hover:bg-danger/10 transition-colors flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">logout</span>
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className={`flex-1 ${noScroll ? 'overflow-hidden' : 'overflow-y-auto'} p-8`}>
                    <div className={`max-w-6xl mx-auto ${noScroll ? 'h-full flex flex-col' : ''}`}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

