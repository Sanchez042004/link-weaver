import React from 'react';
import { type Url } from '../../../api/url.api';
import Skeleton from '../../../components/ui/Skeleton';

interface DashboardStatsProps {
    urls: Url[];
    isLoading: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ urls, isLoading }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex flex-col gap-2 rounded-xl p-6 bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-24 bg-slate-700/50" />
                            <Skeleton className="size-10 rounded-lg bg-slate-700/50" />
                        </div>
                        <div className="mt-2">
                            <Skeleton className="h-8 w-16 bg-slate-700/50" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    const validUrls = urls || [];

    const totalClicks = validUrls.reduce((sum, url) => sum + url.clicks, 0);
    const activeLinks = validUrls.length;
    const topLink = validUrls.reduce((prev, current) => (prev.clicks > current.clicks) ? prev : current, { clicks: 0, shortUrl: 'No links yet' } as Url);

    // Logic for displaying top link nicely
    let topLinkDisplay = 'No links yet';
    // console.log('[DashboardStats] urls:', urls.length); 
    if (validUrls.length > 0) {
        // Safe access helper
        const safeString = (str: any) => (typeof str === 'string' && str.trim().length > 0) ? str.trim() : null;

        const custom = safeString(topLink.customAlias);
        const alias = safeString(topLink.alias);
        const shortCode = topLink.shortUrl ? topLink.shortUrl.replace(/\/$/, '').split('/').pop() : null;
        const validShortCode = safeString(shortCode);

        // Fallback chain
        const finalName = custom || alias || validShortCode;
        topLinkDisplay = finalName ? `/${finalName}` : 'Unknown';
    }


    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <StatsCard
                title="Total Clicks"
                value={totalClicks}
                icon="trending_up"
                iconColor="text-green-500"
                bgColor="bg-green-500/10"
            />
            <StatsCard
                title="Active Links"
                value={activeLinks}
                icon="link"
                iconColor="text-primary"
                bgColor="bg-primary/10"
            />

            <div className="flex flex-col gap-2 rounded-xl p-6 bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/30 transition-all"></div>
                <div className="flex items-center justify-between relative z-10">
                    <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Top Performer</p>
                    <div className="size-10 flex items-center justify-center bg-orange-500/10 rounded-lg">
                        <span className="material-symbols-outlined text-orange-500 text-[24px]">emoji_events</span>
                    </div>
                </div>
                {/* min-w-0 added to ensure truncation works in flex child */}
                <div className="flex flex-col gap-1 relative z-10 mt-2 min-w-0">
                    <p className="text-2xl font-bold text-white truncate" title={topLinkDisplay}>{topLinkDisplay}</p>
                    <p className="text-slate-400 text-sm">{topLink.clicks} clicks all time</p>
                </div>
            </div>
        </section>
    );
};

const StatsCard = ({ title, value, icon, iconColor, bgColor }: any) => (
    <div className="flex flex-col gap-2 rounded-xl p-6 bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">{title}</p>
            <div className={`size-10 flex items-center justify-center ${bgColor} rounded-lg`}>
                <span className={`material-symbols-outlined ${iconColor} text-[24px]`}>{icon}</span>
            </div>
        </div>
        <div className="flex items-end gap-3 mt-2">
            <p className="text-2xl font-black text-white tracking-tight">{value}</p>
        </div>
    </div>
);
