import React, { useState } from 'react';
import { urlApi } from '../../../api/url.api';
import { Modal } from '../../../components/ui/Modal';
import { env } from '../../../config/env';

interface CreateLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateLinkModal: React.FC<CreateLinkModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [longUrl, setLongUrl] = useState('');
    const [alias, setAlias] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await urlApi.create(longUrl, alias || undefined);
            setLongUrl('');
            setAlias('');
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to shorten URL');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Link">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Destination URL</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400 text-[20px]">link</span>
                        </div>
                        <input
                            type="url"
                            required
                            className="form-input w-full pl-10 h-11 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-background-dark text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-primary focus:border-primary"
                            placeholder="https://example.com/very-long-url..."
                            value={longUrl}
                            onChange={(e) => setLongUrl(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Alias</label>
                    <div className="flex bg-white dark:bg-background-dark rounded-lg border border-slate-300 dark:border-slate-600 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary overflow-hidden group">
                        <div className="bg-slate-50 dark:bg-slate-800/40 px-3 flex items-center border-r border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 text-sm font-black leading-none whitespace-nowrap">
                            {env.getShortUrlBaseDisplay()}/
                        </div>
                        <input
                            type="text"
                            className="form-input w-full px-3 h-11 border-none bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-primary hover:brightness-110 text-white text-sm font-semibold rounded-lg shadow-lg shadow-primary/30 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                <span>Creating...</span>
                            </>
                        ) : (
                            'Create Link'
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
