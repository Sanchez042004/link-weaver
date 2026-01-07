import React, { useState, useEffect } from 'react';
import { useLinks } from '../features/links/hooks/useLinks';
import { useAuth } from '../context/AuthContext';
import { useGeneralAnalytics } from '../hooks/useAnalytics';
import { useNavigate, useLocation } from 'react-router-dom';
import { env } from '../config/env';

import { DashboardLayout } from '../layouts/DashboardLayout';
import DashboardHeader from '../features/dashboard/components/DashboardHeader';
import StatsGrid from '../features/dashboard/components/StatsGrid';
import ActivityChart from '../features/dashboard/components/ActivityChart';
import RecentLinksTable from '../features/dashboard/components/RecentLinksTable';

import { CreateLinkModal } from '../features/links/components/CreateLinkModal';
import { EditLinkModal } from '../features/links/components/EditLinkModal';
import { QRCodeModal } from '../features/links/components/QRCodeModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import type { Url } from '../api/url.api';

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { urls, isLoading: isLinksLoading, deleteLink, fetchUrls } = useLinks();
    const [filterDays, setFilterDays] = useState(7);
    const { data: analyticsData, loading: isAnalyticsLoading } = useGeneralAnalytics(filterDays);

    const isLoading = isLinksLoading || isAnalyticsLoading;

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);

    const [selectedLink, setSelectedLink] = useState<Url | null>(null);
    const [linkToDelete, setLinkToDelete] = useState<Url | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const location = useLocation();

    // Listen for create modal state from navigation
    useEffect(() => {
        if (location.state?.openCreateModal) {
            setIsCreateModalOpen(true);
            // Clear state to avoid reopening on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleEdit = (url: Url) => {
        setSelectedLink(url);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        const link = urls.find(u => u.id === id);
        if (link) {
            setLinkToDelete(link);
            setIsDeleteModalOpen(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (linkToDelete) {
            setIsDeleting(true);
            try {
                await deleteLink(linkToDelete.id);
                setLinkToDelete(null);
                setIsDeleteModalOpen(false);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleSuccessCreate = () => {
        setIsCreateModalOpen(false);
        fetchUrls();
    }

    const handleSuccessEdit = () => {
        setIsEditModalOpen(false);
        fetchUrls();
    }

    return (
        <DashboardLayout>
            <div className="flex-1 flex flex-col h-full relative font-body">
                <DashboardHeader />

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
                        {/* Welcome & Headline */}
                        <div className="page-transition">
                            <h1 className="text-white text-3xl font-bold tracking-tight font-display">
                                Welcome back, {user?.name?.split(' ')[0] || 'User'} <span className="animate-pulse inline-block ml-1">👋</span>
                            </h1>
                            <p className="text-slate-400 mt-1">Here's what's happening with your links today.</p>
                        </div>

                        {/* Date Filters */}
                        <div className="flex items-center justify-between overflow-x-auto pb-2 page-transition" style={{ animationDelay: '0.05s' }}>
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

                        {/* Stats Grid */}
                        <div className="page-transition" style={{ animationDelay: '0.1s' }}>
                            <StatsGrid
                                urls={urls}
                                isLoading={isLoading}
                                comparison={analyticsData?.comparison}
                                filteredClicks={analyticsData?.totalClicks}
                                topLink={analyticsData?.blocks?.topLinks?.[0]}
                            />
                        </div>

                        {/* Main Chart Row */}
                        <div className="w-full page-transition" style={{ animationDelay: '0.2s' }}>
                            <ActivityChart
                                timeline={analyticsData?.blocks?.timeline || null}
                                isLoading={isAnalyticsLoading}
                                title={`Overview ${filterDays === 0 ? '(All Time)' : `(Last ${filterDays} Days)`}`}
                            />
                        </div>

                        {/* Recent Links Table */}
                        <div className="page-transition" style={{ animationDelay: '0.3s' }}>
                            <RecentLinksTable
                                urls={urls}
                                isLoading={isLoading}
                                onEdit={handleEdit}
                                onDelete={handleDeleteClick}
                                onAnalytics={(alias) => navigate(`/analytics/${alias}`)}
                                onShowQR={(url) => {
                                    setSelectedLink(url);
                                    setIsQRModalOpen(true);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals outside scroll area */}
            <CreateLinkModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleSuccessCreate}
            />

            {selectedLink && (
                <>
                    <EditLinkModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        link={selectedLink}
                        onSuccess={handleSuccessEdit}
                    />
                    <QRCodeModal
                        isOpen={isQRModalOpen}
                        onClose={() => setIsQRModalOpen(false)}
                        url={selectedLink.shortUrl}
                        alias={selectedLink.alias}
                    />
                </>
            )}

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setLinkToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Link"
                message={`This is a permanent action. All analytics data for ${env.getShortUrlBaseDisplay()}/${linkToDelete?.alias} will be permanently lost.`}
                confirmText="Delete Link"
                type="danger"
                isLoading={isDeleting}
                verificationValue={linkToDelete ? `/${linkToDelete.alias}` : ''}
                verificationPlaceholder="/alias"
            />
        </DashboardLayout>
    );
};

export default DashboardPage;
