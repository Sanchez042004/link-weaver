import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useLinkAnalytics } from '../hooks/useAnalytics';
import { useLinks } from '../hooks/useLinks'; // reuse deleteLink
import { DashboardLayout } from '../layouts/DashboardLayout';
import { EditLinkModal } from '../features/links/components/EditLinkModal';
import { DeleteLinkModal } from '../features/links/components/DeleteLinkModal';

const LinkDetailsPage: React.FC = () => {
    const { alias } = useParams<{ alias: string }>();
    const navigate = useNavigate();
    const { data, loading, error, refetch } = useLinkAnalytics(alias);
    const { deleteLink } = useLinks(); // This hook handles deletion logic

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
                <div className="min-h-[60vh] flex items-center justify-center text-slate-500">
                    <span className="material-symbols-outlined text-[40px] animate-spin text-primary">progress_activity</span>
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
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 animate-in fade-in">
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
                    <StatBox title="Last Click" value={data.lastAccessed ? new Date(data.lastAccessed).toLocaleDateString() : 'Never'} icon="schedule" color="orange" />
                </div>

                {/* Main Chart */}
                <div className="rounded-xl border border-slate-200 dark:border-[#324467] bg-white dark:bg-[#111722] p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Engagement (Last 7 Days)</h3>
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
            </div>
        </DashboardLayout>
    );
};

const StatBox = ({ title, value, icon, color }: any) => {
    const colors: any = { primary: 'text-primary bg-primary/10', purple: 'text-purple-500 bg-purple-500/10', orange: 'text-orange-500 bg-orange-500/10' };
    return (
        <div className="flex flex-col justify-between gap-4 rounded-xl p-6 bg-white dark:bg-[#111722] border border-slate-200 dark:border-[#324467] shadow-sm">
            <div className={`p-2 rounded-lg w-fit ${colors[color]}`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white truncate" title={value}>{value}</p>
            </div>
        </div>
    )
}

export default LinkDetailsPage;
