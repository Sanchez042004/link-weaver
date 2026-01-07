import React, { useState } from 'react';
import type { Url } from '../../../api/url.api';
import Sparkline from './Sparkline';
import Skeleton from '../../../components/ui/Skeleton';
import LinkIcon from '../../../components/LinkIcon';
import { format } from 'date-fns';

interface RecentLinksTableProps {
    urls: Url[];
    isLoading: boolean;
    onEdit: (url: Url) => void;
    onDelete: (id: string) => void;
    onAnalytics: (alias: string) => void;
    onShowQR: (url: Url) => void;
}

const TableSkeleton: React.FC = () => (
    <div className="bg-surface-dark border border-border-dark/60 rounded-2xl mb-12 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-border-dark/40 flex justify-between items-center">
            <Skeleton width={150} height={24} />
            <div className="hidden sm:flex gap-2">
                <Skeleton width={80} height={14} />
            </div>
        </div>

        {/* Mobile Skeleton */}
        <div className="lg:hidden divide-y divide-border-dark/30">
            {[1, 2, 3].map(i => (
                <div key={i} className="p-5 flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                        <Skeleton className="size-10 rounded-lg shrink-0" />
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="flex justify-between">
                                <Skeleton width={120} height={20} />
                                <Skeleton width={60} height={20} className="rounded-lg" />
                            </div>
                            <Skeleton width={200} height={14} />
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <Skeleton width={100} height={20} className="rounded-lg" />
                        <div className="flex gap-2">
                            <Skeleton width={32} height={32} className="rounded-lg" />
                            <Skeleton width={32} height={32} className="rounded-lg" />
                            <Skeleton width={32} height={32} className="rounded-lg" />
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Desktop Skeleton */}
        <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
                <thead className="bg-[#2e1d15]/50 border-b border-border-dark">
                    <tr>
                        <th className="px-6 py-4 w-[40%]"><Skeleton width={100} height={14} /></th>
                        <th className="px-6 py-4 w-[15%]" ><Skeleton width={80} height={14} /></th>
                        <th className="px-6 py-4 w-[25%]" ><Skeleton width={100} height={14} /></th>
                        <th className="px-6 py-4 w-[20%] text-right" ><Skeleton width={60} height={14} className="ml-auto" /></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-dark/30">
                    {[1, 2, 3, 4, 5].map(i => (
                        <tr key={i}>
                            <td className="px-6 py-4 flex items-center gap-3">
                                <Skeleton width={40} height={40} className="rounded-lg" />
                                <div>
                                    <Skeleton width={150} height={18} className="mb-1" />
                                    <Skeleton width={100} height={12} />
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <Skeleton width={100} height={14} className="mb-1" />
                            </td>
                            <td className="px-6 py-4">
                                <Skeleton width={120} height={32} className="rounded-xl" />
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <Skeleton width={32} height={32} className="rounded-lg" />
                                    <Skeleton width={32} height={32} className="rounded-lg" />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const RecentLinksTable: React.FC<RecentLinksTableProps> = ({
    urls,
    isLoading,
    onEdit,
    onDelete,
    onAnalytics,
    onShowQR,
}) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (isLoading) return <TableSkeleton />;

    const getLinkTrend = (url: Url) => {
        const linkTimeline = url.timeline;
        if (!linkTimeline || Object.keys(linkTimeline).length === 0 || url.clicks === 0) {
            return [0, 0, 0, 0, 0, 0, 0];
        }

        const sortedDates = Object.keys(linkTimeline).sort();
        return sortedDates.map(date => linkTimeline[date]);
    };

    return (
        <div className="w-full rounded-xl bg-surface-dark border border-border-dark/40 shadow-sm font-body relative">
            <div className="p-6 border-b border-border-dark/40 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-display">
                    <span className="material-symbols-outlined text-primary">link</span>
                    Recent Links
                </h3>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest hidden sm:block">Latest activity</span>
            </div>

            {/* Mobile View: Card List (hidden on lg) */}
            <div className="lg:hidden divide-y divide-border-dark/30">
                {urls.map((url) => {
                    const trendData = getLinkTrend(url);
                    const isPositive = trendData.length > 0 ? trendData[trendData.length - 1] >= trendData[0] : true;
                    return (
                        <div key={url.id} className="p-5 flex flex-col gap-4 hover:bg-primary/5 transition-colors">
                            {/* Card Header: Icon + Info */}
                            <div className="flex items-start gap-4">
                                <LinkIcon url={url.longUrl} className="w-10 h-10 shrink-0" />
                                <div className="flex flex-col min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-bold text-white truncate">{url.alias}</span>
                                        <div className="flex items-baseline gap-1 bg-[#2e1d15] px-2 py-0.5 rounded-lg border border-border-dark/40">
                                            <span className="text-xs font-black text-white">{url.clicks}</span>
                                            <span className="text-[10px] text-slate-500 uppercase">clics</span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-500 truncate mt-1">{url.longUrl}</span>
                                </div>
                            </div>

                            {/* Card Action & Progress Row */}
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 max-w-[120px] h-6">
                                    <Sparkline data={trendData} color={isPositive ? '#22c55e' : '#ef4444'} />
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => copyToClipboard(url.shortUrl, url.id)}
                                        className={`p-2 rounded-lg transition-all ${copiedId === url.id ? 'text-primary bg-primary/10' : 'text-slate-400'}`}
                                        title="Copy"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">{copiedId === url.id ? 'check' : 'content_copy'}</span>
                                    </button>
                                    <button onClick={() => onShowQR(url)} className="p-2 rounded-lg text-slate-400" title="QR">
                                        <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                                    </button>
                                    <button onClick={() => onAnalytics(url.alias)} className="p-2 rounded-lg text-slate-400" title="Analytics">
                                        <span className="material-symbols-outlined text-[20px]">analytics</span>
                                    </button>
                                    <button onClick={() => onDelete(url.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500" title="Delete">
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </div>
                            </div>

                            {/* Card Footer: Timestamp */}
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                                <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                                {format(new Date(url.createdAt), 'MMM dd, yyyy • hh:mm aa')}
                            </div>
                        </div>
                    );
                })}
                {urls.length === 0 && (
                    <div className="p-10 text-center text-slate-500 italic">No links found</div>
                )}
            </div>

            {/* Desktop View: Traditional Table (hidden below lg) */}
            <div className="hidden lg:block overflow-x-auto custom-scrollbar">
                <div className="min-w-[1000px] w-full">
                    <table className="w-full text-left text-sm text-slate-400 dark:text-[#9db9a6] table-fixed">
                        <thead className="bg-[#2e1d15]/50 text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-[#8a6350]">
                            <tr>
                                <th className="px-6 py-4 w-[40%]" scope="col">Link Info</th>
                                <th className="px-6 py-4 w-[15%]" scope="col">Date Created</th>
                                <th className="px-6 py-4 w-[25%]" scope="col">Performance</th>
                                <th className="px-6 py-4 w-[20%] text-right" scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-dark/30">
                            {urls.map((url) => {
                                const trendData = getLinkTrend(url);
                                const isPositive = trendData.length > 0 ? trendData[trendData.length - 1] >= trendData[0] : true;
                                return (
                                    <tr key={url.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 shrink-0 flex items-center justify-center">
                                                    <LinkIcon url={url.longUrl} className="w-6 h-6 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-base font-bold text-white truncate max-w-[220px]">{url.alias}</span>
                                                        <button
                                                            onClick={() => onEdit(url)}
                                                            className="material-symbols-outlined text-[14px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-primary"
                                                        >
                                                            edit
                                                        </button>
                                                    </div>
                                                    <a
                                                        href={url.longUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[13px] text-slate-500 hover:text-primary transition-colors truncate max-w-[300px]"
                                                    >
                                                        {url.longUrl}
                                                    </a>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium">{format(new Date(url.createdAt), 'MMM dd, yyyy')}</span>
                                                <span className="text-[11px] text-slate-500">{format(new Date(url.createdAt), 'hh:mm aa')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 bg-[#2e1d15] border border-border-dark/40 px-3 py-1.5 rounded-xl">
                                                    <span className="material-symbols-outlined text-[16px] text-slate-400">bar_chart</span>
                                                    <span className="text-base font-black text-white">
                                                        {url.clicks >= 1000 ? `${(url.clicks / 1000).toFixed(1)}k` : url.clicks}
                                                    </span>
                                                </div>
                                                <div className="w-24 h-8 flex-shrink-0">
                                                    <Sparkline data={trendData} color={isPositive ? '#22c55e' : '#ef4444'} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => copyToClipboard(url.shortUrl, url.id)}
                                                    className={`p-2 rounded-lg transition-all ${copiedId === url.id
                                                        ? 'text-primary bg-primary/10'
                                                        : 'text-slate-400 hover:text-white hover:bg-border-dark/40'
                                                        }`}
                                                    title={copiedId === url.id ? "Copied!" : "Copy Link"}
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">
                                                        {copiedId === url.id ? 'check' : 'content_copy'}
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() => onShowQR(url)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-border-dark/40 transition-all"
                                                    title="QR Code"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                                                </button>
                                                <button
                                                    onClick={() => onAnalytics(url.alias)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                                                    title="Analytics"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">analytics</span>
                                                </button>
                                                <button
                                                    onClick={() => onDelete(url.id)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                                    title="Delete"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RecentLinksTable;
