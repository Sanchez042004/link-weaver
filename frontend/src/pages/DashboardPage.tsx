import React, { useState, useEffect } from 'react';
import { useLinks } from '../features/links/hooks/useLinks';
import { useAuth } from '../context/AuthContext';
import { useGeneralAnalytics } from '../hooks/useAnalytics';
import { useNavigate, useLocation } from 'react-router-dom';
import { env } from '../config/env';

import { DashboardLayout } from '../layouts/DashboardLayout';
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
            {/* Headline Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
                <div>
                    <h1 className="text-[20px] font-medium text-text-primary">Welcome back, {user?.name || 'User'}</h1>
                    <p className="text-[13px] text-text-secondary mt-1">Performance metrics for your active workspace.</p>
                </div>
                {/* Period Selector Tabs */}
                <div className="mt-6 md:mt-0 flex space-x-6">
                    {[
                        { label: '7D', value: 7 },
                        { label: '30D', value: 30 },
                        { label: 'ALL', value: 0 }
                    ].map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setFilterDays(filter.value)}
                            className={`text-[13px] font-medium transition-colors py-1 ${
                                filterDays === filter.value 
                                ? 'tab-active' 
                                : 'text-text-muted hover:text-text-primary'
                            }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

                {/* Stats Grid */}
                <div className="mb-12">
                    <StatsGrid
                        urls={urls}
                        isLoading={isLoading}
                        comparison={analyticsData?.comparison}
                        filteredClicks={analyticsData?.totalClicks}
                        topLink={analyticsData?.blocks?.topLinks?.[0]}
                    />
                </div>

                {/* Main Chart Row */}
                <div className="mb-12">
                    <ActivityChart
                        timeline={analyticsData?.blocks?.timeline || null}
                        isLoading={isAnalyticsLoading}
                        title="TRAFFIC OVER TIME"
                    />
                </div>

                {/* Recent Links Table */}
                <div className="mb-12">
                    <RecentLinksTable
                        urls={urls.slice(0, 3)}
                        isLoading={isLoading}
                        onDelete={handleDeleteClick}
                        onAnalytics={(alias) => navigate(`/analytics/${alias}`)}
                        onShowQR={(url) => {
                            setSelectedLink(url);
                            setIsQRModalOpen(true);
                        }}
                    />
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
