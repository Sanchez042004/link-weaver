import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';

interface DeleteLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    alias: string;
}

export const DeleteLinkModal: React.FC<DeleteLinkModalProps> = ({ isOpen, onClose, onConfirm, alias }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmationText, setConfirmationText] = useState('');

    const expectedText = `/${alias}`;
    const isConfirmed = confirmationText === expectedText;

    // Reset confirmation text when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setConfirmationText('');
            setError(null);
        }
    }, [isOpen]);

    const handleConfirm = async () => {
        if (!isConfirmed) return;

        setIsLoading(true);
        setError(null);
        try {
            await onConfirm();
        } catch (err: any) {
            setError(err.message || 'Failed to delete link');
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete Link" hideHeader={true}>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center text-center p-4 gap-4">
                    <div className="size-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 mb-2">
                        <span className="material-symbols-outlined text-3xl text-red-600 dark:text-red-500">priority_high</span>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Are you sure?</h4>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                            This action cannot be undone. All analytics data associated with this link will be permanently lost.
                        </p>
                        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-left">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                To confirm, type <span className="font-mono font-bold text-slate-900 dark:text-white">{expectedText}</span> below:
                            </p>
                            <input
                                type="text"
                                value={confirmationText}
                                onChange={(e) => setConfirmationText(e.target.value)}
                                placeholder={expectedText}
                                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono text-sm"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="text-red-600 text-sm text-center">{error}</div>
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
                        disabled={isLoading || !isConfirmed}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-red-600/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                <span>Deleting...</span>
                            </>
                        ) : (
                            'Delete Link'
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
