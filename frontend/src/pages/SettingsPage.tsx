import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ui/ConfirmModal';
import { DashboardLayout } from '../layouts/DashboardLayout';

const SettingsPage: React.FC = () => {
    const { user, logout, deleteAccount } = useAuth();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        try {
            setIsDeleting(true);
            await deleteAccount();
        } catch (error) {
            console.error('Error deleting account:', error);
            setIsDeleting(false);
        }
    };

    return (
        <DashboardLayout noScroll={false}>
            <div className="flex flex-col items-center justify-start md:justify-center font-body min-h-full">
                <div className="max-w-2xl w-full space-y-8 py-12">
                    {/* Page Header */}
                    <div className="text-center md:text-left">
                        <h2 className="text-[32px] md:text-[40px] font-headline font-semibold tracking-[-0.03em] leading-[1.1] text-text-primary mb-2">Account Settings</h2>
                        <p className="text-text-muted font-body text-sm">Manage your workspace preferences and security configurations.</p>
                    </div>

                    {/* Settings Layout */}
                    <div className="flex flex-col gap-6">
                    
                    {/* Profile Section */}
                    <section className="bg-surface rounded-xl p-6 md:p-8 border border-border-primary">
                        <h3 className="text-sm font-headline font-semibold text-text-primary mb-6">Personal Profile</h3>
                        
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Avatar */}
                            <div className="w-20 h-20 shrink-0 rounded-xl bg-surface-hover flex items-center justify-center border border-border-secondary">
                                <span className="text-accent text-3xl font-headline font-bold">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>

                            {/* Info Fields */}
                            <div className="flex-1 w-full space-y-5">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-label font-semibold uppercase tracking-[0.06em] text-[#8a8a8a]">Full Name</label>
                                    <input
                                        type="text"
                                        value={user?.name || ''}
                                        readOnly
                                        className="w-full max-w-md bg-[#0a0a0a]/50 text-text-muted border border-border-secondary rounded-lg px-4 py-2.5 text-sm font-body cursor-not-allowed"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[11px] font-label font-semibold uppercase tracking-[0.06em] text-[#8a8a8a]">Email Address</label>
                                    <div className="relative max-w-md">
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="w-full bg-[#0a0a0a]/50 text-text-muted border border-border-secondary rounded-lg pl-4 pr-10 py-2.5 text-sm font-mono cursor-not-allowed"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-text-muted">lock</span>
                                    </div>
                                    <p className="text-[11px] text-[#8a8a8a] mt-1">Contact support to change your primary email.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Account Access Section */}
                    <section className="bg-surface rounded-xl p-6 md:p-8 border border-border-primary flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h4 className="text-sm font-headline font-semibold text-text-primary mb-1">Session Management</h4>
                            <p className="text-xs text-[#8a8a8a] max-w-md">
                                Log out of your current session. You will need your credentials to access your dashboard again.
                            </p>
                        </div>
                        <button 
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="px-6 py-2.5 rounded-lg text-xs font-semibold bg-surface-hover border border-border-secondary text-text-primary hover:bg-[#e2e2e2] hover:text-[#0a0a0a] transition-colors shrink-0"
                        >
                            Log Out
                        </button>
                    </section>

                    {/* Danger Zone Section */}
                    <section className="bg-surface rounded-xl p-6 md:p-8 border-[1px] border-red-500/30 mt-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h4 className="text-sm font-headline font-semibold text-danger mb-1 flex items-center gap-2">
                                    <span className="material-symbols-outlined !text-[16px]">warning</span>
                                    Danger Zone
                                </h4>
                                <p className="text-xs text-[#8a8a8a] max-w-md">
                                    Permanently remove your account and all associated data. This action cannot be undone.
                                </p>
                            </div>
                            <button 
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="px-6 py-2.5 rounded-lg text-xs font-semibold bg-danger/10 border-[1px] border-red-500/50 text-danger hover:bg-danger hover:text-white transition-colors shrink-0"
                            >
                                Delete Account
                            </button>
                        </div>
                    </section>
                </div>
            </div>

            {/* Modals */}
            <ConfirmModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={logout}
                title="Log Out"
                message="Are you sure you want to log out? You will need to sign in again to access your dashboard."
                confirmText="Log Out"
                type="warning"
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
                title="Delete Account"
                message="This is a permanent action. All your links, custom aliases, and analytics data will be permanently removed. There is no way to recover your account once deleted."
                confirmText="Delete Permanently"
                type="danger"
                verificationValue={user?.email || ''}
                verificationPlaceholder="Type your email address"
                isLoading={isDeleting}
            />
        </div>
    </DashboardLayout>
);
};

export default SettingsPage;
