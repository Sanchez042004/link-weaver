import React from 'react';
import type { Url } from '../../../api/url.api';
import Skeleton from '../../../components/ui/Skeleton';

interface StatsCardProps {
    title: string;
    value: string | number;
    trend?: {
        value: string;
        isUp: boolean;
    };
    icon: string;
    colorClass?: string;
    tooltip?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, icon, colorClass = 'text-primary', tooltip }) => (
    <div className="bg-surface-dark border border-border-dark/60 rounded-2xl p-6 relative group hover:border-primary/40 transition-all duration-500 shadow-lg">
        <div className={`absolute -right-6 -top-6 size-24 ${colorClass.includes('primary') ? 'bg-primary/5' : 'bg-orange-500/5'} rounded-full blur-2xl group-hover:scale-110 transition-all`}></div>
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2 bg-surface-highlight rounded-lg flex items-center justify-center">
                <span className={`material-symbols-outlined text-[24px] ${colorClass}`}>{icon}</span>
            </div>
            {trend && (
                <span className={`flex items-center gap-1 ${trend.isUp ? 'text-primary bg-primary/10' : 'text-red-400 bg-red-400/10'} text-sm font-bold px-2 py-1 rounded-full`}>
                    <span className="material-symbols-outlined text-[16px]">{trend.isUp ? 'trending_up' : 'trending_down'}</span>
                    {trend.value}
                </span>
            )}
        </div>
        <div className="flex items-center gap-1 mb-1 relative z-10">
            <p className="text-slate-400 text-base sm:text-sm font-medium">{title}</p>
            {tooltip && (
                <div className="group/tooltip relative flex items-center">
                    <span className="material-symbols-outlined text-[14px] opacity-30 cursor-help hover:opacity-100 transition-opacity text-slate-400">info</span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[180px] py-1 px-2 bg-slate-900 border border-white/10 text-white text-[10px] rounded-md opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50 shadow-xl pointer-events-none font-body text-center">
                        <div className="relative z-10">{tooltip}</div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-white/10"></div>
                    </div>
                </div>
            )}
        </div>
        <p className="text-white text-3xl font-bold font-display relative z-10">{value}</p>
    </div>
);

const StatsSkeleton: React.FC = () => (
    <div className="bg-surface-dark border border-border-dark/60 rounded-2xl p-6 relative overflow-hidden shadow-lg">
        <div className="flex justify-between items-start mb-4 relative z-10">
            <Skeleton width={40} height={40} className="rounded-lg" />
            <Skeleton width={60} height={24} className="rounded-full" />
        </div>
        <Skeleton width="60%" height={16} className="mb-2" />
        <Skeleton width="40%" height={32} />
    </div>
);

interface StatsGridProps {
    urls: Url[];
    isLoading: boolean;
    comparison?: {
        clicksToday: number;
        clicksYesterday: number;
        linksToday: number;
        linksYesterday: number;
    };
    filteredClicks?: number;
    topLink?: {
        alias: string;
        clicks: number;
        longUrl?: string;
    };
}

const StatsGrid: React.FC<StatsGridProps> = ({ urls, isLoading, comparison, filteredClicks, topLink }) => {
    // Fallback URL-based calc
    const urlsTotalClicks = urls.reduce((acc, url) => acc + (url.clicks || 0), 0);
    const urlsTopPerformer = urls.reduce((prev, current) => ((prev.clicks || 0) > (current.clicks || 0)) ? prev : current, urls[0] || null);

    // Prefer filtered/analytics data
    const totalClicks = filteredClicks !== undefined ? filteredClicks : urlsTotalClicks;
    const topPerformer = topLink || urlsTopPerformer;

    // Calculate real trends (Daily)
    const getClicksTrend = () => {
        if (!comparison) return undefined;

        const today = comparison.clicksToday || 0;
        const yesterday = comparison.clicksYesterday || 0;

        if (yesterday === 0) {
            if (today === 0) return undefined;
            return { value: `+${today} New`, isUp: true };
        }

        const diff = today - yesterday;
        const percent = Math.round((diff / yesterday) * 100);
        return { value: `${percent > 0 ? '+' : ''}${percent}%`, isUp: percent >= 0 };
    };

    const getLinksTrend = () => {
        if (!comparison || typeof comparison.linksYesterday === 'undefined') return undefined;
        const diff = comparison.linksToday - (comparison.linksYesterday || 0);
        return { value: `${diff >= 0 ? '+' : ''}${diff} New`, isUp: diff >= 0 };
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <StatsSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
                title="Total Clicks"
                value={totalClicks.toLocaleString()}
                trend={getClicksTrend()}
                icon="ads_click"
                tooltip="Total clicks across all your shortened links"
            />
            <StatsCard
                title="Active Links"
                value={urls.length}
                trend={getLinksTrend()}
                icon="link"
                tooltip="Number of shortened links you have created that are currently active"
            />
            <div className="bg-surface-dark border border-border-dark/60 rounded-2xl p-6 relative group hover:border-primary/40 transition-all duration-500 shadow-lg">
                <div className="absolute -right-6 -top-6 size-24 bg-orange-500/5 rounded-full blur-2xl group-hover:scale-110 transition-all"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="p-2 bg-surface-highlight rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-[24px] text-orange-400">local_fire_department</span>
                    </div>
                    <span className="flex items-center gap-1 text-orange-400 text-sm font-bold bg-orange-400/10 px-2 py-1 rounded-full">
                        Top Performer
                    </span>
                </div>
                <div className="flex items-center gap-1 mb-1 relative z-10">
                    <p className="text-slate-400 text-base sm:text-sm font-medium">Most Clicked Link</p>
                    <div className="group/tooltip relative flex items-center">
                        <span className="material-symbols-outlined text-[14px] opacity-30 cursor-help hover:opacity-100 transition-opacity text-slate-400">info</span>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 border border-white/10 text-white text-[10px] rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50 shadow-xl pointer-events-none font-body">
                            <div className="relative z-10">The link that has received the most traffic in your account</div>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-white/10"></div>
                        </div>
                    </div>
                </div>
                {topPerformer ? (
                    <>
                        <p className="text-white text-xl sm:text-2xl font-bold mt-1 font-display hover:text-primary transition-colors truncate block relative z-10">
                            /{topPerformer.alias}
                        </p>
                        <p className="text-slate-500 text-sm mt-1 relative z-10">{topPerformer.clicks} total clicks</p>
                    </>
                ) : (
                    <p className="text-slate-500 text-sm mt-1 relative z-10">No links yet</p>
                )}
            </div>
        </div >
    );
};

export default StatsGrid;
