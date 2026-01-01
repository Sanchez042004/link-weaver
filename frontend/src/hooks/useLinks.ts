import { useState, useCallback, useEffect } from 'react';
import { urlApi, type Url } from '../api/url.api';

export const useLinks = () => {
    const [urls, setUrls] = useState<Url[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUrls = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await urlApi.getAll(1, 100); // Fetch all for now, or implement strict pagination logic
            setUrls(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch URLs');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createLink = async (longUrl: string, customAlias?: string) => {
        setIsLoading(true);
        try {
            await urlApi.create(longUrl, customAlias);
            await fetchUrls(); // Refresh list
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteLink = async (id: string) => {
        try {
            await urlApi.delete(id);
            // Optimistic update
            setUrls(prev => prev.filter(u => u.id !== id));
        } catch (err: any) {
            setError(err.message);
            // Re-fetch if failed or optimistic update was wrong (though harder to revert without previous state)
            fetchUrls();
            throw err;
        }
    };

    const updateLink = async (id: string, data: { longUrl?: string; customAlias?: string }) => {
        try {
            const updated = await urlApi.update(id, data);
            setUrls(prev => prev.map(u => u.id === id ? { ...u, ...updated } : u));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    // Auto-fetch on mount
    useEffect(() => {
        fetchUrls();
    }, [fetchUrls]);

    return {
        urls,
        isLoading,
        error,
        fetchUrls,
        createLink,
        deleteLink,
        updateLink
    };
};
