import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

interface DashboardHeaderProps { }

const DashboardHeader: React.FC<DashboardHeaderProps> = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Determine Dynamic Title
    let pageTitle = 'Dashboard';
    if (location.pathname === '/dashboard') {
        pageTitle = 'Overview';
    } else if (location.pathname.startsWith('/analytics/')) {
        const alias = location.pathname.split('/')[2];
        pageTitle = `Analytics / ${alias}`;
    } else if (location.pathname === '/settings') {
        pageTitle = 'Settings';
    }

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/analytics/${searchTerm.trim()}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleLogout = () => {
        setMenuOpen(false);
        logout();
        navigate('/');
    };

    const initial = user?.name?.charAt(0).toUpperCase() || '?';

    return (
        <header className="h-16 sm:h-20 border-b border-border-dark/40 flex items-center justify-between px-4 sm:px-8 bg-background-dark/80 backdrop-blur-md sticky top-0 z-20">
            {/* Dynamic Title */}
            <h2 className="text-white font-bold text-2xl font-display tracking-tight truncate mr-4 hidden sm:block">
                {pageTitle}
            </h2>

            <div className="flex items-center gap-4 ml-auto">
                {/* Search */}
                <div className="flex items-center bg-surface-dark rounded-xl h-10 px-3 w-full sm:w-64 border border-border-dark/60 focus-within:border-primary/50 transition-colors">
                    <input
                        className="bg-transparent border-none focus:ring-0 text-white text-sm w-full placeholder-slate-500 mr-2"
                        placeholder="Search link alias..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={handleSearch}
                        className="flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">search</span>
                    </button>
                </div>

                {/* Avatar + Dropdown */}
                <div className="relative flex-shrink-0" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen(prev => !prev)}
                        className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white text-[14px] font-semibold hover:opacity-90 transition-opacity select-none"
                    >
                        {initial}
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-52 bg-surface border border-border-primary rounded-xl shadow-xl overflow-hidden z-50">
                            <div className="px-4 py-3 border-b border-border-primary">
                                <p className="text-[13px] font-medium text-text-primary truncate">{user?.name}</p>
                                <p className="text-[11px] text-text-muted truncate">{user?.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
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
    );
};

export default DashboardHeader;
