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
        <DashboardLayout>
            <div className="flex-1 flex flex-col h-full overflow-hidden relative font-body">
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-[800px] mx-auto flex flex-col gap-8">
                        <div className="page-transition">
                            <h1 className="text-white text-3xl font-bold tracking-tight font-display">Settings</h1>
                            <p className="text-slate-400 mt-1">Manage your account preferences and security.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Profile Info */}
                            <div className="bg-surface-dark border border-border-dark/60 rounded-2xl p-6 shadow-lg">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">person</span>
                                    Profile Information
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">Full Name</label>
                                        <p className="text-white font-medium">{user?.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">Email Address</label>
                                        <p className="text-white font-medium">{user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Session Management */}
                            <div className="bg-surface-dark border border-border-dark/60 rounded-2xl p-6 shadow-lg">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">logout</span>
                                    Session
                                </h3>
                                <p className="text-slate-400 text-sm mb-6 font-medium">
                                    Log out of your current session on this device.
                                </p>
                                <button
                                    onClick={() => setIsLogoutModalOpen(true)}
                                    className="px-6 h-11 bg-surface-highlight border border-border-dark/60 text-white text-sm font-bold rounded-xl hover:bg-surface-highlight/80 transition-all flex items-center gap-2"
                                >
                                    Log Out
                                </button>
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 shadow-lg border-dashed">
                                <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined">dangerous</span>
                                    Danger Zone
                                </h3>
                                <p className="text-slate-400 text-sm mb-6 font-medium">
                                    Permanently delete your account and all associated data. This action cannot be undone.
                                </p>
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="px-6 h-11 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
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
        </DashboardLayout>
    );
};

export default SettingsPage;
