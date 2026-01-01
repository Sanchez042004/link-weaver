import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';

interface DeleteLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export const DeleteLinkModal: React.FC<DeleteLinkModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await onConfirm();
        } catch (err: any) {
            setError(err.message || 'Failed to delete link');
            setIsLoading(false); // Only stop loading if error, otherwise component unmounts/closes
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete Link">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
                    <div className="size-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-red-600 dark:text-red-400">warning</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-red-900 dark:text-red-100">Are you sure?</h4>
                        <p className="text-sm text-red-700 dark:text-red-300">This action cannot be undone. All analytics data will be lost.</p>
                    </div>
                </div>

                {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                )}

                <div className="flex justify-end gap-3 mt-2">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-red-600/20 transition-all flex items-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? 'Deleting...' : 'Delete Link'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
