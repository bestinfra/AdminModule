/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html', 
        './src/**/*.{js,ts,jsx,tsx}',
        './src/**/*.css'
    ],
    // Ensure CSS is processed during build
    experimental: {
        optimizeUniversalDefaults: true
    }
};
