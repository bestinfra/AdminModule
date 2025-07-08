import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'SuperAdmin',
      filename: 'remoteEntry.js',
      exposes: {
        './Dashboard': './src/pages/Dashboard.tsx',
        './Sidebar': './src/components/global/Sidebar.tsx',
        './Header': './src/components/global/Header.tsx',
        './context/AppContext': './src/context/AppContext.tsx',
        './AppProvider': './src/context/AppProvider.tsx',
        './useApp': './src/context/AppContext.tsx',
        './Ticket': './src/pages/AllTickets.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // Ensure CSS is properly bundled
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'global.css') {
            return 'assets/global.css';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  css: {
    // Ensure CSS is processed during build
    postcss: {
      plugins: [
        // Tailwind CSS v4 handles this automatically
      ],
    },
  },
  server: {
    port: 5173,
    fs: {
      allow: ['..'],
    },
    proxy: {
      '/api': {
        target: 'https://arcticterntech.in:8443',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/attSmart')
      }
    }
  },
  preview: {
    port: 3000,
  },
})
