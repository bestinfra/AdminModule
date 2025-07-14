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
        './Consumers': './src/pages/Consumers.tsx',
        './Sidebar': './src/components/global/Sidebar.tsx',
        './Header': './src/components/global/Header.tsx',
        './context/AppContext': './src/context/AppContext.tsx',
        './AppProvider': './src/context/AppProvider.tsx',
        './useApp': './src/context/AppContext.tsx',
        './Ticket': './src/pages/AllTickets.tsx',
        './TicketView': './src/pages/TicketView.tsx',
        './PageComponents': './src/components/global/PageComponents.tsx',
        './Page': './src/components/global/Page.tsx',
        './Table': './src/components/global/Table.tsx',
        './Dropdown': './src/components/global/Dropdown.tsx',
        './ConsumerView': './src/pages/ConsumerView.tsx',
        './Card': './src/components/global/Card.tsx',
        './PieChart': './src/graphs/PieChart.tsx',
        './BarChart': './src/graphs/BarChart.tsx', 
        './BillsPostpaid': './src/pages/BillsPostpaid.tsx',
        './BillsPrepaid': './src/pages/BillsPrepaid.tsx',
        './TimeRangeSelector': './src/components/global/TimeRangeSelector.tsx',
        './Transformer': './src/pages/DTRDashboard.tsx',
        './Assets': './src/pages/AssetManagement.tsx',
        './OrgChart': './src/components/global/OrgChart.tsx',
        './PageHeader': './src/components/global/PageHeader.tsx',
        './Meters': './src/pages/MetersList.tsx',
        './DataLoggerMaster': './src/pages/DataLoggerMaster.tsx',
        './Users': './src/pages/UserManagment.tsx',
        './RoleManagement': './src/pages/RoleManagment.tsx',
        // CSS Files exposed for federation
        './styles/global.css': './src/styles/global.css',
        './styles/default.css': './src/styles/default.css',
        './styles/custom.css': './src/styles/custom.css',
      },
      shared: ['react', 'react-dom', 'reactflow', 'react-router-dom', 'echarts-for-react'],
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
