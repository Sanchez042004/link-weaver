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
                "primary": "#ec5b13",
                "background-light": "#f8f6f6",
                "background-dark": "#221610",
                "surface-dark": "#2e201a",
                "surface-light": "#ffffff",
                "border-dark": "#4a2d1f", // Rich dark orange/brown for borders
            },
            fontFamily: {
                "display": ["Space Grotesk", "sans-serif"],
                "body": ["Noto Sans", "sans-serif"],
                "sans": ["Space Grotesk", "sans-serif"],
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "1rem",
                "xl": "1.5rem",
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
