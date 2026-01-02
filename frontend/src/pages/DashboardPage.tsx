import React, { useState } from 'react';
import { useLinks } from '../hooks/useLinks';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { DashboardStats } from '../features/dashboard/components/DashboardStats';
import { LinksTable } from '../features/links/components/LinksTable';
import { CreateLinkModal } from '../features/links/components/CreateLinkModal';
import { EditLinkModal } from '../features/links/components/EditLinkModal';
import { DeleteLinkModal } from '../features/links/components/DeleteLinkModal';
import { QRCodeModal } from '../features/links/components/QRCodeModal';
import type { Url } from '../api/url.api';
import { useNavigate } from 'react-router-dom';
// ... imports


const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { urls, isLoading, deleteLink, fetchUrls } = useLinks();

    console.log('DashboardPage render:', { user, urls, isLoading });

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);

    const [selectedLink, setSelectedLink] = useState<Url | null>(null);
    const [linkToDelete, setLinkToDelete] = useState<Url | null>(null);

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
            await deleteLink(linkToDelete.id);
            setLinkToDelete(null);
            setIsDeleteModalOpen(false);
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
            <div className="w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">Dashboard</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-base font-normal max-w-lg">
                            Welcome back, {user?.name || 'User'}! Here's your link performance overview.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="group flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white shadow-lg shadow-primary/25 transition-all w-full md:w-auto"
                    >
                        <span className="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform">add</span>
                        <span className="text-sm font-bold tracking-wide">Create New Link</span>
                    </button>
                </header>

                <DashboardStats urls={urls} isLoading={isLoading} />

                <section className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Links</h3>
                    </div>
                    <LinksTable
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
                </section>

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

                <DeleteLinkModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    alias={linkToDelete?.alias || ''}
                />
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;
