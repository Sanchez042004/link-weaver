import React, { useState } from 'react';
import type { Url } from '../../../api/url.api';
import Sparkline from './Sparkline';
import Skeleton from '../../../components/ui/Skeleton';
import { env } from '../../../config/env';

interface RecentLinksTableProps {
    urls: Url[];
    isLoading: boolean;
    onDelete: (id: string) => void;
    onAnalytics: (alias: string) => void;
    onShowQR: (url: Url) => void;
}

const TableSkeleton: React.FC = () => (
    <div className="bg-surface border border-border-primary rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border-primary">
            <Skeleton className="h-4 w-32 rounded" />
        </div>
        <div className="p-5 space-y-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-48 rounded" />
                    <Skeleton className="h-4 w-16 rounded" />
                </div>
            ))}
        </div>
    </div>
);

const RecentLinksTable: React.FC<RecentLinksTableProps> = ({
    urls,
    isLoading,
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
        <div className="bg-surface border border-border-primary rounded-xl overflow-hidden mb-8">
            <div className="p-5 border-b border-border-primary flex justify-between items-center">
                <h2 className="text-[13px] font-medium text-text-primary uppercase tracking-wider">Recent Links</h2>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-surface/50 border-b border-border-primary">
                            <th className="px-6 py-3 text-[11px] uppercase tracking-[0.06em] text-text-muted font-semibold">Alias / Destination</th>
                            <th className="px-6 py-3 text-[11px] uppercase tracking-[0.06em] text-text-muted font-semibold">Trend</th>
                            <th className="px-6 py-3 text-[11px] uppercase tracking-[0.06em] text-text-muted font-semibold text-right">Clicks</th>
                            <th className="px-6 py-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-primary">
                        {urls.map((url) => {
                            const trendData = getLinkTrend(url);
                            const isPositive = trendData.length > 0 ? trendData[trendData.length - 1] >= trendData[0] : true;
                            
                            return (
                                <tr key={url.id} className="h-[44px] hover:bg-surface-hover transition-colors group relative cursor-pointer" onClick={() => onAnalytics(url.alias)}>
                                    <td className="px-6 py-2">
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-medium font-mono text-text-primary group-hover:text-accent transition-colors">
                                                {env.getShortUrlBaseDisplay()}/{url.alias}
                                            </span>
                                            <span className="text-[11px] text-text-muted truncate max-w-xs group-hover:text-text-secondary transition-colors" onClick={(e) => e.stopPropagation()}>
                                                <a href={url.longUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                    {url.longUrl.replace(/^https?:\/\//, '')}
                                                </a>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2">
                                        <div className="w-[60px] h-[15px]">
                                            <Sparkline data={trendData} color={isPositive ? '#5e6ad2' : '#e5484d'} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-2 text-right text-[12px] font-mono text-text-secondary">
                                        {url.clicks >= 1000 ? `${(url.clicks / 1000).toFixed(1)}k` : url.clicks.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-2 text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-end lg:opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                                            <button
                                                onClick={() => copyToClipboard(url.shortUrl, url.id)}
                                                className={`transition-colors ${copiedId === url.id ? 'text-accent' : 'text-text-muted hover:text-text-primary'}`}
                                                title="Copy"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">
                                                    {copiedId === url.id ? 'check' : 'content_copy'}
                                                </span>
                                            </button>
                                            <button onClick={() => onShowQR(url)} className="text-text-muted hover:text-accent transition-colors" title="Show QR Code">
                                                <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                                            </button>
                                            <button onClick={() => onAnalytics(url.alias)} className="text-text-muted hover:text-accent transition-colors" title="Analytics">
                                                <span className="material-symbols-outlined text-[16px]">analytics</span>
                                            </button>
                                            <button onClick={() => onDelete(url.id)} className="text-text-muted hover:text-danger transition-colors">
                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {urls.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-text-muted text-[13px] italic">
                                    No recent links found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentLinksTable;
