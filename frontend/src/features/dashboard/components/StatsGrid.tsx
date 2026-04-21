import React from 'react';
import type { Url } from '../../../api/url.api';
import Skeleton from '../../../components/ui/Skeleton';
import { env } from '../../../config/env';

interface StatsCardProps {
    title: string;
    value: string | number;
    trend?: {
        value: string;
        isUp?: boolean;
    };
    isAccent?: boolean;
    subtitle?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, isAccent, subtitle }) => (
    <div className="bg-surface border border-border-primary rounded-xl p-5">
        <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] uppercase tracking-[0.06em] text-text-muted font-semibold">{title}</span>
            {trend && (
                <span className={`${isAccent ? 'stat-badge-accent uppercase tracking-wider' : 'stat-badge'} px-2 py-0.5 rounded text-[10px] font-medium`}>
                    {trend.value}
                </span>
            )}
        </div>
        <div className="text-[28px] font-medium text-text-primary">{value}</div>
        {subtitle && (
            <div className="text-[12px] font-mono text-accent mt-1 truncate">{subtitle}</div>
        )}
    </div>
);

const StatsSkeleton: React.FC = () => (
    <div className="bg-surface border border-border-primary rounded-xl p-5 h-[104px]">
        <Skeleton className="h-4 w-24 mb-6 rounded" />
        <Skeleton className="h-8 w-32 rounded" />
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
        previousTotalClicks?: number;
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

    // Calculate real trends (Period based)
    const getClicksTrend = () => {
        if (!comparison) return undefined;

        // Use period comparison if available, fallback to daily
        const current = totalClicks;
        const previous = comparison.previousTotalClicks !== undefined ? comparison.previousTotalClicks : comparison.clicksYesterday;

        if (previous === 0) {
            if (current === 0) return undefined;
            return { value: `+${current} New`, isUp: true };
        }

        const diff = current - previous;
        const percent = Math.round((diff / previous) * 100);
        
        // If we are using previousTotalClicks, the label is clear. 
        // If we are falling back to clicksYesterday, it's daily.
        return { value: `${percent > 0 ? '+' : ''}${percent}%`, isUp: percent >= 0 };
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[1, 2, 3].map((i) => (
                    <StatsSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatsCard
                title="TOTAL CLICKS"
                value={totalClicks >= 1000 ? (totalClicks/1000).toFixed(1) + 'K' : totalClicks.toLocaleString()}
                trend={getClicksTrend()}
            />
            <StatsCard
                title="ACTIVE LINKS"
                value={urls.length.toLocaleString()}
            />
            <StatsCard
                title="TOP PERFORMER"
                value={topPerformer ? (topPerformer.clicks >= 1000 ? (topPerformer.clicks/1000).toFixed(1) + 'K' : topPerformer.clicks) : '0'}
                subtitle={topPerformer ? `${env.getShortUrlBaseDisplay()}/${topPerformer.alias}` : 'No links yet'}
                trend={{ value: 'Hot' }}
                isAccent={true}
            />
        </div>
    );
};

export default StatsGrid;
