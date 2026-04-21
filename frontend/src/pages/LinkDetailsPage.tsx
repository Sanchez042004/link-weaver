import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { useLinkAnalytics } from '../hooks/useAnalytics';
import { useLinks } from '../features/links/hooks/useLinks';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { EditLinkModal } from '../features/links/components/EditLinkModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import Skeleton from '../components/ui/Skeleton';
import ActivityChart from '../features/dashboard/components/ActivityChart';
import DevicesTable from '../features/analytics/components/DevicesTable';
import LocationsTable from '../features/analytics/components/LocationsTable';
import { env } from '../config/env';

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

    if (loading && !data) {
        return (
            <DashboardLayout>
                <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-12">
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Skeleton className="h-32 w-full rounded-xl" />
                        <Skeleton className="h-32 w-full rounded-xl" />
                        <Skeleton className="h-32 w-full rounded-xl" />
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !data) {
        return (
            <DashboardLayout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center p-4">
                    <h2 className="text-2xl font-headline font-bold text-text-primary">Link Not Found</h2>
                    <p className="text-text-muted">The link you are looking for does not exist or has been deleted.</p>
                    <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-accent text-white rounded-lg font-bold font-headline">
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

            <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-12 w-full font-body">
                {/* Breadcrumbs & Header */}
                <section className="space-y-6">
                    <nav className="flex items-center space-x-2 text-[11px] font-label font-semibold uppercase tracking-widest text-text-secondary">
                        <Link to="/links" className="hover:text-text-primary transition-colors">My Links</Link>
                        <span className="material-symbols-outlined !text-[12px]">chevron_right</span>
                        <span className="text-text-primary">{env.getShortUrlBaseDisplay()}/{data.alias}</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-4">
                                <h2 className="text-3xl md:text-5xl font-headline font-semibold tracking-[0.02em] text-text-primary">{data.alias}</h2>
                                <span className="px-3 py-1 bg-accent-soft text-accent rounded-md text-[10px] font-label font-bold tracking-wider uppercase">ACTIVE</span>
                            </div>
                            <p className="text-text-secondary text-sm break-all max-w-2xl">
                                Route: <a href={data.longUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline transition-colors font-mono">{data.longUrl}</a>
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <button onClick={() => setIsEditModalOpen(true)} className="px-5 py-2.5 rounded-lg border border-border-secondary text-text-primary font-semibold text-xs hover:bg-surface-hover transition-colors flex items-center space-x-2">
                                <span className="material-symbols-outlined !text-[16px]">edit</span>
                                <span>Edit Link</span>
                            </button>
                            <button onClick={handleCopy} className="px-5 py-2.5 rounded-lg bg-accent text-white font-semibold text-xs hover:opacity-90 transition-opacity flex items-center space-x-2">
                                <span className="material-symbols-outlined !text-[16px]">{copied ? 'check' : 'content_copy'}</span>
                                <span>{copied ? 'Copied' : 'Copy Link'}</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Stats Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-surface p-6 rounded-xl border border-border-primary space-y-3">
                        <div className="flex justify-between items-start">
                            <p className="text-[11px] font-label font-semibold text-text-secondary uppercase tracking-widest">Total Clicks</p>
                            <span className="material-symbols-outlined text-text-secondary">analytics</span>
                        </div>
                        <div className="flex items-baseline space-x-3">
                            <h3 className="text-3xl font-mono font-bold text-text-primary tracking-tighter">{data.totalClicks.toLocaleString()}</h3>
                            {data.trend?.isUp && data.trend?.value && (
                                <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded-md text-[10px] font-mono font-bold border border-green-500/20">{data.trend.value}</span>
                            )}
                        </div>
                    </div>

                    <div className="bg-surface p-6 rounded-xl border border-border-primary space-y-3">
                        <div className="flex justify-between items-start">
                            <p className="text-[11px] font-label font-semibold text-text-secondary uppercase tracking-widest">Creation Date</p>
                            <span className="material-symbols-outlined text-text-secondary">calendar_today</span>
                        </div>
                        <h3 className="text-[24px] font-mono font-semibold text-text-primary tracking-tighter">
                            {format(new Date(data.createdAt), 'MMM d, yyyy')}
                        </h3>
                    </div>

                    <div className="bg-surface p-6 rounded-xl border border-border-primary space-y-3">
                        <div className="flex justify-between items-start">
                            <p className="text-[11px] font-label font-semibold text-text-secondary uppercase tracking-widest">Last Click</p>
                            <span className="material-symbols-outlined text-text-secondary">history</span>
                        </div>
                        <h3 className="text-[24px] font-mono font-semibold text-text-primary tracking-tighter capitalize">
                            {data.lastAccessed ? formatDistanceToNow(new Date(data.lastAccessed), { addSuffix: true }) : 'Never'}
                        </h3>
                    </div>
                </section>

                {/* Main Chart Section */}
                <section className="bg-surface p-8 rounded-xl border border-border-primary">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <h4 className="text-[11px] font-label font-semibold text-text-secondary uppercase tracking-widest">Traffic Over Time</h4>
                        <div className="flex space-x-2">
                            <button onClick={() => setFilterDays(7)} className={`px-3 py-1 rounded-md text-[10px] font-label font-bold transition-colors ${filterDays === 7 ? 'bg-surface-hover text-text-primary border border-border-secondary' : 'text-text-secondary hover:text-text-primary border border-transparent'}`}>7D</button>
                            <button onClick={() => setFilterDays(30)} className={`px-3 py-1 rounded-md text-[10px] font-label font-bold transition-colors ${filterDays === 30 ? 'bg-surface-hover text-text-primary border border-border-secondary' : 'text-text-secondary hover:text-text-primary border border-transparent'}`}>30D</button>
                            <button onClick={() => setFilterDays(0)} className={`px-3 py-1 rounded-md text-[10px] font-label font-bold transition-colors ${filterDays === 0 ? 'bg-surface-hover text-text-primary border border-border-secondary' : 'text-text-secondary hover:text-text-primary border border-transparent'}`}>ALL</button>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        {/* We reuse ActivityChart which acts independently but matches the exact aesthetic */}
                        <ActivityChart 
                            timeline={data.blocks?.timeline || null}
                            isLoading={loading}
                            title="" // Hidden title since we have it above
                        />
                    </div>
                </section>

                {/* Tables Grid */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <DevicesTable 
                        devices={data.blocks?.devices || []} 
                        loading={loading} 
                    />
                    <LocationsTable 
                        countries={data.blocks?.countries || []} 
                        totalClicks={data.totalClicks} 
                        loading={loading} 
                    />
                </section>

                {/* Danger Zone */}
                <section className="bg-surface rounded-xl overflow-hidden border-[1px] border-red-500/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h4 className="text-[13px] font-headline font-semibold text-text-primary flex items-center gap-2">
                            <span className="material-symbols-outlined text-danger text-[18px]">warning</span>
                            Danger Zone
                        </h4>
                        <p className="text-[12px] text-text-secondary">Permanently delete this link and all its history. This action cannot be undone.</p>
                    </div>
                    <button onClick={() => setIsDeleteModalOpen(true)} className="px-5 py-2.5 bg-danger/10 text-danger hover:bg-danger hover:text-white font-semibold text-xs rounded-lg transition-colors flex items-center space-x-2 whitespace-nowrap border-[1px] border-red-500/50">
                        <span className="material-symbols-outlined !text-[16px]">delete</span>
                        <span>Delete Link</span>
                    </button>
                </section>
            </div>

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

export default LinkDetailsPage;
