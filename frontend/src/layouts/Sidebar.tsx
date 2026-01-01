import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { logout } = useAuth();

    const navItems = [
        { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
        { name: 'Analytics', icon: 'show_chart', path: '/analytics' },
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
            <aside className={`fixed top-0 left-0 bottom-0 w-72 h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-transform duration-300 z-[70] lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-16 flex items-center px-6 lg:px-8 border-b border-slate-200/50 dark:border-slate-800/50">
                    <Link to="/dashboard" className="flex items-center gap-3">
                        <div className="size-10 flex items-center justify-center rounded-lg bg-primary/10">
                            <span className="material-symbols-outlined text-primary text-[24px]">link</span>
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">LinkWeaver</span>
                    </Link>
                    <button onClick={onClose} className="lg:hidden ml-auto p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between h-[calc(100%-64px)] overflow-y-auto">
                    <nav className="flex flex-col gap-2">
                        {navItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={onClose}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg group transition-all ${isActive
                                        ? 'bg-primary text-white shadow-md shadow-primary/20 hover:bg-blue-600'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                                >
                                    <span className={`material-symbols-outlined text-[24px] ${isActive ? 'text-white' : 'group-hover:text-primary'} transition-colors`}>
                                        {item.icon}
                                    </span>
                                    <p className={`text-sm leading-normal ${isActive ? 'font-semibold' : 'font-medium group-hover:text-slate-900 dark:group-hover:text-white'} transition-colors`}>
                                        {item.name}
                                    </p>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex flex-col gap-2 border-t border-slate-200 dark:border-slate-800/50 pt-4">
                        <button onClick={logout} className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer">
                            <span className="material-symbols-outlined text-[24px]">logout</span>
                            <p className="text-sm font-medium leading-normal">Log Out</p>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};
