import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import Logo from '../components/Logo';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased selection:bg-primary selection:text-white min-h-screen flex">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-72 flex flex-col min-h-screen overflow-x-hidden">
                {/* Mobile Header (Only on Small screens) */}
                <header className="lg:hidden h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-border-dark bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-40">
                    <Logo />
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 rounded-lg text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Open menu"
                    >
                        <span className="material-symbols-outlined text-[28px]">menu</span>
                    </button>
                </header>

                <main className="flex-1 relative bg-background-light dark:bg-background-dark overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};
