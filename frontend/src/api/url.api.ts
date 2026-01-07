import { apiClient } from './client';
import { AxiosError } from 'axios';

export interface Url {
    id: string;
    longUrl: string;
    shortUrl: string;
    alias: string;
    customAlias?: string;
    userId?: string | null;
    createdAt: string;
    clicks: number;
    timeline?: Record<string, number>;
}

interface GetUrlsResponse {
    success: boolean;
    data: Url[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

interface ShortenResponse {
    success: boolean;
    data: Url;
}

export const urlApi = {
    getAll: async (page = 1, limit = 10): Promise<GetUrlsResponse> => {
        try {
            const response = await apiClient.get<GetUrlsResponse>(`/urls?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    create: async (longUrl: string, customAlias?: string): Promise<Url> => {
        try {
            const response = await apiClient.post<ShortenResponse>('/urls', { longUrl, customAlias });
            return response.data.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    update: async (id: string, data: { longUrl?: string; customAlias?: string }): Promise<Url> => {
        try {
            const response = await apiClient.patch<{ success: boolean; data: Url }>(`/urls/${id}`, data);
            return response.data.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(`/urls/${id}`);
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    }
};

const handleApiError = (error: unknown) => {
    if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message || error.response.data.error || 'Operation failed');
    }
    throw new Error('Network error');
};
