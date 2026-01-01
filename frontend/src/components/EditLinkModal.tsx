import React, { useState, useEffect } from 'react';
import { urlApi } from '../api/url.api';

interface EditLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    linkData: { id: string; longUrl: string; customAlias?: string; alias?: string; shortUrl?: string } | null;
}

const EditLinkModal: React.FC<EditLinkModalProps> = ({ isOpen, onClose, onSuccess, linkData }) => {
    const [longUrl, setLongUrl] = useState('');
    const [alias, setAlias] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (linkData) {
            setLongUrl(linkData.longUrl);

            // Prioritize customAlias if it's a valid string.
            // If customAlias is false/null/undefined or empty or "true" string, fall back to alias.
            let initialAlias = '';

            const customAlias = linkData.customAlias;
            // Check if customAlias is a string AND not "true" AND not empty
            const isValidCustomAlias = (typeof customAlias === 'string' && customAlias !== 'true' && customAlias.trim() !== '');

            if (isValidCustomAlias && customAlias) {
                initialAlias = customAlias;
            } else if (linkData.alias) {
                initialAlias = linkData.alias;
            } else if (linkData.shortUrl) {
                // Ultimate fallback: extract from shortUrl (e.g., http://.../bukele -> bukele)
                const parts = linkData.shortUrl.split('/');
                initialAlias = parts[parts.length - 1];
            }

            setAlias(initialAlias);
        }
    }, [linkData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!linkData) return;

        setLoading(true);
        setError(null);

        try {
            await urlApi.update(linkData.id, { longUrl, customAlias: alias || undefined });
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Error updating link');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                <div className="mb-6">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Edit Link</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Update the destination or alias of your link.</p>
                </div>

                {error && (
                    <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-[#192233] border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm font-medium animate-shake">
                        <span className="material-symbols-outlined text-[18px]">error</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Destination URL</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">link</span>
                            <input
                                type="url"
                                required
                                value={longUrl}
                                onChange={(e) => setLongUrl(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                                placeholder="https://example.com/very-long-url"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Custom Alias (Optional)</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">tag</span>
                            <input
                                type="text"
                                value={alias}
                                onChange={(e) => setAlias(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                                placeholder="my-custom-link"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-2">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            {loading && <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditLinkModal;
