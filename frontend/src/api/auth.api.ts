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
    },

    deleteAccount: async (): Promise<void> => {
        try {
            await apiClient.delete('/users/me');
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    }
};

const handleApiError = (error: unknown) => {
    if (error instanceof AxiosError && error.response) {
        // Si el backend devuelve un mensaje en JSON
        if (error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
            throw new Error((error.response.data as any).message);
        }
        // Si devuelve un string (ej: HTML de 404 o texto plano)
        if (typeof error.response.data === 'string') {
            throw new Error(error.response.data);
        }
        // Fallback status text
        throw new Error(`Request failed with status ${error.response.status}`);
    }
    throw new Error('Network error - Is the backend running?');
};
