import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { CreateLinkModal } from '../features/links/components/CreateLinkModal';

export const Sidebar: React.FC = () => {
    const location = useLocation();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <aside className="hidden md:flex flex-col h-full w-[220px] bg-sidebar-bg border-r border-border-primary py-6 px-3 flex-shrink-0 z-40">
            <div className="px-3 mb-8">
                <img src="/logo.png" alt="Knot.ly" className="h-[34px] w-auto" />
            </div>
            <nav className="space-y-1 flex-1">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `flex items-center px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${isActive || location.pathname === '/dashboard'
                            ? 'bg-[#1e1e1e] text-[#e2e2e2]' // sidebar-item-active equivalent
                            : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                        }`
                    }
                >
                    <span className="material-symbols-outlined mr-2.5 text-[18px]">dashboard</span>
                    Dashboard
                </NavLink>
                <NavLink
                    to="/links"
                    className={({ isActive }) =>
                        `flex items-center px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${isActive
                            ? 'bg-[#1e1e1e] text-[#e2e2e2]'
                            : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                        }`
                    }
                >
                    <span className="material-symbols-outlined mr-2.5 text-[18px]">link</span>
                    My Links
                </NavLink>
            </nav>
            <div className="mt-auto pt-6 space-y-4">
                <nav className="space-y-1">
                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            `flex items-center px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${isActive
                                ? 'bg-[#1e1e1e] text-[#e2e2e2]'
                                : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                            }`
                        }
                    >
                        <span className="material-symbols-outlined mr-2.5 text-[18px]">settings</span>
                        Settings
                    </NavLink>
                </nav>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full h-[36px] bg-[#e2e2e2] text-[#0a0a0a] rounded-md font-medium text-[13px] hover:bg-[#d4d4d4] transition-colors flex items-center justify-center font-headline"
                >
                    Create New Link
                </button>
            </div>

            <CreateLinkModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    setIsCreateModalOpen(false);
                    // Force reload to ensure all data is fresh on the current page
                    window.location.reload();
                }}
            />
        </aside>
    );
};

export default Sidebar;
