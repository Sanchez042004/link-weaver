import { apiClient } from './client';
import { AxiosError } from 'axios';

export const analyticsApi = {
    getByAlias: async (alias: string, days?: number): Promise<any> => {
        try {
            const queryParams = days !== undefined ? `?days=${days}` : '';
            const response = await apiClient.get<{ success: boolean; data: any }>(`/analytics/${alias}${queryParams}`);
            return response.data.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    getGeneral: async (days?: number): Promise<any> => {
        try {
            const queryParams = days !== undefined ? `?days=${days}` : '';
            const response = await apiClient.get<{ success: boolean; data: any }>(`/analytics${queryParams}`);
            return response.data.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    }
};

const handleApiError = (error: unknown) => {
    if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message || 'Failed to load analytics');
    }
    throw new Error('Network error');
};
