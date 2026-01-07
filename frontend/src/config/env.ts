export const env = {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    SHORT_URL_BASE: import.meta.env.VITE_SHORT_URL_BASE || 'localhost:3001',
    // Helpers
    getShortUrlDisplay: (alias: string) => {
        const base = (import.meta.env.VITE_SHORT_URL_BASE || 'localhost:3001')
            .replace(/^https?:\/\//, '')
            .replace(/\/$/, '');
        return `${base}/${alias}`;
    },
    getShortUrlBaseDisplay: () => {
        return (import.meta.env.VITE_SHORT_URL_BASE || 'localhost:3001')
            .replace(/^https?:\/\//, '')
            .replace(/\/$/, '');
    }
};
