import { useState, useEffect, useRef } from 'react';

export const useMinLoadingTime = (isLoading: boolean, minDuration: number = 500) => {
    const [showLoading, setShowLoading] = useState(isLoading);
    const startTime = useRef<number | null>(null);

    useEffect(() => {
        if (isLoading) {
            setShowLoading(true);
            startTime.current = Date.now();
        } else {
            // If we never started loading (or component just mounted with false), just show false
            if (!startTime.current) {
                setShowLoading(false);
                return;
            }

            const elapsed = Date.now() - startTime.current;
            if (elapsed < minDuration) {
                const remaining = minDuration - elapsed;
                const timeout = setTimeout(() => {
                    setShowLoading(false);
                    startTime.current = null;
                }, remaining);
                return () => clearTimeout(timeout);
            } else {
                setShowLoading(false);
                startTime.current = null;
            }
        }
    }, [isLoading, minDuration]);

    return showLoading;
};
