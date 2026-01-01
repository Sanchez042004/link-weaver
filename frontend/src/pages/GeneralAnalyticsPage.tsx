import React from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useGeneralAnalytics } from '../hooks/useAnalytics';
import { DashboardLayout } from '../layouts/DashboardLayout';

const GeneralAnalyticsPage: React.FC = () => {
    const { data, loading } = useGeneralAnalytics();

    if (loading) {
        return (
            <DashboardLayout>
                <div className="min-h-[60vh] flex items-center justify-center text-slate-500">
                    <div className="flex flex-col items-center gap-4">
                        <span className="material-symbols-outlined text-[40px] animate-spin text-primary">progress_activity</span>
                        <p className="font-bold">Loading analytics...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!data) return null;

    const chartData = Object.entries(data.blocks?.timeline || {}).map(([date, clicks]) => ({
        date,
        clicks
    })).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Helper functions for icons and colors could be moved to utils/analyticsHelpers.ts
    // For now kept here to be self-contained in this refactor step

    return (
        <DashboardLayout>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
                <div className="flex flex-col gap-2 mb-8">
                    <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                        Overview
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base">
                        Overview of all your links performance
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Total Clicks" value={data.totalClicks} icon="trending_up" color="green" />
                    <StatCard title="Active Links" value={data.blocks?.topLinks?.length || 0} icon="link" color="primary" />
                    <StatCard
                        title="Avg per Link"
                        value={data.blocks?.topLinks?.length > 0 ? Math.round(data.totalClicks / data.blocks.topLinks.length) : 0}
                        icon="analytics"
                        color="orange"
                    />
                </div>

                <div className="bg-white dark:bg-[#1e293b] rounded-xl p-6 border border-slate-200 dark:border-[#324467] shadow-sm mb-8">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Clicks Over Time (Last 7 Days)</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #324467', borderRadius: '8px', color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TopList title="Top Locations" items={data.blocks?.countries} type="country" total={data.totalClicks} />
                    <TopList title="Top Devices" items={data.blocks?.devices} type="device" total={data.totalClicks} />
                </div>
            </div>
        </DashboardLayout>
    );
};

// Sub-components for cleaner file
const StatCard = ({ title, value, icon, color }: any) => {
    const colorClasses: any = {
        green: 'text-green-500 bg-green-500/10',
        primary: 'text-primary bg-primary/10',
        orange: 'text-orange-500 bg-orange-500/10'
    };

    return (
        <div className="bg-white dark:bg-[#1e293b] rounded-xl p-6 border border-slate-200 dark:border-[#324467] shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">{title}</p>
                <div className={`size-10 flex items-center justify-center rounded-lg ${colorClasses[color]}`}>
                    <span className="material-symbols-outlined text-[24px]">{icon}</span>
                </div>
            </div>
            <p className="text-4xl font-black text-slate-900 dark:text-white">{value}</p>
        </div>
    );
};

const TopList = ({ title, items, type, total }: any) => {
    return (
        <div className="bg-white dark:bg-[#1e293b] rounded-xl p-6 border border-slate-200 dark:border-[#324467] shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">{type === 'country' ? 'public' : 'devices'}</span>
                {title}
            </h3>
            <div className="space-y-3">
                {items?.slice(0, 5).map((item: any) => {
                    const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
                    return (
                        <div key={item.name} className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-slate-900 dark:text-white flex items-center gap-2">
                                    {type === 'country' && item.name !== 'Unknown' && <img src={`https://flagcdn.com/w20/${item.name.toLowerCase()}.png`} className="w-5 h-auto rounded" alt={item.name} />}
                                    {item.name}
                                </span>
                                <span className="text-slate-500 dark:text-[#92a4c9]">{percentage}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-[#324467] rounded-full h-2">
                                <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${percentage}%` }}></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default GeneralAnalyticsPage;
