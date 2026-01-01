import React, { useState } from 'react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="bg-slate-50 dark:bg-slate-900 font-display text-slate-900 dark:text-white antialiased selection:bg-primary selection:text-white min-h-screen flex">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-72 flex flex-col min-h-screen overflow-x-hidden">
                {/* Mobile Header (Only on Small screens) */}
                <header className="lg:hidden h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex items-center gap-2">
                        <div className="size-8 flex items-center justify-center rounded-lg bg-primary/10">
                            <span className="material-symbols-outlined text-primary">link</span>
                        </div>
                        <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">LinkWeaver</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Open menu"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </header>

                <main className="flex-1 relative">
                    {children}
                </main>
            </div>
        </div>
    );
};
