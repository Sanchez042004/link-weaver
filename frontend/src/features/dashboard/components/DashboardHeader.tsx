import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface DashboardHeaderProps { }

const DashboardHeader: React.FC<DashboardHeaderProps> = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

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

    return (
        <header className="h-16 sm:h-20 border-b border-border-dark/40 flex items-center justify-between px-4 sm:px-8 bg-background-dark/80 backdrop-blur-md sticky top-0 z-20">
            {/* Dynamic Title */}
            <h2 className="text-white font-bold text-2xl font-display tracking-tight truncate mr-4 hidden sm:block">
                {pageTitle}
            </h2>

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
        </header>
    );
};

export default DashboardHeader;
