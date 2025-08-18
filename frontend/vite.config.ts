import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
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
        './context/AuthContext': './src/context/AuthContext.tsx',
        './components/auth/ProtectedRoute': './src/components/auth/ProtectedRoute.tsx',
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
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@components': path.resolve(__dirname, './src/components'), 
      '@pages': path.resolve(__dirname, './src/pages'),
      '@graphs': path.resolve(__dirname, './src/graphs'),
      '@context': path.resolve(__dirname, './src/context'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@providers': path.resolve(__dirname, './src/providers'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@types': path.resolve(__dirname, './src/types'),
      '@pages_v2': path.resolve(__dirname, './src/pages_v2'),
    },
  },
  preview: {
    port: 3000,
  },
})
