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

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
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
        <div className="w-full max-w-2xl bg-surface rounded-xl border border-white/15 shadow-[0_0_40px_-10px_rgba(255,255,255,0.08)] p-4 md:p-8 relative">
            <form className="space-y-4 md:space-y-6" onSubmit={(e) => handleSubmit(e)}>
                <div className="flex flex-col gap-3 md:gap-5">
                    {/* Destination Input */}
                    <div className="space-y-1.5 w-full">
                        <label className="text-[10px] md:text-[11px] font-headline font-semibold uppercase tracking-widest text-[#8a8a8a]">Destination</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a] text-[18px]">link</span>
                            <input
                                className="w-full bg-[#0e0e0e] text-[#e2e2e2] border border-border-secondary focus:border-accent focus:ring-1 focus:ring-accent pl-10 pr-4 h-11 rounded-lg text-[14px] font-mono transition-colors placeholder:text-outline-variant"
                                placeholder="https://long-url.com/something-complex"
                                required
                                type="url"
                                value={longUrl}
                                onChange={(e) => setLongUrl(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Alias Input */}
                    <div className="space-y-1.5 w-full">
                        <label className="text-[10px] md:text-[11px] font-headline font-semibold uppercase tracking-widest text-[#8a8a8a]">Alias <span className="text-[#8a8a8a]/60 lowercase font-normal tracking-normal">(Optional)</span></label>
                        <div className="flex rounded-lg border border-border-secondary bg-[#0e0e0e] focus-within:ring-1 focus-within:ring-accent focus-within:border-accent overflow-hidden group transition-colors">
                            <div className="bg-[#1c1b1b] px-3 flex items-center border-r border-border-secondary text-[#8a8a8a] text-sm font-mono whitespace-nowrap pt-1">
                                {env.getShortUrlBaseDisplay()}/
                            </div>
                            <input
                                className="w-full bg-transparent text-[#e2e2e2] border-none focus:ring-0 px-3 h-11 text-[14px] font-mono placeholder:text-outline-variant"
                                placeholder="custom"
                                type="text"
                                value={alias}
                                onChange={(e) => setAlias(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="p-3 mt-2 md:mt-4 rounded-lg bg-danger/10 text-danger text-[13px] font-medium border border-danger/20 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">error</span>
                        {error}
                    </div>
                )}

                {/* Result Area */}
                <div className={`transition-all duration-500 ease-out overflow-hidden ${result ? 'max-h-96 opacity-100 mt-4 md:mt-6' : 'max-h-0 opacity-0'}`}>
                    {result && (
                        <div className="bg-[#0e0e0e] rounded-lg border border-accent/20 p-2 sm:p-3 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-3 w-full flex-1 min-w-0 bg-[#1c1b1b] rounded-lg p-2 sm:p-3 border border-border-secondary">
                                <div className="size-6 rounded-full bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                                    <span className="material-symbols-outlined text-[16px]">check</span>
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <a
                                        href={result?.shortUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[13px] md:text-[14px] font-mono text-[#e2e2e2] hover:text-accent transition-colors truncate block w-full"
                                    >
                                        {result?.shortUrl}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0 justify-end sm:justify-start">
                                <button
                                    type="button"
                                    onClick={() => setIsQRModalOpen(true)}
                                    className="h-[38px] md:h-[42px] px-3 rounded-lg text-[#8a8a8a] hover:text-[#e2e2e2] hover:bg-surface-hover border border-transparent transition-all flex items-center justify-center flex-shrink-0"
                                    title="QR Code"
                                >
                                    <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className={`h-[38px] md:h-[42px] px-4 rounded-lg font-medium text-[12px] md:text-[13px] flex items-center justify-center gap-1.5 transition-all flex-shrink-0 whitespace-nowrap ${copied ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-surface-hover text-[#e2e2e2] border border-border-secondary hover:bg-[#e2e2e2] hover:text-[#0a0a0a]'}`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">
                                        {copied ? 'check_circle' : 'content_copy'}
                                    </span>
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action */}
                <div className="flex justify-end pt-4 md:pt-5 border-t border-border-primary mt-4 md:mt-6">
                    <button
                        className="bg-accent text-white hover:opacity-90 px-6 py-2 md:py-2.5 rounded-lg text-[13px] font-semibold transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                Shorten Link
                                <span className="material-symbols-outlined !text-[16px]">bolt</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

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
