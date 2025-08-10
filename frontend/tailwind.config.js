/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Manrope', 'sans-serif'],
                manrope: ['Manrope', 'sans-serif'],
            },
        },
    },
    experimental: {
        optimizeUniversalDefaults: true,
    },
};
