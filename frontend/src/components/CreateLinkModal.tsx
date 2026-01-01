import React, { useState } from 'react';
import { urlApi } from '../api/url.api';

interface CreateLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateLinkModal: React.FC<CreateLinkModalProps> = ({ isOpen, onClose }) => {
    const [longUrl, setLongUrl] = useState('');
    const [alias, setAlias] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await urlApi.create(longUrl, alias || undefined);
            setResult(data);
        } catch (err: any) {
            setError(err.message || 'Failed to shorten URL');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (result?.shortUrl) {
            navigator.clipboard.writeText(result.shortUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleClose = () => {
        setLongUrl('');
        setAlias('');
        setResult(null);
        setError(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-surface-dark w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-border-dark overflow-hidden animate-scale-up">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-border-dark">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Link</h3>
                    <button onClick={handleClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!result ? (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Long URL */}
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

                            {/* Custom Alias */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Custom Alias (Optional)</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400 text-[20px]">edit</span>
                                    </div>
                                    <input
                                        type="text"
                                        className="form-input w-full pl-10 h-11 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-background-dark text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-primary focus:border-primary"
                                        placeholder="my-link"
                                        value={alias}
                                        onChange={(e) => setAlias(e.target.value)}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-[#192233] border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm font-medium animate-shake">
                                    <span className="material-symbols-outlined text-[18px]">error</span>
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-primary hover:bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Creating...' : 'Create Link'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex flex-col gap-6 animate-fade-in">
                            <div className="text-center">
                                <div className="size-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600 dark:text-green-400">
                                    <span className="material-symbols-outlined text-[28px]">check</span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Link Created!</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Your new short link is ready to share.</p>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-700">
                                <span className="material-symbols-outlined text-primary">link</span>
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-bold text-slate-900 dark:text-white truncate">{result.shortUrl}</p>
                                    <p className="text-xs text-slate-500 truncate">{result.longUrl}</p>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${copied ? 'bg-green-500 text-white' : 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">{copied ? 'check' : 'content_copy'}</span>
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        setResult(null);
                                        setLongUrl('');
                                        setAlias('');
                                    }}
                                    className="w-full py-2.5 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Create Another
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="w-full py-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-medium transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateLinkModal;
