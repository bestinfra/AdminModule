import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

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
        './Page': './src/components/global/PageC.tsx',
        './providers/ThemeProvider': './src/providers/ThemeProvider.tsx',
        './Login': './src/pages_v2/SubLogin.tsx',
      },
      shared : [
        'react', 
        'react-dom',
        'reactflow',
        'react-router-dom',
        'echarts-for-react',
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@components': path.resolve(__dirname, './src/components'), 
      '@pages': path.resolve(__dirname, './src/pages'),
      '@graphs': path.resolve(__dirname, './src/graphs'),
      '@context': path.resolve(__dirname, './src/context'),
      '@providers': path.resolve(__dirname, './src/providers'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@types': path.resolve(__dirname, './src/types'),
      
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
    strictPort: true, // Force the port to be 5173
    fs: {
      allow: ['..'],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:4038',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  preview: {
    port: 3000,
  },
})
