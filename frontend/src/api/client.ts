import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para leer token actualizado
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor para manejo global de errores (ej: 401 Logout)
apiClient.interceptors.response.use((response) => response, (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login');

    if (axios.isAxiosError(error) && error.response?.status === 401 && !isLoginRequest) {
        // Auto-logout si el token expira o es inválido, pero no en el login mismo
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
