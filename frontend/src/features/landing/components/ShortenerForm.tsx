import React, { useState } from 'react';
import { urlApi, type Url } from '../../../api/url.api';

const ShortenerForm: React.FC = () => {
    const [longUrl, setLongUrl] = useState('');
    const [alias, setAlias] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<Url | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async () => {
        if (!longUrl) return;
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await urlApi.create(longUrl, alias || undefined);
            setResult(response);
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

    return (
        <div className="w-full max-w-[800px] mx-auto relative z-10 group/shortener">
            {/* Card Container */}
            <div className="glass-panel rounded-2xl p-2 shadow-2xl shadow-black/20 dark:shadow-black/50 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a202c]">
                <div className="flex flex-col md:flex-row gap-2">
                    {/* URL Input */}
                    <div className="relative flex-grow group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">link</span>
                        </div>
                        <input
                            type="url"
                            className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base"
                            placeholder="Paste your long URL here..."
                            value={longUrl}
                            onChange={(e) => setLongUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        />
                    </div>
                    {/* Optional Alias */}
                    <div className="relative w-full md:w-48 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">edit</span>
                        </div>
                        <input
                            type="text"
                            className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base"
                            placeholder="Alias (opt)"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        />
                    </div>
                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="h-14 px-8 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 whitespace-nowrap md:w-auto w-full disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                <span>Shorten</span>
                                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm font-medium animate-shake">
                        <span className="material-symbols-outlined text-[18px]">error</span>
                        {error}
                    </div>
                )}

                {/* Result */}
                {result && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50 px-2 flex items-center justify-between animate-fade-in">
                        <div className="flex flex-col text-left">
                            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Your Short Link</span>
                            <a href={result.shortUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-bold text-lg hover:underline">
                                {result.shortUrl}
                            </a>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="QR Code">
                                <span className="material-symbols-outlined">qr_code</span>
                            </button>
                            <button
                                onClick={handleCopy}
                                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {/* Decorative glow under card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-20 group-hover/shortener:opacity-30 transition duration-1000 -z-10"></div>
        </div>
    );
};

export default ShortenerForm;
