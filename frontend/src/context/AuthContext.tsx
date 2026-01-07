import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, type User } from '../api/auth.api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    deleteAccount: () => Promise<void>;
    verifyEmail: (token: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (password: string, token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authApi.login(email, password);
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setToken(token);
        setUser(user);
    };

    const register = async (name: string, email: string, password: string) => {
        await authApi.register(name, email, password);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        navigate('/', { replace: true });
    };

    const deleteAccount = async () => {
        await authApi.deleteAccount();
        logout();
    };

    const verifyEmail = async (token: string) => {
        await authApi.verifyEmail(token);
    };

    const forgotPassword = async (email: string) => {
        await authApi.forgotPassword(email);
    };

    const resetPassword = async (password: string, token: string) => {
        await authApi.resetPassword(password, token);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!token,
            token,
            isLoading,
            login,
            register,
            logout,
            deleteAccount,
            verifyEmail,
            forgotPassword,
            resetPassword
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
