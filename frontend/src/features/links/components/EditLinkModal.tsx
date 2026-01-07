import React, { useState, useEffect } from 'react';
import { urlApi, type Url } from '../../../api/url.api';
import { Modal } from '../../../components/ui/Modal';
import { env } from '../../../config/env';

interface EditLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    link: Url;
}

export const EditLinkModal: React.FC<EditLinkModalProps> = ({ isOpen, onClose, onSuccess, link }) => {
    const [longUrl, setLongUrl] = useState(link.longUrl);
    const derivedAlias = link.shortUrl ? link.shortUrl.replace(/\/$/, '').split('/').pop() : '';
    const [alias, setAlias] = useState(derivedAlias || link.customAlias || link.alias || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLongUrl(link.longUrl);
        // Prioritize what is actually live in the shortUrl to avoid sync issues
        const derivedAlias = link.shortUrl ? link.shortUrl.replace(/\/$/, '').split('/').pop() : '';
        setAlias(derivedAlias || link.customAlias || link.alias || '');
    }, [link]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await urlApi.update(link.id, { longUrl, customAlias: alias });
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to update URL');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Link">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Destination URL</label>
                    <input
                        type="url"
                        required
                        className="form-input w-full p-2 h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-background-dark text-slate-900 dark:text-white"
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Alias</label>
                    <div className="flex bg-white dark:bg-background-dark rounded-lg border border-slate-300 dark:border-slate-600 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary overflow-hidden group">
                        <div className="bg-slate-50 dark:bg-slate-800/40 px-3 flex items-center border-r border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 text-xs font-black leading-none">
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
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-primary hover:bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                <span>Saving...</span>
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
