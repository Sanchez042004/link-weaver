import { apiClient } from './client';
import { AxiosError } from 'axios';

export interface User {
    id: string;
    email: string;
    name: string;
}

export interface LoginResponse {
    success: boolean;
    data: {
        token: string;
        user: User;
    };
}

export const authApi = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        try {
            const response = await apiClient.post<LoginResponse>('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    register: async (name: string, email: string, password: string): Promise<LoginResponse> => {
        try {
            const response = await apiClient.post<LoginResponse>('/auth/register', { name, email, password });
            return response.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    }
};

const handleApiError = (error: unknown) => {
    if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message || 'Authentication failed');
    }
    throw new Error('Network error');
};
