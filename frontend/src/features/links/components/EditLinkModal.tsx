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
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-headline font-semibold uppercase tracking-widest text-[#8a8a8a]">Destination URL</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-[#8a8a8a] text-[18px]">link</span>
                        </div>
                        <input
                            type="url"
                            required
                            className="w-full pl-9 pr-4 h-11 rounded-lg border border-border-secondary bg-[#0e0e0e] text-[#e2e2e2] placeholder:text-outline-variant focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors font-mono text-sm"
                            value={longUrl}
                            onChange={(e) => setLongUrl(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-headline font-semibold uppercase tracking-widest text-[#8a8a8a]">Alias</label>
                    <div className="flex rounded-lg border border-border-secondary bg-[#0e0e0e] focus-within:ring-1 focus-within:ring-accent focus-within:border-accent overflow-hidden group transition-colors">
                        <div className="bg-[#1c1b1b] px-3 flex items-center border-r border-border-secondary text-[#8a8a8a] text-sm font-mono whitespace-nowrap pt-1">
                            {env.getShortUrlBaseDisplay()}/
                        </div>
                        <input
                            type="text"
                            className="w-full px-3 h-11 border-none bg-transparent text-[#e2e2e2] placeholder:text-outline-variant focus:outline-none focus:ring-0 font-mono text-sm"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 mt-1 rounded-lg bg-danger/10 text-danger text-[13px] font-medium border border-danger/20 flex flex-col items-start">
                        <div className="flex gap-2 items-center">
                           <span className="material-symbols-outlined !text-[16px]">error</span>
                           {error}
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border-primary">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-xs font-semibold text-[#e2e2e2] hover:bg-surface-hover border border-border-secondary rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-5 py-2.5 bg-accent hover:opacity-90 text-white text-xs font-semibold rounded-lg transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
