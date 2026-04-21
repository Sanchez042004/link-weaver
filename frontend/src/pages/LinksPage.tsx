import React, { useState, useEffect } from 'react';
import { useLinks } from '../features/links/hooks/useLinks';
import { useNavigate, useLocation } from 'react-router-dom';
import { env } from '../config/env';

import { DashboardLayout } from '../layouts/DashboardLayout';
import RecentLinksTable from '../features/dashboard/components/RecentLinksTable';
import { CreateLinkModal } from '../features/links/components/CreateLinkModal';
import { EditLinkModal } from '../features/links/components/EditLinkModal';
import { QRCodeModal } from '../features/links/components/QRCodeModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import type { Url } from '../api/url.api';

const LinksPage: React.FC = () => {
    const navigate = useNavigate();
    const { urls, isLoading, deleteLink, fetchUrls } = useLinks();

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
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleEdit = (url: Url) => {
        setSelectedLink(url);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        const link = urls.find((u: Url) => u.id === id);
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
    };

    const handleSuccessEdit = () => {
        setIsEditModalOpen(false);
        fetchUrls();
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                <div>
                    <h1 className="text-[20px] font-medium text-text-primary">My Links</h1>
                    <p className="text-[13px] text-text-secondary mt-1">Manage and track all your active shortened URLs.</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-6 md:mt-0 px-5 py-2.5 bg-accent text-white font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
                >
                    <span className="material-symbols-outlined !text-[16px]">add_link</span>
                    <span>Create Link</span>
                </button>
            </div>

            <div className="w-full">
                <RecentLinksTable
                    urls={urls}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onAnalytics={(alias) => navigate(`/analytics/${alias}`)}
                    onShowQR={(url: Url) => {
                        setSelectedLink(url);
                        setIsQRModalOpen(true);
                    }}
                />
            </div>

            {/* Modals */}
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

export default LinksPage;
