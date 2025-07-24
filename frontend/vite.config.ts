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
        './Login': './src/pages/SubLogin.tsx',
        './Dashboard': './src/pages_v2/Dashboard.tsx',
        './NewDashboard': './src/pages/NewDashboard.tsx',
        './Consumers': './src/pages_v2/Consumers.tsx',
        './Ticket': './src/pages_v2/Tickets.tsx',
        './Users': './src/pages_v2/Users.tsx',
        './DataLogger': './src/pages_v2/DataLogger.tsx',
        './Meters': './src/pages_v2/Meters.tsx',
        './Transformer': './src/pages_v2/DTRDashboard.tsx',
        './DTRDashboard': './src/pages_v2/DTRDashboard.tsx',
        './Feeders': './src/pages_v2/Feeders.tsx',
        // Components and context exports remain unchanged
        './Sidebar': './src/components/global/Sidebar.tsx',
        './Header': './src/components/global/Header.tsx',
        './context/AppContext': './src/context/AppContext.tsx',
        './AppProvider': './src/context/AppProvider.tsx',
        './useApp': './src/context/AppContext.tsx',
        './PageComponents': './src/components/global/PageComponents.tsx',
        './Page': './src/components/global/Page.tsx',
        './Table': './src/components/global/Table.tsx',
        './Dropdown': './src/components/global/Dropdown.tsx',
        './Card': './src/components/global/Card.tsx',
        './PieChart': './src/graphs/PieChart.tsx',
        './BarChart': './src/graphs/BarChart.tsx',
        './TimeRangeSelector': './src/components/global/TimeRangeSelector.tsx',
        './Assets': './src/pages_v2/AssetManagment.tsx',
        './RoleManagement': './src/pages_v2/RoleManagement.tsx',
        './OrgChart': './src/components/global/OrgChart.tsx',
        './PageHeader': './src/components/global/PageHeader.tsx',
        './providers/ThemeProvider': './src/providers/ThemeProvider.tsx',
      },
      shared: ['react', 'react-dom', 'reactflow', 'react-router-dom', 'echarts-for-react'],
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
