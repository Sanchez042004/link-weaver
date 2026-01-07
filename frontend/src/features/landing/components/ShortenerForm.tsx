import React, { useState } from 'react';
import { urlApi, type Url } from '../../../api/url.api';
import { QRCodeModal } from '../../links/components/QRCodeModal';

import { env } from '../../../config/env';

const ShortenerForm: React.FC = () => {
    const [longUrl, setLongUrl] = useState('');
    const [alias, setAlias] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<Url | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);

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
        <div className="glass-panel p-6 md:p-8 rounded-2xl shadow-2xl relative transition-all duration-300">
            {/* Floating Node Decorative */}
            <div className="absolute -top-4 -right-4 size-12 bg-surface-dark rounded-full flex items-center justify-center border border-primary/20 shadow-lg z-20">
                <span className="material-symbols-outlined text-primary">hub</span>
            </div>

            <div className="flex flex-col gap-6">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">Shorten a URL</h3>
                    <p className="text-sm text-gray-400">Paste your long link and customize your alias.</p>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Destination Input */}
                    <label className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Destination</span>
                        <div className="flex items-center bg-[#1a120e] rounded-xl border border-[#392e28] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all overflow-hidden group">
                            <div className="pl-4 text-gray-500 group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined">link</span>
                            </div>
                            <input
                                type="url"
                                className="w-full bg-transparent border-none text-white placeholder-gray-600 focus:ring-0 h-14 px-4"
                                placeholder="Paste your long link here..."
                                value={longUrl}
                                onChange={(e) => setLongUrl(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            />
                        </div>
                    </label>

                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Alias Input */}
                        <label className="flex flex-col gap-2 flex-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Alias (Optional)</span>
                            <div className="flex items-center bg-[#1a120e] rounded-xl border border-[#392e28] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all overflow-hidden group">
                                <div className="bg-white/5 dark:bg-slate-800/40 px-3 md:px-4 flex items-center h-14 border-r border-[#392e28] group-focus-within:border-primary/50 transition-all">
                                    <span className="text-gray-400 dark:text-gray-300 text-sm font-black tracking-tight group-focus-within:text-primary transition-colors leading-none">
                                        {env.getShortUrlBaseDisplay()}/
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    className="w-full bg-transparent border-none text-white placeholder-gray-600 focus:ring-0 h-14 px-2"
                                    placeholder="custom-name"
                                    value={alias}
                                    onChange={(e) => setAlias(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                />
                            </div>
                        </label>

                        {/* Submit Button */}
                        <div className="flex flex-col gap-2 md:w-auto w-full justify-end">
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="h-14 px-8 bg-primary hover:bg-orange-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-900/40 w-full md:w-auto whitespace-nowrap disabled:opacity-70 disabled:grayscale"
                            >
                                {isLoading ? (
                                    <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">content_cut</span>
                                        Shorten
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/30 text-red-400 text-sm font-medium flex items-center gap-2 animate-shake">
                        <span className="material-symbols-outlined text-[18px]">error</span>
                        {error}
                    </div>
                )}

                {/* Result Area */}
                <div className={`mt-4 transition-all duration-500 ease-out overflow-hidden ${result ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-[#1a120e] rounded-xl border border-primary/20 p-2 sm:p-3 flex flex-col sm:flex-row items-center gap-3 shadow-lg shadow-orange-900/10">

                        {/* URL Section - Flexible width */}
                        <div className="flex items-center gap-3 w-full flex-1 min-w-0 bg-[#0B1019]/50 rounded-lg p-2 border border-[#392e28]/30">
                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <span className="material-symbols-outlined text-[20px]">check</span>
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Short Link Ready</span>
                                <a
                                    href={result?.shortUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm sm:text-base font-bold text-white hover:text-primary transition-colors truncate block w-full"
                                    title={result?.shortUrl}
                                >
                                    {result?.shortUrl}
                                </a>
                            </div>
                        </div>

                        {/* Actions Section - Compact */}
                        <div className="flex items-center gap-1.5 w-full sm:w-auto flex-shrink-0 justify-end sm:justify-start">
                            <button
                                onClick={() => setIsQRModalOpen(true)}
                                className="size-9 rounded-lg text-gray-400 hover:text-white hover:bg-[#392e28] transition-all border border-transparent hover:border-gray-700 flex items-center justify-center flex-shrink-0 translate-y-px"
                                title="QR Code"
                            >
                                <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                            </button>

                            <div className="h-6 w-px bg-[#392e28] hidden sm:block mx-1"></div>

                            <button
                                onClick={handleCopy}
                                className={`h-9 px-4 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all flex-shrink-0 whitespace-nowrap shadow-md ${copied
                                    ? 'bg-green-500 text-white'
                                    : 'bg-white text-black hover:bg-gray-200'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[16px]">
                                    {copied ? 'check_circle' : 'content_copy'}
                                </span>
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {result && (
                <QRCodeModal
                    isOpen={isQRModalOpen}
                    onClose={() => setIsQRModalOpen(false)}
                    url={result.shortUrl}
                    alias={result.alias}
                />
            )}
        </div>
    );
};

export default ShortenerForm;
