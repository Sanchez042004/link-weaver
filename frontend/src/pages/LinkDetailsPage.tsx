import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { useLinkAnalytics } from '../hooks/useAnalytics';
import { useLinks } from '../hooks/useLinks';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { EditLinkModal } from '../features/links/components/EditLinkModal';
import { DeleteLinkModal } from '../features/links/components/DeleteLinkModal';
import Skeleton from '../components/ui/Skeleton';

// ... imports
// ... imports

const LinkDetailsPage: React.FC = () => {
    const { alias } = useParams<{ alias: string }>();
    const navigate = useNavigate();
    const { data, loading, error, refetch } = useLinkAnalytics(alias);
    const { deleteLink } = useLinks();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleConfirmDelete = async () => {
        if (!data) return;
        try {
            await deleteLink(data.id);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
        }
    };

    const handleCopy = () => {
        if (!data) return;
        navigator.clipboard.writeText(data.shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
                    {/* Header Skeleton */}
                    <div className="flex flex-col gap-4 border-b border-slate-800 pb-6">
                        <Skeleton className="h-4 w-32" />
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-48" />
                                    <Skeleton className="h-6 w-16 rounded" />
                                </div>
                                <Skeleton className="h-5 w-64" />
                            </div>
                            <div className="flex gap-3">
                                <Skeleton className="h-10 w-24 rounded-lg" />
                                <Skeleton className="h-10 w-32 rounded-lg" />
                            </div>
                        </div>
                    </div>

                    {/* Stats Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 rounded-xl bg-slate-800/40 border border-slate-700/50 p-6 flex flex-col justify-between">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="size-10 rounded-lg" />
                                </div>
                                <Skeleton className="h-8 w-16" />
                            </div>
                        ))}
                    </div>

                    {/* Chart Skeleton */}
                    <div className="h-[300px] rounded-xl bg-slate-800/40 border border-slate-700/50 p-6">
                        <Skeleton className="h-6 w-48 mb-6" />
                        <Skeleton className="h-full w-full rounded-lg opacity-20" />
                    </div>

                    {/* Top Lists Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map(i => (
                            <div key={i} className="h-64 rounded-xl bg-slate-800/40 border border-slate-700/50 p-6 flex flex-col gap-4">
                                <Skeleton className="h-6 w-32" />
                                <div className="space-y-4">
                                    {[1, 2, 3, 4].map(j => (
                                        <div key={j} className="flex flex-col gap-2">
                                            <div className="flex justify-between">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-4 w-8" />
                                            </div>
                                            <Skeleton className="h-2 w-full rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !data) {
        return (
            <DashboardLayout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
                    <h2 className="text-2xl font-bold dark:text-white">Link Not Found</h2>
                    <p className="text-slate-500">The link you are looking for does not exist or has been deleted.</p>
                    <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-primary text-white rounded-lg">Back to Dashboard</button>
                </div>
            </DashboardLayout>
        );
    }

    const chartData = Object.entries(data.blocks?.timeline || {}).map(([date, clicks]) => ({
        date,
        clicks
    })).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <DashboardLayout>
            {isEditModalOpen && (
                <EditLinkModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={() => { setIsEditModalOpen(false); refetch(); }}
                    link={{ ...data, customAlias: data.alias }} // Adapt data shape to Url interface if needed
                />
            )}

            <DeleteLinkModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                alias={data?.alias || ''}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
                {/* Header Navigation */}
                <div className="flex items-center gap-2 text-sm">
                    <Link className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" to="/dashboard">Dashboard</Link>
                    <span className="material-symbols-outlined text-[16px] text-slate-400">chevron_right</span>
                    <span className="text-slate-900 dark:text-white font-medium">Link Details</span>
                </div>

                {/* Link Info & Actions */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-200 dark:border-[#324467]">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">{data.alias}</h1>
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">Active</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-[#92a4c9] break-all">
                            <span className="material-symbols-outlined text-[18px]">subdirectory_arrow_right</span>
                            <a href={data.longUrl} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">{data.longUrl}</a>
                        </div>
                    </div>
                    <div className="flex gap-3 shrink-0">
                        <button onClick={() => setIsEditModalOpen(true)} className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-white dark:bg-[#232f48] border border-slate-200 dark:border-[#324467] text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-[#324467] transition-colors">
                            <span className="material-symbols-outlined text-[18px]">edit</span> Edit
                        </button>
                        <button onClick={handleCopy} className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:bg-blue-600 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">{copied ? 'check' : 'content_copy'}</span>
                            <span>{copied ? 'Copied' : 'Copy Link'}</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatBox title="Total Clicks" value={data.totalClicks} icon="ads_click" color="primary" />
                    <StatBox title="Created" value={new Date(data.createdAt).toLocaleDateString()} icon="calendar_today" color="purple" />
                    <StatBox
                        title="Last Click"
                        value={data.lastAccessed ? formatDistanceToNow(new Date(data.lastAccessed), { addSuffix: true }) : 'Never'}
                        icon="schedule"
                        color="orange"
                    />
                </div>

                {/* Main Chart */}
                <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Engagement (Last 7 Days)</h3>
                    <div className="w-full h-[240px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="detailChartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2b6cee" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#2b6cee" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#324467', color: '#fff' }} />
                                <Area type="monotone" dataKey="clicks" stroke="#2b6cee" strokeWidth={2} fillOpacity={1} fill="url(#detailChartGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>


                {/* Top Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TopList title="Top Locations" items={data.blocks?.countries} type="country" total={data.totalClicks} />
                    <TopList title="Top Devices" items={data.blocks?.devices} type="device" total={data.totalClicks} />
                </div>

                {/* Delete Zone */}
                <div className="p-6 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-red-100">Delete this link</h4>
                        <p className="text-sm text-slate-600 dark:text-red-200/70">Permanently remove this link and all its data.</p>
                    </div>
                    <button onClick={() => setIsDeleteModalOpen(true)} className="px-4 py-2 bg-white dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-sm rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-50 transition-colors">
                        Delete Link
                    </button>
                </div>

                {data && (
                    <>
                        <EditLinkModal
                            isOpen={isEditModalOpen}
                            onClose={() => setIsEditModalOpen(false)}
                            link={data}
                            onSuccess={() => {
                                setIsEditModalOpen(false);
                                refetch();
                            }}
                        />
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

const StatBox = ({ title, value, icon, color }: any) => {
    const colorClasses: any = {
        primary: { icon: 'text-primary', bg: 'bg-primary/10' },
        purple: { icon: 'text-purple-500', bg: 'bg-purple-500/10' },
        orange: { icon: 'text-orange-500', bg: 'bg-orange-500/10' }
    };
    const c = colorClasses[color] || colorClasses.primary;

    return (
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
                <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">{title}</p>
                <div className={`size-10 flex items-center justify-center ${c.bg} rounded-lg`}>
                    <span className={`material-symbols-outlined text-[24px] ${c.icon}`}>{icon}</span>
                </div>
            </div>
            <div className="flex items-end gap-3 mt-auto">
                <p className="text-2xl font-black text-white tracking-tight">{value}</p>
            </div>
        </div>
    );
};

const TopList = ({ title, items, type, total }: any) => {
    return (
        <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">{type === 'country' ? 'public' : 'devices'}</span>
                {title}
            </h3>
            <div className="space-y-3">
                {items?.slice(0, 5).map((item: any) => {
                    const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
                    return (
                        <div key={item.name} className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-white flex items-center gap-2">
                                    {type === 'country' && item.name !== 'Unknown' && <img src={`https://flagcdn.com/w20/${item.name.toLowerCase()}.png`} className="w-5 h-auto rounded" alt={item.name} />}
                                    {item.name}
                                </span>
                                <span className="text-slate-400">{percentage}%</span>
                            </div>
                            <div className="w-full bg-slate-700/50 rounded-full h-2">
                                <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${percentage}%` }}></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LinkDetailsPage;
