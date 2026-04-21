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
                // Base tokens using CSS variables (standard)
                bg: "var(--bg)",
                surface: "var(--surface)",
                "border": "var(--border)",
                "text-primary": "var(--text-primary)",
                "text-secondary": "var(--text-secondary)",
                "text-disabled": "var(--text-disabled)",
                accent: "var(--accent)",
                danger: "var(--danger)",
                
                // Dashboard Specific Tokens (Consolidated)
                "surface-hover": "#1a1a1a",
                "surface-container": "#141414",
                "border-primary": "#1e1e1e",
                "border-secondary": "#282828",
                "text-muted": "#4a4a4a",
                
                // Functional Variants
                "accent-soft": "rgba(94, 106, 210, 0.1)",
                "danger-soft": "rgba(229, 72, 77, 0.1)",
            },
            fontFamily: {
                display: ['Clash Display', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
                mono: ['Berkeley Mono', 'monospace'],
                headline: ['Inter', 'sans-serif'],
                label: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #ec5b13 0%, #ff7a33 100%)',
            },
            borderRadius: {
                "DEFAULT": "0.125rem",
                "md": "0.375rem",
                "lg": "0.25rem",
                "xl": "0.5rem",
                "full": "0.75rem"
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
