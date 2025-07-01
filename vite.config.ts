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
      name: 'ticketing',
      filename: 'remoteEntry.js',
      exposes: {
        './Ticket': './src/pages/ticket_module/Ticket.tsx',
        './ThemeProvider': './src/providers/ThemeProvider.tsx',
        './useTheme': './src/providers/ThemeProvider.tsx',
        './Page': './src/components/global/Page.tsx',
        './PageComponents': './src/components/global/PageComponents.tsx',
        './Profile': './src/pages/Profile.tsx',
        './AllTickets': './src/pages/AllTickets.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3001,
  },
})
