import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { apiClient } from '../api/client';

interface BackendStatusContextType {
    isBackendWakingUp: boolean;
}

const BackendStatusContext = createContext<BackendStatusContextType | undefined>(undefined);

export const BackendStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [hasConnected, setHasConnected] = useState(false);
    const [isBackendWakingUp, setIsBackendWakingUp] = useState(false);
    const activeRequests = useRef(new Map<string, ReturnType<typeof setTimeout>>());

    useEffect(() => {
        // Request Interceptor
        const requestInterceptor = apiClient.interceptors.request.use((config: any) => {
            // Generate a unique ID for the request to track its timeout
            const requestId = Math.random().toString(36).substring(7);
            config.requestId = requestId;

            // Start a timer. If request takes longer than 1.5s, assume waking up.
            // Only show the notification if we haven't successfully connected yet.
            const timeoutId = setTimeout(() => {
                if (!hasConnected) {
                    setIsBackendWakingUp(true);
                }
            }, 1500);

            activeRequests.current.set(requestId, timeoutId);
            return config;
        });

        // Response Interceptor
        const responseInterceptor = apiClient.interceptors.response.use(
            (response: any) => {
                const requestId = response.config.requestId;
                clearTimeout(activeRequests.current.get(requestId));
                activeRequests.current.delete(requestId);

                // If no more active requests are pending (or just on any success), hide notification
                // For better UX during wake up, if one succeeds, we assume it's up.
                setIsBackendWakingUp(false);
                setHasConnected(true);
                return response;
            },
            (error) => {
                const requestId = error.config?.requestId;
                if (requestId) {
                    clearTimeout(activeRequests.current.get(requestId));
                    activeRequests.current.delete(requestId);
                }

                // Even on error, we stop showing "waking up" because we got a response (even if error)
                setIsBackendWakingUp(false);
                setHasConnected(true);
                return Promise.reject(error);
            }
        );

        return () => {
            apiClient.interceptors.request.eject(requestInterceptor);
            apiClient.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    return (
        <BackendStatusContext.Provider value={{ isBackendWakingUp }}>
            {children}
        </BackendStatusContext.Provider>
    );
};

export const useBackendStatus = () => {
    const context = useContext(BackendStatusContext);
    if (!context) {
        throw new Error('useBackendStatus must be used within a BackendStatusProvider');
    }
    return context;
};
