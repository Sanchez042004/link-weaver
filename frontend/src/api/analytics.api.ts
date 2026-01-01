import { apiClient } from './client';
import { AxiosError } from 'axios';

export const analyticsApi = {
    getByAlias: async (alias: string): Promise<any> => {
        try {
            const response = await apiClient.get<{ success: boolean; data: any }>(`/analytics/${alias}`);
            return response.data.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    getGeneral: async (): Promise<any> => {
        try {
            const response = await apiClient.get<{ success: boolean; data: any }>(`/analytics`);
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
