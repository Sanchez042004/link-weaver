import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#2b6cee",
                "background-light": "#f6f6f8",
                "background-dark": "#101622",
                "surface-dark": "#1e293b",
                "surface-light": "#ffffff",
            },
            fontFamily: {
                "display": ["DM Sans", "sans-serif"],
                "sans": ["DM Sans", "sans-serif"],
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "0.75rem",
                "xl": "1rem",
                "full": "9999px"
            },
            keyframes: {
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '25%': { transform: 'translateX(-4px)' },
                    '75%': { transform: 'translateX(4px)' },
                }
            },
            animation: {
                shake: 'shake 0.2s ease-in-out 0s 2',
            }
        },
    },
    plugins: [
        forms,
        containerQueries,
    ],
}
