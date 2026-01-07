import { useState, useEffect, useCallback } from 'react';
import { analyticsApi } from '../api/analytics.api';

export const useLinkAnalytics = (alias: string | undefined, days: number = 7) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = useCallback(async () => {
        if (!alias) return;
        setLoading(true);
        setError(null);
        try {
            const result = await analyticsApi.getByAlias(alias, days);
            setData(result);
        } catch (err: any) {
            setError(err.message || 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    }, [alias, days]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    return { data, loading, error, refetch: fetchAnalytics };
};

export const useGeneralAnalytics = (days: number = 7) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await analyticsApi.getGeneral(days);
                setData(result);
            } catch (err: any) {
                setError(err.message || 'Failed to load general analytics');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [days]);

    return { data, loading, error };
};
