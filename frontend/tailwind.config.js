/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html', 
        './src/**/*.{js,ts,jsx,tsx}',
        './src/**/*.css'
    ],
    theme: {
        extend: {
            colors: {
                'primary-border': 'var(--color-primary-border)',
            }
        }
    },
    experimental: {
        optimizeUniversalDefaults: true
    }
};
