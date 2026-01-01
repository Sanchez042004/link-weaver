import React, { useState } from 'react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        setLoading(true);
        setError(null);
        try {
            await onConfirm();
            // Modal will be closed by the parent or navigation will happen
        } catch (err) {
            setError('Failed to delete the link. Please try again.');
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm p-6 relative overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="size-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-2xl">warning</span>
                    </div>

                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Delete this link?</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            This action cannot be undone. All analytics data associated with this link will be permanently removed.
                        </p>
                    </div>

                    {error && (
                        <div className="w-full mb-4 flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-[#192233] border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm font-medium animate-shake">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 w-full mt-2">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            className="px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/25 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
