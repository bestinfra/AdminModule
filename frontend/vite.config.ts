import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import tailwindcss from '@tailwindcss/vite'
import path from 'path' // <-- Add this!

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'SuperAdmin',
      filename: 'remoteEntry.js',
      exposes: {
        './Sidebar': './src/components/global/Sidebar.tsx',
        './Header': './src/components/global/Header.tsx',
        './Page': './src/components/global/Page.tsx',
      },
      shared: ['react', 'react-dom', 'reactflow', 'react-router-dom', 'echarts-for-react'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // So you can use '@/file'
      '@components': path.resolve(__dirname, 'src/components'), // So you can use '@components/YourComponent'
    },
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
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
