import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import { formatDistanceToNow } from 'date-fns';
import { useLinkAnalytics } from '../hooks/useAnalytics';
import { useLinks } from '../features/links/hooks/useLinks';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { EditLinkModal } from '../features/links/components/EditLinkModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import Skeleton from '../components/ui/Skeleton';
import ActivityChart from '../features/dashboard/components/ActivityChart';
import { env } from '../config/env';

const getReferrerInfo = (domain: string) => {
    const d = domain.toLowerCase();
    if (d === 'direct') return { type: 'Direct', icon: 'ads_click' };
    if (d.includes('facebook') || d.includes('fb.me')) return { type: 'Social', icon: 'share' };
    if (d.includes('t.co') || d.includes('twitter') || d.includes('x.com')) return { type: 'Social', icon: 'flutter_dash' };
    if (d.includes('instagram')) return { type: 'Social', icon: 'camera_alt' };
    if (d.includes('linkedin')) return { type: 'Social', icon: 'person_add' };
    if (d.includes('youtube')) return { type: 'Social', icon: 'smart_display' };
    if (d.includes('google') || d.includes('bing') || d.includes('duckduckgo')) return { type: 'Search', icon: 'search' };
    return { type: 'Referral', icon: 'link' };
};

const LinkDetailsPage: React.FC = () => {
    const { alias } = useParams<{ alias: string }>();
    const navigate = useNavigate();
    const [filterDays, setFilterDays] = useState(7);
    const { data, loading, error, refetch } = useLinkAnalytics(alias, filterDays);
    const { deleteLink } = useLinks();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleConfirmDelete = async () => {
        if (!data) return;
        setIsDeleting(true);
        try {
            await deleteLink(data.id);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setIsDeleting(false);
        }
    };

    const handleCopy = () => {
        if (!data) return;
        navigator.clipboard.writeText(data.shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Initial full page loading (only when no data is present yet)
    if (loading && !data) {
        return (
            <DashboardLayout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
                    <div className="flex flex-col gap-4 border-b border-slate-200 dark:border-border-dark/60 pb-6">
                        <Skeleton className="h-4 w-32" />
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-48" />
                                    <Skeleton className="h-6 w-16 rounded" />
                                </div>
                                <Skeleton className="h-5 w-64" />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} className="h-32 rounded-xl" />
                        ))}
                    </div>
                    {/* Add chart skeleton for initial load consistency */}
                    <Skeleton className="h-[400px] rounded-2xl" />
                </div>
            </DashboardLayout>
        );
    }

    if (error || !data) {
        return (
            <DashboardLayout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center p-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Link Not Found</h2>
                    <p className="text-slate-500 font-body">The link you are looking for does not exist or has been deleted.</p>
                    <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all font-body">
                        Back to Dashboard
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Link"
                message={`This is a permanent action. All analytics data for ${env.getShortUrlBaseDisplay()}/${data.alias} will be permanently lost.`}
                confirmText="Delete Link"
                type="danger"
                isLoading={isDeleting}
                verificationValue={`/${data.alias}`}
                verificationPlaceholder="/alias"
            />

            <main className="flex-1 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-[1100px] flex flex-col gap-6">
                    {/* Breadcrumbs & Heading Combined */}
                    <div className="flex flex-col gap-4">
                        {/* Breadcrumbs */}
                        <div className="flex flex-wrap items-center gap-2 text-sm font-body">
                            <Link to="/dashboard" className="text-slate-500 dark:text-[#9db9a6] hover:text-primary transition-colors flex items-center gap-1">
                                <span className="material-symbols-outlined text-[18px]">dashboard</span>
                                Dashboard
                            </Link>
                            <span className="text-slate-400 dark:text-[#586e60]">/</span>
                            <span className="text-slate-500 dark:text-[#9db9a6]">Analytics</span>
                            <span className="text-slate-400 dark:text-[#586e60]">/</span>
                            <span className="text-slate-900 dark:text-white font-medium">{env.getShortUrlBaseDisplay()}/{data.alias}</span>
                        </div>

                        {/* Page Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200 dark:border-border-dark/60">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display">{env.getShortUrlBaseDisplay()}/{data.alias}</h1>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-primary/20 text-primary border border-primary/20 tracking-widest">ACTIVE</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 dark:text-[#9db9a6] text-sm md:text-base break-all font-body">
                                    <span className="material-symbols-outlined text-[18px]">link</span>
                                    <span className="truncate max-w-md md:max-w-xl">Original: <a href={data.longUrl} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">{data.longUrl}</a></span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setIsEditModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-dark border border-border-dark/60 text-white text-sm font-bold hover:bg-surface-highlight transition-colors shadow-sm font-body">
                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                    <span>Edit Link</span>
                                </button>
                                <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:brightness-110 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 font-body">
                                    <span className="material-symbols-outlined text-[20px]">{copied ? 'check' : 'content_copy'}</span>
                                    <span>{copied ? 'Copied' : 'Copy Link'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Date Filters Simulation */}
                    <div className="flex items-center justify-between overflow-x-auto pb-2">
                        <div className="flex gap-2 p-1 bg-background-dark/80 rounded-xl border border-border-dark/20">
                            {[
                                { label: 'Last 7 Days', value: 7 },
                                { label: 'Last 30 Days', value: 30 },
                                { label: 'All Time', value: 0 }
                            ].map((filter) => (
                                <button
                                    key={filter.value}
                                    onClick={() => setFilterDays(filter.value)}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all font-body ${filterDays === filter.value
                                        ? 'bg-surface-dark text-white shadow-sm'
                                        : 'text-slate-400 dark:text-[#9db9a6] hover:bg-surface-dark/50 hover:text-white'
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 dark:text-[#586e60] font-body">
                            <span className="material-symbols-outlined text-[16px]">schedule</span>
                            Updated just now
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {loading ? (
                            <>
                                <Skeleton className="h-[140px] rounded-xl" />
                                <Skeleton className="h-[140px] rounded-xl" />
                                <Skeleton className="h-[140px] rounded-xl" />
                            </>
                        ) : (
                            <>
                                <KPICard
                                    title="Total Clicks"
                                    value={data.totalClicks.toLocaleString()}
                                    icon="ads_click"
                                    trend="+12% vs last week"
                                    trendIcon="trending_up"
                                />
                                <KPICard
                                    title="Creation Date"
                                    value={new Date(data.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    icon="calendar_month"
                                    subtext={`${Math.floor((Date.now() - new Date(data.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days active`}
                                />
                                <KPICard
                                    title="Last Click"
                                    value={data.lastAccessed ? formatDistanceToNow(new Date(data.lastAccessed), { addSuffix: true }) : 'Never'}
                                    icon="timer"
                                    subtext={data.blocks?.countries?.[0] ? `from ${data.blocks.countries[0].name}` : 'No global data'}
                                />
                            </>
                        )}
                    </div>

                    {/* Main Graph Section */}
                    <div className="w-full">
                        <ActivityChart
                            timeline={data.blocks?.timeline || null}
                            isLoading={loading}
                            title={`Engagement ${filterDays === 0 ? '(All Time)' : `(Last ${filterDays} Days)`}`}
                        />
                    </div>

                    {/* Details Grid: Locations & Devices */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Locations Card */}
                        <div className="flex flex-col gap-4 rounded-xl bg-surface-dark p-6 border border-border-dark/40 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-display">
                                    <span className="material-symbols-outlined text-primary">public</span>
                                    Top Locations
                                </h3>
                                <button className="text-[10px] font-black text-slate-500 dark:text-[#9db9a6] hover:text-primary uppercase tracking-widest font-body">Real-time data</button>
                            </div>
                            <div className="flex flex-col gap-5 mt-2">
                                {loading ? (
                                    <>
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="flex flex-col gap-2">
                                                <div className="flex justify-between">
                                                    <Skeleton className="h-4 w-24" />
                                                    <Skeleton className="h-4 w-12" />
                                                </div>
                                                <Skeleton className="h-2 w-full rounded-full" />
                                            </div>
                                        ))}
                                    </>
                                ) : data.blocks?.countries?.length > 0 ? (
                                    data.blocks.countries.slice(0, 4).map((item: any) => {
                                        const percentage = data.totalClicks > 0 ? Math.round((item.value / data.totalClicks) * 100) : 0;
                                        return (
                                            <div key={item.name} className="flex flex-col gap-1.5 font-body">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-900 dark:text-white font-bold flex items-center gap-2">
                                                        {item.name !== 'Unknown' ? (
                                                            <img src={`https://flagcdn.com/w20/${item.name.toLowerCase()}.png`} className="w-5 h-auto rounded" alt={item.name} />
                                                        ) : '🌍'}
                                                        {item.name}
                                                    </span>
                                                    <span className="text-slate-500 dark:text-[#9db9a6] font-bold">{item.value.toLocaleString()} ({percentage}%)</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 dark:bg-background-dark/50 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-center text-slate-500 py-10 font-body italic">No location data yet</p>
                                )}
                            </div>
                        </div>

                        {/* Devices Card */}
                        <div className="flex flex-col gap-4 rounded-xl bg-surface-dark p-6 border border-border-dark/40 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-display">
                                    <span className="material-symbols-outlined text-primary">devices</span>
                                    Devices
                                </h3>
                                <button className="text-[10px] font-black text-slate-500 dark:text-[#9db9a6] hover:text-primary uppercase tracking-widest font-body">Details</button>
                            </div>
                            {loading ? (
                                <div className="flex flex-col sm:flex-row items-center gap-8 mt-2 h-full justify-center">
                                    <Skeleton className="size-32 rounded-full shrink-0" />
                                    <div className="flex flex-col gap-3 w-full">
                                        <Skeleton className="h-12 w-full rounded-lg" />
                                        <Skeleton className="h-12 w-full rounded-lg" />
                                    </div>
                                </div>
                            ) : (
                                <DeviceSection items={data.blocks?.devices} total={data.totalClicks} />
                            )}
                        </div>
                    </div>

                    {/* Referrer Table Section */}
                    <div className="w-full rounded-xl bg-surface-dark border border-border-dark/40 shadow-sm overflow-hidden font-body">
                        <div className="p-6 border-b border-border-dark/40">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-display">
                                <span className="material-symbols-outlined text-primary">alt_route</span>
                                Traffic Sources
                            </h3>
                        </div>
                        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent">
                            <div className="min-w-[600px] w-full">
                                <table className="w-full text-left text-sm text-slate-400 dark:text-[#9db9a6]">
                                    <thead className="bg-[#2e1d15]/50 text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-[#8a6350]">
                                        <tr>
                                            <th className="px-6 py-4" scope="col">Source</th>
                                            <th className="px-6 py-4" scope="col">Type</th>
                                            <th className="px-6 py-4" scope="col">Clicks</th>
                                            <th className="px-6 py-4" scope="col">Trend</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-dark/30">
                                        {loading ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <tr key={i}>
                                                    <td className="px-6 py-4"><div className="flex items-center gap-3"><Skeleton className="size-8 rounded-lg" /><Skeleton className="h-4 w-32" /></div></td>
                                                    <td className="px-6 py-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
                                                    <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                                                    <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                                                </tr>
                                            ))
                                        ) : data.blocks?.referrers?.length > 0 ? (
                                            data.blocks.referrers.slice(0, 8).map((ref: any) => {
                                                const { type, icon } = getReferrerInfo(ref.name);
                                                return (
                                                    <tr key={ref.name} className="hover:bg-primary/5 transition-colors group">
                                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                                            <div className="size-8 rounded-lg bg-surface-dark flex items-center justify-center border border-border-dark/30 group-hover:border-primary/30 transition-colors">
                                                                <span className="material-symbols-outlined text-[18px] text-primary">{icon}</span>
                                                            </div>
                                                            <span className="truncate max-w-[150px] md:max-w-none">{ref.name}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${type === 'Social' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                                type === 'Search' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                                    type === 'Direct' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                                                }`}>
                                                                {type}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 font-black text-slate-900 dark:text-white">
                                                            {ref.value.toLocaleString()}
                                                            <span className="ml-2 text-[10px] text-slate-500 dark:text-[#586e60] font-normal">clics</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className={`flex items-center gap-1 font-bold text-xs ${ref.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                                <span className="material-symbols-outlined text-[14px]">
                                                                    {ref.trend >= 0 ? 'trending_up' : 'trending_down'}
                                                                </span>
                                                                <span>{Math.abs(ref.trend)}%</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic font-body">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="material-symbols-outlined text-4xl opacity-20">analytics</span>
                                                        <span>No traffic source data available yet.</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="mt-8 p-6 rounded-xl border border-red-500/20 bg-red-500/5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:bg-red-500/[0.08]">
                        <div className="font-body">
                            <h4 className="font-bold text-red-500 dark:text-red-400 flex items-center gap-2 font-display">
                                <span className="material-symbols-outlined text-[20px]">report_problem</span>
                                Danger Zone
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Permanently delete this link and all its history. This cannot be undone.</p>
                        </div>
                        <button onClick={() => setIsDeleteModalOpen(true)} className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white font-bold text-sm rounded-lg border border-red-500/20 transition-all font-body">
                            Delete Link
                        </button>
                    </div>
                </div>
            </main>

            {isEditModalOpen && (
                <EditLinkModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={() => { setIsEditModalOpen(false); refetch(); }}
                    link={data}
                />
            )}
        </DashboardLayout>
    );
};

const KPICard = ({ title, value, icon, trend, trendIcon, subtext }: any) => (
    <div className="group relative overflow-hidden rounded-xl bg-surface-dark p-6 border border-border-dark/40 shadow-sm hover:shadow-md transition-all">
        <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-7xl text-primary">{icon}</span>
        </div>
        <div className="flex flex-col gap-2 relative z-10">
            <p className="text-slate-500 dark:text-[#9db9a6] text-sm font-medium flex items-center gap-1 font-body">
                {title}
                <span className="material-symbols-outlined text-[16px] opacity-40">info</span>
            </p>
            <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight font-display">{value}</p>
            {trend && (
                <div className="flex items-center gap-1 text-primary text-xs font-bold mt-1 font-body">
                    <span className="material-symbols-outlined text-[16px]">{trendIcon}</span>
                    <span>{trend}</span>
                </div>
            )}
            {subtext && <p className="text-slate-400 dark:text-[#586e60] text-xs font-medium mt-1 font-body">{subtext}</p>}
        </div>
    </div>
);

const DeviceSection = ({ items, total }: any) => {
    const mobileValue = items?.find((i: any) => i.name.toLowerCase().includes('mobile'))?.value || 0;
    const desktopValue = items?.find((i: any) => i.name.toLowerCase().includes('desktop'))?.value || 0;
    const mobilePercentage = total > 0 ? Math.round((mobileValue / total) * 100) : 0;
    const desktopPercentage = total > 0 ? Math.round((desktopValue / total) * 100) : 100 - mobilePercentage;

    const isMobileLeading = mobileValue >= desktopValue && mobileValue > 0;
    const isDesktopLeading = desktopValue > mobileValue;

    const devices = [
        {
            name: 'Mobile',
            value: mobileValue,
            percentage: mobilePercentage,
            icon: 'smartphone',
            subtext: 'iOS & Android',
            isLeading: isMobileLeading
        },
        {
            name: 'Desktop',
            value: desktopValue,
            percentage: desktopPercentage,
            icon: 'computer',
            subtext: 'Windows & Mac',
            isLeading: isDesktopLeading
        }
    ].sort((a, b) => b.value - a.value);

    return (
        <div className="flex flex-col sm:flex-row items-center gap-8 mt-2 h-full justify-center">
            {/* Donut Chart Simulation */}
            <div className="relative size-32 shrink-0">
                <div className="absolute inset-0 rounded-full border-[12px] border-background-dark/80 dark:border-background-dark" style={{
                    background: `conic-gradient(#ec5b13 0% ${devices[0].percentage}%, #49332a ${devices[0].percentage}% 100%)`,
                    mask: 'radial-gradient(transparent 58%, black 60%)',
                    WebkitMask: 'radial-gradient(transparent 58%, black 60%)'
                }}></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-display">
                    <span className="text-2xl font-bold text-white">{devices[0].percentage}%</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{devices[0].name}</span>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-3 w-full font-body">
                {devices.map((device) => (
                    <div key={device.name} className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${device.isLeading
                        ? 'bg-primary/10 border-primary/40 shadow-[inset_0_0_12px_rgba(236,91,19,0.05)]'
                        : 'bg-[#2e1d15]/30 border-border-dark/40 opacity-70'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-md transition-colors ${device.isLeading ? 'bg-primary/20 text-primary' : 'bg-surface-dark text-slate-500'}`}>
                                <span className="material-symbols-outlined text-xl">{device.icon}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-sm font-bold transition-colors ${device.isLeading ? 'text-white' : 'text-slate-400'}`}>{device.name}</span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{device.subtext}</span>
                            </div>
                        </div>
                        <span className={`text-sm font-black transition-colors ${device.isLeading ? 'text-primary' : 'text-slate-500'}`}>{device.percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LinkDetailsPage;
