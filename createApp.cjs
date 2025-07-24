const fs = require('fs');

const OptimizedDeployer = require('./scripts/optimizedDeployer.js');
const deployer = new OptimizedDeployer();

const path = require('path');

function copyPagesDirectory(sourcePagesDir, destPagesDir) {
    if (!fs.existsSync(destPagesDir)) {
        fs.mkdirSync(destPagesDir, { recursive: true });
    }

    const items = fs.readdirSync(sourcePagesDir);

    items.forEach((item) => {
        const sourcePath = path.join(sourcePagesDir, item);
        const destPath = path.join(destPagesDir, item);

        if (fs.statSync(sourcePath).isDirectory()) {
            copyPagesDirectory(sourcePath, destPath);
        } else {
            fs.copyFileSync(sourcePath, destPath);
        }
    });
}

function createAppProject(formData) {
    const {
        appName,
        subdomain,
        categories,
        tariffPlans,
        adminFirstName,
        adminLastName,
        adminEmail,
        adminRole,
        companyName,
        companyWebsite,
        primaryColor,
        secondaryColor,
        textPrimaryColor,
        textSecondaryColor,
        backgroundColor,
        borderColor,
        shadowColor,
        iconColor,
        gradientColor,
        timezone,
        currency,
        modules,
    } = formData;

    const projectFolderName =
        appName
            ?.toLowerCase()
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '') || 'my-admin-app';
    const baseDir = path.join(__dirname, 'generated-apps', projectFolderName);

    function ensureDir(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    ensureDir(baseDir);

    const frontendDir = path.join(baseDir, 'frontend');
    ensureDir(frontendDir);

    const sourcePagesDir = path.join(__dirname, 'frontend', 'src', 'pages');
    const destPagesDir = path.join(frontendDir, 'src', 'pages');
    if (fs.existsSync(sourcePagesDir)) {
        copyPagesDirectory(sourcePagesDir, destPagesDir);
    }

    function copyAllAssets() {
        const sourceIconsDir = path.join(
            __dirname,
            'frontend',
            'public',
            'icons'
        );
        const destIconsDir = path.join(frontendDir, 'public', 'icons');
        ensureDir(destIconsDir);

        if (fs.existsSync(sourceIconsDir)) {
            const iconFiles = fs.readdirSync(sourceIconsDir);
            iconFiles.forEach((iconName) => {
                const sourcePath = path.join(sourceIconsDir, iconName);
                const destPath = path.join(destIconsDir, iconName);

                if (fs.statSync(sourcePath).isFile()) {
                    fs.copyFileSync(sourcePath, destPath);
                }
            });
        }

        // Copy all images
        const sourceImagesDir = path.join(
            __dirname,
            'frontend',
            'public',
            'images'
        );
        const destImagesDir = path.join(frontendDir, 'public', 'images');
        ensureDir(destImagesDir);

        if (fs.existsSync(sourceImagesDir)) {
            const imageFiles = fs.readdirSync(sourceImagesDir);
            imageFiles.forEach((imageName) => {
                const sourcePath = path.join(sourceImagesDir, imageName);
                const destPath = path.join(destImagesDir, imageName);

                if (fs.statSync(sourcePath).isFile()) {
                    fs.copyFileSync(sourcePath, destPath);
                }
            });
        }

        // Copy fonts directory
        const sourceFontsDir = path.join(
            __dirname,
            'frontend',
            'public',
            'fonts'
        );
        const destFontsDir = path.join(frontendDir, 'public', 'fonts');

        const sourceManropeDir = path.join(sourceFontsDir, 'Manrope');
        const destManropeDir = path.join(destFontsDir, 'Manrope');
        if (fs.existsSync(sourceManropeDir)) {
            ensureDir(destManropeDir);
            const manropeFiles = fs.readdirSync(sourceManropeDir);
            manropeFiles.forEach((fontName) => {
                const sourcePath = path.join(sourceManropeDir, fontName);
                const destPath = path.join(destManropeDir, fontName);
                if (fs.statSync(sourcePath).isFile()) {
                    fs.copyFileSync(sourcePath, destPath);
                }
            });
        }
    }

    copyAllAssets();

    const projectStructure = {
        'package.json': JSON.stringify(
            {
                name:
                    appName
                        ?.toLowerCase()
                        .replace(/[^a-z0-9-]/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '') || projectFolderName,
                version: '0.1.0',
                private: true,

                scripts: {
                    dev: 'vite',
                    build: 'tsc && vite build',
                    preview: 'vite preview',
                    lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
                },
                dependencies: {
                    react: '^19.1.0',
                    'react-dom': '^19.1.0',
                    'react-router-dom': '^6.8.0',
                    'js-cookie': '^3.0.5',
                    '@types/react': '^18.0.28',
                    '@types/react-dom': '^18.0.11',
                    typescript: '^4.9.3',
                    vite: '^4.1.0',
                    '@vitejs/plugin-react': '^3.1.0',
                    '@originjs/vite-plugin-federation': '^1.4.1',
                    tailwindcss: '^3.2.7',
                    postcss: '^8.4.21',
                    autoprefixer: '^10.4.14',
                },
                devDependencies: {
                    '@types/node': '^18.15.11',
                    eslint: '^8.36.0',
                    '@typescript-eslint/eslint-plugin': '^5.57.1',
                    '@typescript-eslint/parser': '^5.57.1',
                },
            },
            null,
            2
        ),

        'tsconfig.json': JSON.stringify(
            {
                compilerOptions: {
                    target: 'ES2020',
                    useDefineForClassFields: true,
                    lib: ['ES2020', 'DOM', 'DOM.Iterable'],
                    module: 'ESNext',
                    skipLibCheck: true,
                    moduleResolution: 'bundler',
                    allowImportingTsExtensions: true,
                    resolveJsonModule: true,
                    isolatedModules: true,
                    noEmit: true,
                    jsx: 'react-jsx',
                    jsxImportSource: 'react',
                    strict: true,
                    noUnusedLocals: true,
                    noUnusedParameters: true,
                    noFallthroughCasesInSwitch: true,
                },
                include: ['src'],
                references: [{ path: './tsconfig.node.json' }],
            },
            null,
            2
        ),

        'tsconfig.node.json': JSON.stringify(
            {
                compilerOptions: {
                    composite: true,
                    skipLibCheck: true,
                    module: 'ESNext',
                    moduleResolution: 'bundler',
                    allowSyntheticDefaultImports: true,
                },
                include: ['vite.config.ts'],
            },
            null,
            2
        ),

        'vite.config.ts': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: '${projectFolderName}',
      remotes: {
        SuperAdmin: 'http://localhost:3000/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router', 'react-router-dom'],
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 1700,
    fs: {
      allow: ['..'],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  publicDir: 'public',
});`,

        'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    },
  },
  plugins: [],
  darkMode: 'class'
}`,

        'postcss.config.js': `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

        'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${appName || 'Admin App'}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

        'src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,

        'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Manrope, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}`,

        'src/App.tsx': `
import React, { lazy, Suspense, ComponentType, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { FederatedContextProvider } from './components/FederatedWrapper';
import CSSLoader from './components/CSSLoader';
import './App.css';
import { Theme } from './Theme';


// Create safe lazy loading with error handling
const createSafeLazyComponent = (importFn: () => Promise<{ default: ComponentType<any> }>, fallback: ComponentType<any>) => {
  return lazy(async () => {
    try {
      const module = await importFn();
      return module;
    } catch (error) {
      console.warn('Failed to load remote component:', error);
      return { default: fallback };
    }
  });
};

// Fallback components
const DashboardFallback = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Dashboard</h1>
    <p className="text-gray-600">Loading dashboard...</p>
    <div className="mt-4 p-4 bg-blue-100 border border-blue-400 rounded">
      <h3 className="font-semibold text-blue-800">Debug Info:</h3>
      <p className="text-sm text-blue-700">This is the fallback component. The remote Dashboard component failed to load.</p>
      <p className="text-sm text-blue-700">Make sure SuperAdmin app is running on port 3000 and accessible.</p>
    </div>
  </div>
);

const SubLoginFallback = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Login</h1>
    <p className="text-gray-600">Loading login page...</p>
    <div className="mt-4 p-4 bg-blue-100 border border-blue-400 rounded">
      <h3 className="font-semibold text-blue-800">Debug Info:</h3>
      <p className="text-sm text-blue-700">This is the fallback component. The remote Login component failed to load.</p>
      <p className="text-sm text-blue-700">Make sure SuperAdmin app is running on port 3000 and accessible.</p>
    </div>
  </div>
);

const ConsumerFallback = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Consumers</h1>
    <p className="text-gray-600">Loading consumers...</p>
    <div className="mt-4 p-4 bg-blue-100 border border-blue-400 rounded">
      <h3 className="font-semibold text-blue-800">Debug Info:</h3>
      <p className="text-sm text-blue-700">This is the fallback component. The remote Consumers component failed to load.</p>
      <p className="text-sm text-blue-700">Make sure SuperAdmin app is running on port 3000 and accessible.</p>
    </div>
  </div>
);

const ConsumerViewFallback = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Consumer View</h1>
    <p className="text-gray-600">Loading consumer view...</p>
    <div className="mt-4 p-4 bg-blue-100 border border-blue-400 rounded">
      <h3 className="font-semibold text-blue-800">Debug Info:</h3>
      <p className="text-sm text-blue-700">This is the fallback component. The remote ConsumerView component failed to load.</p>
      <p className="text-sm text-blue-700">Make sure SuperAdmin app is running on port 3000 and accessible.</p>
    </div>
  </div>
);

const AllTicketsFallback = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">All Tickets</h1>
    <p className="text-gray-600">Loading all tickets...</p>
    <div className="mt-4 p-4 bg-blue-100 border border-blue-400 rounded">
      <h3 className="font-semibold text-blue-800">Debug Info:</h3>
      <p className="text-sm text-blue-700">This is the fallback component. The remote AllTickets component failed to load.</p>
      <p className="text-sm text-blue-700">Make sure SuperAdmin app is running on port 3000 and accessible.</p>
    </div>
  </div>
);

const SidebarFallback = () => (
  <div className="w-72 bg-gray-100 h-screen p-4">
    <div className="text-center">Sidebar Loading...</div>
  </div>
);

const HeaderFallback = () => (
  <div className="h-16 bg-gray-100 border-b flex items-center px-6">
    <span>Header Loading...</span>
  </div>
);

// Safe lazy components with fallbacks - using federated components from SuperAdmin
const Dashboard = createSafeLazyComponent(
  () => import('SuperAdmin/Dashboard'),
  DashboardFallback
);

import { ThemeProvider } from 'SuperAdmin/providers/ThemeProvider';

const SubLogin = createSafeLazyComponent(
  () => import('SuperAdmin/Login'),
  SubLoginFallback
);

const Consumers = createSafeLazyComponent(
  () => import('SuperAdmin/Consumers'),
  ConsumerFallback
);

const ConsumerView = createSafeLazyComponent(
  () => import('SuperAdmin/ConsumerView'),
  ConsumerViewFallback
);

const Users = createSafeLazyComponent(
  () => import('SuperAdmin/Users'),
  () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Users</h1>
      <p className="text-gray-600">Loading users...</p>
      <div className="mt-4 p-4 bg-blue-100 border border-blue-400 rounded">
        <h3 className="font-semibold text-blue-800">Debug Info:</h3>
        <p className="text-sm text-blue-700">This is the fallback component. The remote Users component failed to load.</p>
        <p className="text-sm text-blue-700">Make sure SuperAdmin app is running on port 3000 and accessible.</p>
      </div>
    </div>
  )
);

const RoleManagement = createSafeLazyComponent(
  () => import('SuperAdmin/RoleManagement'),
  () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Role Management</h1>
      <p className="text-gray-600">Loading role management...</p>
      <div className="mt-4 p-4 bg-blue-100 border border-blue-400 rounded">
        <h3 className="font-semibold text-blue-800">Debug Info:</h3>
        <p className="text-sm text-blue-700">This is the fallback component. The remote RoleManagement component failed to load.</p>
        <p className="text-sm text-blue-700">Make sure SuperAdmin app is running on port 3000 and accessible.</p>
      </div>
    </div>
  )
);

const BillsPrepaid = createSafeLazyComponent(
  () => import('SuperAdmin/BillsPrepaid'),
  () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Bills Prepaid</h1>
      <p className="text-gray-600">Loading bills prepaid...</p>
      <div className="mt-4 p-4 bg-blue-100 border border-blue-400 rounded">
        <h3 className="font-semibold text-blue-800">Debug Info:</h3>
        <p className="text-sm text-blue-700">This is the fallback component. The remote BillsPrepaid component failed to load.</p>
        <p className="text-sm text-blue-700">Make sure SuperAdmin app is running on port 3000 and accessible.</p>
      </div>
    </div>
  )
);

const BillsPostpaid = createSafeLazyComponent(
  () => import('SuperAdmin/BillsPostpaid'),
  () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Bills Postpaid</h1>
      <p className="text-gray-600">Loading bills postpaid...</p>
      <div className="mt-4 p-4 bg-blue-100 border border-blue-400 rounded">
        <h3 className="font-semibold text-blue-800">Debug Info:</h3>
        <p className="text-sm text-blue-700">This is the fallback component. The remote BillsPostpaid component failed to load.</p>
        <p className="text-sm text-blue-700">Make sure SuperAdmin app is running on port 3000 and accessible.</p>
      </div>
    </div>
  )
);

const AllTickets = createSafeLazyComponent(
  () => import('SuperAdmin/Ticket'),
  AllTicketsFallback
);

const Transformer = createSafeLazyComponent(
  () => import('SuperAdmin/Transformer'),
  () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold">DTR Dashboard</h1>
      <p className="text-gray-600">Loading DTR dashboard...</p>
    </div>
  )
);

const Assets = createSafeLazyComponent(
  () => import('SuperAdmin/Assets'),
  () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Asset Management</h1>
      <p className="text-gray-600">Loading asset management...</p>
    </div>
  )
);

const Meters = createSafeLazyComponent(
  () => import('SuperAdmin/Meters'),
  () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Meters List</h1>
      <p className="text-gray-600">Loading meters list...</p>
    </div>
  )
);

const DataLoggerMaster = createSafeLazyComponent(
  () => import('SuperAdmin/DataLoggerMaster'),
  () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Data Logger Master</h1>
      <p className="text-gray-600">Loading data logger master...</p>
    </div>
  )
);

// Use federated Sidebar and Header from SuperAdmin app
const Sidebar = createSafeLazyComponent(
  () => import('SuperAdmin/Sidebar'),
  SidebarFallback
);

const Header = createSafeLazyComponent(
  () => import('SuperAdmin/Header'),
  HeaderFallback
);

function RequireAuth({ children }) {
  const isLoggedIn = !!localStorage.getItem('token');
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function AppContent() {
  const contextValue = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Function to get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
      case '/dashboard':
        return 'Dashboard';
      case '/consumers':
        return 'Consumers';
      case '/users':
        return 'Users';
      case '/role-management':
        return 'Role Management';
      case '/bills/prepaid':
        return 'Prepaid Bills';
      case '/bills/postpaid':
        return 'Postpaid Bills';
      case '/all-tickets':
        return 'All Tickets';
      case '/dtr-dashboard':
        return 'DTR Dashboard';
      case '/asset-management':
        return 'Asset Management';
      case '/meters':
        return 'Meters';
      case '/data-logger-master':
        return 'Data Logger Master';
      default:
        return 'Dashboard';
    }
  };
  
  // Debug logging for routing
  useEffect(() => {
    
  }, [location.pathname]);
  
  // Check if remote app is accessible
  useEffect(() => {
    const checkRemoteApp = async () => {
      try {
        const response = await fetch('http://localhost:3000/assets/remoteEntry.js');
        if (!response.ok) {
          console.error('Remote app not accessible. Make sure SuperAdmin is running on port 3000');
        } else {
  
        }
      } catch (error) {
        console.error('Failed to check remote app:', error);
      }
    };
    
    checkRemoteApp();
  }, []);
  
// Generate menu items for federated components
 const menuItems = [
    {
      title: 'Dashboard',
      icon: '/icons/dashboard.svg',
      link: '/dashboard',
    },
    {
      title: 'Consumers',
      icon: '/icons/units.svg',
      link: '/consumers',
    },
    {
      title: 'Transformers',
      icon: '/icons/transformer.svg',
      link: '/dtr-dashboard',
    },
    {
      title: 'Bills',
      icon: '/icons/bills.svg',
      hasSubmenu: true,
      submenu: [
        {
          title: 'Prepaid',
          link: '/bills/prepaid',
        },
        {
          title: 'Postpaid',
          link: '/bills/postpaid',
        },
      ],
    },
    {
      title: 'Tickets',
      icon: '/icons/customer-service.svg',
      link: '/all-tickets',
    },
  ];

  const menuItems2 = [

    {
      title: 'Assets',
      icon: '/icons/workflow-setting-alt.svg',
      link: '/asset-management',
    },
    {
      title: 'Meters',
      icon: '/icons/meter-bolt.svg',
      link: '/meters',
      hasSubmenu: true,
      submenu: [
        {
          title: 'Data Logger Master',
          link: '/data-logger-master',
        },
        {
          title: 'Meter List',
          link: '/meters',
        },
      ],
    },
    {
      title: 'Users',
      icon: '/icons/user.svg',
      link: '/users',
      hasSubmenu: true,
      submenu: [
        {
          title: 'Users',
          icon: '/icons/user-gear.svg',
          link: '/users',
        },
        {
          title: 'Role Management',
          icon: '/icons/roles.svg',
          link: '/role-management',
        },
      ],
    },
  ];

  return (
   
    <FederatedContextProvider value={contextValue}>
      <Routes>
        <Route path="/login" element={<SubLogin />} />
        <Route
          path="*"
          element={
            <RequireAuth>
              <div className="flex h-screen bg-white">
                {/* Sidebar and Header only for authenticated users */}
                <Suspense fallback={<SidebarFallback />}>
                  <Sidebar 
                    currentPath={location.pathname}
                    onNavigate={(path:any) => navigate(path)}
                    menus={[
                      {
                        category: 'General',
                        items: menuItems,
                      },
                      {
                        category: 'Admin Settings',
                        items: menuItems2,
                      },
                    ]}
                    logo={{
                      src: '/images/bi-blue-logo.svg',
                      alt: '${appName || 'Admin App'}',
                      collapsedSrc: '/images/changed-logo.svg',
                    }}
                    footer={{
                      copyright: '© 2024 ${companyName || 'Company'}',
                      showThemeToggle: true,
                      showShareButton: false,
                    }}
                  />
                </Suspense>
                <div className="flex flex-col flex-1">
                  <Suspense fallback={<HeaderFallback />}>
                    <Header title={getPageTitle()} />
                  </Suspense>
                  <main className="flex-1 p-6 bg-white overflow-auto dark:bg-primary-dark">
                    {/* All protected routes here */}
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/consumers" element={<Consumers />} />
                      <Route path="/consumers/:uid" element={<ConsumerView />} />
                      <Route path="/bills/prepaid" element={<BillsPrepaid />} />
                      <Route path="/bills/postpaid" element={<BillsPostpaid />} />
                      <Route path="/dtr-dashboard" element={<Transformer />} />
                      <Route path="/dtr/:dtrId" element={<DTRDetailPage />} />
                      <Route path="/asset-management" element={<Assets />} />
                      <Route path="/meters" element={<Meters />} />
                      <Route path="/data-logger-master" element={<DataLoggerMaster />} />
                      <Route path="/all-tickets" element={<AllTickets />} />
                      <Route path="*" element={
                        <div className="p-6">
                          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
                          <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h3 className="font-semibold text-red-800 mb-2">404 Error</h3>
                            <p className="text-sm text-red-700">Please check the URL or navigate using the sidebar.</p>
                            <div className="mt-4">
                              <h4 className="font-semibold text-red-800 mb-2">Available Routes:</h4>
                              <ul className="text-sm text-red-700 space-y-1">
                                <li>/ - Dashboard</li>
                                <li>/dashboard - Dashboard</li>
                                <li>/consumers - Consumers</li>
                                <li>/consumers/:uid - Consumer View</li>
                                <li>/bills/prepaid - Bills Prepaid</li>
                                <li>/bills/postpaid - Bills Postpaid</li>
                                <li>/dtr-dashboard - DTR Dashboard</li>
                                <li>/dtr/:dtrId - DTR Details</li>
                                <li>/asset-management - Asset Management</li>
                                <li>/meters - Meters List</li>
                                <li>/data-logger-master - Data Logger Master</li>
                                <li>/all-tickets - All Tickets</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      } />
                    </Routes>
                  </main>
                </div>
              </div>
            </RequireAuth>
          }
        />
      </Routes>
    </FederatedContextProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
    <Theme>
    <Router>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading application...</div>}>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </Suspense>
    </Router>
    </Theme>
    </ThemeProvider>
  );
}

export default App;`,

        'src/App.css': `#root {
  width: 100%;
  margin: 0 auto;
}`,

        'src/context/AppContext.tsx': `import React, { createContext, useContext, useEffect, useState } from 'react';

interface AppContextType {
    isDarkMode: boolean;
    isSidebarCollapsed: boolean;
    toggleTheme: () => void;
    toggleSidebar: () => void;
}

const AppContext = createContext<AppContextType>({
    isDarkMode: false,
    isSidebarCollapsed: false,
    toggleTheme: () => {},
    toggleSidebar: () => {},
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)'
        ).matches;
        return savedTheme === 'dark' || (!savedTheme && prefersDark);
    });

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        const savedState = localStorage.getItem('sidebarCollapsed');
        return savedState ? JSON.parse(savedState) : false;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    useEffect(() => {
        localStorage.setItem(
            'sidebarCollapsed',
            JSON.stringify(isSidebarCollapsed)
        );
    }, [isSidebarCollapsed]);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    const toggleSidebar = () => {
        setIsSidebarCollapsed((prev: boolean) => !prev);
    };

    return (
        <AppContext.Provider
            value={{
                isDarkMode,
                isSidebarCollapsed,
                toggleTheme,
                toggleSidebar,
            }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};`,

        'src/components/Input.tsx': `import React, { useRef, useEffect } from 'react';

interface SearchInputProps {
    onSearch?: (query: string) => void;
    placeholder?: string;
    className?: string;
    showShortcut?: boolean;
}

const Input = ({
    onSearch,
    placeholder = 'Search...',
    className = '',
    showShortcut = true,
}: SearchInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className={\`relative \${className}\`}>
            <input
                ref={inputRef}
                type="search"
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-[2.5rem] border border-primary-border px-2 py-1 text-main text-sm font-light bg-white dark:bg-primary-dark rounded dark:border-dark-border dark:bg-dark-secondary dark:text-white focus:outline-none placeholder:text-primary-dark dark:placeholder:text-main"
                aria-label="Search"
                onChange={(e) => onSearch?.(e.target.value)}
            />
            {showShortcut && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm text-white ">
                    <kbd className="px-2  text-primary-dark-light text-sm font-light bg-primary-lightest dark:bg-primary-dark-light rounded dark:text-subinfo">
                        Ctrl
                    </kbd>
                    <span className="text-primary-dark  dark:bg-primary-dark dark:text-subinfo">+</span>
                    <kbd className="px-2  text-primary-dark text-sm font-light bg-primary-lightest dark:bg-primary-dark-light rounded dark:text-subinfo">
                        K
                    </kbd>
                </div>
            )}
            <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-lightest dark:bg-primary-dark rounded-full w-8 h-8 flex items-center justify-center">
                <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </span>
        </div>
    );
};

export default Input;`,

        'src/components/Sidebar.tsx': `import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

interface MenuItem {
  title: string;
  icon: string;
  link?: string;
  hasSubmenu?: boolean;
  submenu?: Array<{
    title: string;
    link: string;
    count?: number;
  }>;
  count?: number;
}

interface MenuCategory {
  category: string;
  items: MenuItem[];
}

const Sidebar = () => {
  const { isDarkMode, isSidebarCollapsed, toggleTheme } = useApp();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const location = useLocation();

  const toggleSubmenu = (menuTitle: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuTitle]: !prev[menuTitle],
    }));
  };

  const menuItems: MenuCategory[] = [
    {
      category: 'MANAGEMENT',
      items: [
        {
          title: 'Dashboard',
          icon: '📊',
          link: '/',
        },
        {
          title: 'Consumers',
          icon: '👥',
          link: '/consumers',
        },
        ${
            modules
                ?.map(
                    (module) => `{
          title: '${module.charAt(0).toUpperCase() + module.slice(1)}',
          icon: '📋',
          link: '/${module}',
        }`
                )
                .join(',\n        ') || ''
        }
      ],
    },
    {
      category: 'SETTINGS',
      items: [
        {
          title: 'Logout',
          icon: '🚪',
          link: '/logout',
        },
      ],
    },
  ];

  return (
    <div className={\`transition-[width] duration-300 ease-in-out \${isSidebarCollapsed ? 'w-20' : 'w-72'}\`}>
      <nav
        className={\`h-screen flex flex-col justify-between items-center w-full bg-primary-lightest dark:bg-primary-dark-light border-r border-r-primary-border relative dark:border-dark-border transition-[width] duration-300 ease-in-out \${isSidebarCollapsed ? 'w-20' : 'w-72'}\`}
        aria-label="Main navigation">
        <div className="flex flex-col w-full h-fit overflow-hidden overflow-y-auto scrollbar-hide">
          <header
            className={\`sticky top-0 z-10 dark:bg-primary-dark h-24 flex justify-center border-b border-b-primary-border dark:border-dark-border items-center \${isSidebarCollapsed ? 'bg-primary px-4' : 'bg-white px-16'} py-8\`}>
            <div className={\`\${isSidebarCollapsed ? 'w-8' : 'w-full'}\`}>
              <h1 className={\`font-bold text-gray-800 dark:text-white \${isSidebarCollapsed ? 'text-center' : 'text-left'}\`}>
                {isSidebarCollapsed ? '${appName?.charAt(0) || 'A'}' : '${
            appName || 'Admin App'
        }'}
              </h1>
              {!isSidebarCollapsed && (
                <p className="text-sm text-gray-600 dark:text-gray-400">${
                    companyName || 'Company Name'
                }</p>
              )}
            </div>
          </header>
          
          <main className="flex-1 w-full">
            {menuItems.map((category, categoryIndex) => (
              <section
                key={categoryIndex}
                className="flex flex-col w-full"
                aria-label={category.category}>
                {!isSidebarCollapsed && (
                  <h2 className="px-4 py-2 text-sm font-semibold uppercase text-neutral-dark dark:text-white">
                    {category.category}
                  </h2>
                )}
                <ul className="list-none p-0 m-0">
                  {category.items.map((menuItem, itemIndex) => (
                    <li key={itemIndex}>
                      {menuItem.hasSubmenu ? (
                        <div className="relative">
                          <button
                            className={\`w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 \${location.pathname.startsWith(menuItem.link || '') ? 'bg-blue-50 dark:bg-blue-900 border-r-2 border-blue-500' : ''}\`}
                            onClick={() => toggleSubmenu(menuItem.title)}
                            aria-expanded={expandedMenus[menuItem.title]}
                            aria-controls={\`submenu-\${menuItem.title}\`}>
                            <span className="mr-3 text-lg">{menuItem.icon}</span>
                            {!isSidebarCollapsed && (
                              <div className="flex items-center justify-between w-full gap-2">
                                <span>{menuItem.title}</span>
                                <span className={\`transition-transform \${expandedMenus[menuItem.title] ? 'rotate-180' : ''}\`}>
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </span>
                              </div>
                            )}
                          </button>
                          {!isSidebarCollapsed && (
                            <ul
                              id={\`submenu-\${menuItem.title}\`}
                              className={\`relative flex flex-col overflow-hidden transition-all duration-300 ease-in-out pl-0 \${expandedMenus[menuItem.title] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}\`}>
                              <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-600"></span>
                              {menuItem.submenu?.map((subItem, subIndex) => (
                                <li key={subIndex}>
                                  <Link
                                    to={subItem.link}
                                    className={\`block px-4 py-2 pl-8 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 \${location.pathname === subItem.link ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : ''}\`}>
                                    <div className="flex items-center justify-between w-full gap-2">
                                      <span>{subItem.title}</span>
                                      {subItem.count && (
                                        <span className={\`w-7 h-7 rounded-full text-xs text-white font-bold flex justify-center items-center \${location.pathname === subItem.link ? 'bg-primary dark:bg-secondary' : 'bg-primary dark:bg-secondary'}\`}>
                                          {subItem.count}
                                        </span>
                                      )}
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={menuItem.link || '#'}
                          className={\`flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 \${location.pathname === menuItem.link ? 'bg-blue-50 dark:bg-blue-900 border-r-2 border-blue-500' : ''}\`}>
                          <span className="mr-3 text-lg">{menuItem.icon}</span>
                          {!isSidebarCollapsed && (
                            <div className="flex items-center justify-between w-full gap-2 font-semibold">
                              <span>{menuItem.title}</span>
                              {menuItem.count && (
                                <span className={\`w-7 h-7 rounded-full text-xs text-white font-bold flex justify-center items-center \${location.pathname === menuItem.link ? 'bg-primary dark:bg-secondary' : 'bg-primary dark:bg-secondary'}\`}>
                                  {menuItem.count}
                                </span>
                              )}
                            </div>
                          )}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </main>
        </div>
        
        <footer className="flex flex-col w-full justify-between gap-5 h-fit p-4 dark:bg-primary-dark-light">
          {!isSidebarCollapsed ? (
            <>
              <div className="flex items-center justify-between w-full">
                <p className="text-xs text-light dark:text-subinfo">
                  © 2024 ${companyName || 'Company'}
                </p>
                <button
                  className="w-10 h-10 border border-primary-border dark:border-dark-border rounded-full flex justify-center items-center cursor-pointer"
                  aria-label="Toggle dark mode"
                  onClick={toggleTheme}>
                  <span className="text-lg">
                    {isDarkMode ? '☀️' : '🌙'}
                  </span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 gap-4 w-full">
              <button
                className="w-10 h-10 border border-light-border dark:border-dark-border rounded-full flex justify-center items-center cursor-pointer"
                aria-label="Toggle dark mode"
                onClick={toggleTheme}>
                <span className="text-lg">
                  {isDarkMode ? '☀️' : '🌙'}
                </span>
              </button>
            </div>
          )}
        </footer>
      </nav>
    </div>
  );
};

export default Sidebar;`,

        'src/components/Header.tsx': `import Input from './Input';
import { useApp } from '../context/AppContext';
import { useLocation } from 'react-router-dom';

interface HeaderAction {
  icon: string;
  alt: string;
  onClick: () => void;
  ariaLabel: string;
  className?: string;
}

interface HeaderProps {
  title?: string;
  onSidebarToggle?: () => void;
  onSearch?: (query: string) => void;
  actions?: HeaderAction[];
  secondaryLogo?: string;
}

const Header = ({
  title,
  onSidebarToggle,
  onSearch,
  actions = [],
  secondaryLogo,
}: HeaderProps) => {
  const { isSidebarCollapsed, toggleSidebar } = useApp();
  const location = useLocation();

  // Function to get page title based on current route
  const getPageTitle = () => {
    if (title) return title;
    
    switch (location.pathname) {
      case '/':
      case '/dashboard':
        return 'Dashboard';
      case '/consumers':
        return 'Consumers';
      case '/user-management':
        return 'User Management';
      case '/role-management':
        return 'Role Management';
      ${
          modules
              ?.filter(
                  (module) =>
                      ![
                          'dashboard',
                          'consumers',
                          'user_management_default',
                          'role_management',
                      ].includes(module)
              )
              .map(
                  (module) => `case '/${module}':
        return '${
            module.charAt(0).toUpperCase() + module.slice(1).replace(/_/g, ' ')
        } Module';`
              )
              .join('\n      ') || ''
      }
      default:
        return 'Dashboard';
    }
  };

  const defaultActions: HeaderAction[] = [
    {
      icon: '🔔',
      alt: 'Notifications icon',
      onClick: () => {},
      ariaLabel: 'Notifications',
    },
    {
      icon: '⛶',
      alt: 'Full screen icon',
      onClick: () => {},
      ariaLabel: 'Toggle full screen',
    },
  ];

  const allActions = [...defaultActions, ...actions];

  return (
    <header className="border-b border-b-primary-border dark:border-dark-border dark:bg-primary-dark flex items-center justify-between px-6 py-4 h-24">
      <nav className="flex items-center gap-4">
        <button
          className="p-2 bg-primary-lightest dark:bg-dark-secondary w-8 h-8 rounded-full flex items-center justify-center hover:text-white"
          onClick={onSidebarToggle || toggleSidebar}
          aria-label="Toggle sidebar">
          <svg
            className={\`h-6 w-6 \${isSidebarCollapsed ? 'rotate-180' : ''}\`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-base dark:text-white">{getPageTitle()}</h1>
      </nav>

      <section
        className="flex-1 max-w-2xl mx-8"
        aria-label="Search section">
        <Input onSearch={onSearch} />
      </section>

      <nav className="flex items-center gap-2">
        {allActions.map((action, index) => (
          <button
            key={index}
            className={\`p-2 w-8 h-8 bg-primary-lightest dark:bg-dark-secondary rounded-full flex items-center justify-center \${action.className || ''}\`}
            onClick={action.onClick}
            aria-label={action.ariaLabel}>
            <span className="text-lg">{action.icon}</span>
          </button>
        ))}
        <div className="p-2 flex items-center justify-center">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
            ${adminFirstName?.charAt(0) || 'A'}${
            adminLastName?.charAt(0) || 'U'
        }
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;`,

        'src/components/SidebarWrapper.tsx': `import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarWrapperProps {
  SidebarComponent: React.ComponentType<any>;
}

const SidebarWrapper = ({ SidebarComponent }: SidebarWrapperProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleNavigate = (path: string) => {
    
    navigate(path);
  };
  
  // Define mandatory menu items for host apps
  const mandatoryMenus = [
    {
      category: 'MANAGEMENT',
      items: [
        // {
        //   title: 'Dashboard',
        //   icon: '/icons/dashboard.svg',
        //   link: '/',
        // },
        // {
        //   title: 'Consumers',
        //   icon: '/icons/user.svg',
        //   link: '/consumers',
        // },
        // {
        //   title: 'User Management',
        //   icon: '/icons/user-gear.svg',
        //   link: '/user-management',
        // },
        // {
        //   title: 'Role Management',
        //   icon: '/icons/roles.svg',
        //   link: '/role-management',
        // },
        // ${
            modules
                ?.filter(
                    (module) =>
                        ![
                            'dashboard',
                            'consumers',
                            'user_management_default',
                            'role_management',
                        ].includes(module)
                )
                .map(
                    (module) => `{
        //   title: '${
            module.charAt(0).toUpperCase() + module.slice(1).replace(/_/g, ' ')
        }',
        //   icon: '/icons/apps-icon.svg',
        //   link: '/${module}',
        // }`
                )
                .join(',\n        ') || ''
        }
        {
          title: 'Consumer View',
          icon: '/icons/user-profile.svg',
          link: '/consumerview',
        },
        {
          title: 'All Tickets',
          icon: '/icons/support-tickets.svg',
          link: '/ticket',
        },
      ],
    },
  ];
  
  // Pass the location.pathname, navigation function, and mandatory menus to the federated Sidebar component
  return (
    <SidebarComponent 
      currentPath={location.pathname} 
      onNavigate={handleNavigate}
      menus={mandatoryMenus}
    />
  );
};

export default SidebarWrapper; `,

        'src/components/FederatedWrapper.tsx': `import React, { createContext, useContext } from 'react';

// Context that matches the SuperAdmin's AppContext interface
interface FederatedAppContextType {
    isDarkMode: boolean;
    isSidebarCollapsed: boolean;
    toggleTheme: () => void;
    toggleSidebar: () => void;
}

const FederatedAppContext = createContext<FederatedAppContextType>({
    isDarkMode: false,
    isSidebarCollapsed: false,
    toggleTheme: () => {},
    toggleSidebar: () => {},
});

// Make the context available globally for federated components
(window as any).__FEDERATED_APP_CONTEXT__ = FederatedAppContext;

export const FederatedContextProvider = ({ 
    children, 
    value 
}: { 
    children: React.ReactNode;
    value: FederatedAppContextType;
}) => {
    return (
        <FederatedAppContext.Provider value={value}>
            {children}
        </FederatedAppContext.Provider>
    );
};

export const useFederatedApp = () => {
    const context = useContext(FederatedAppContext);
    if (context === undefined) {
        throw new Error('useFederatedApp must be used within a FederatedContextProvider');
    }
    return context;
}; `,

        'src/components/CSSLoader.tsx': `import React, { useEffect, useState } from 'react';

interface CSSLoaderProps {
  cssFiles?: string[];
  fallbackEnabled?: boolean;
}

const CSSLoader: React.FC<CSSLoaderProps> = ({ 
  cssFiles = ['global.css', 'default.css', 'custom.css'], 
  fallbackEnabled = true 
}) => {
  const [loadedCSS, setLoadedCSS] = useState<string[]>([]);
  const [failedCSS, setFailedCSS] = useState<string[]>([]);

  useEffect(() => {
    const loadCSSFromHost = async () => {
      for (const cssFile of cssFiles) {
        try {
          // Try to load CSS from the host app via federation
          const response = await fetch(\`http://localhost:3000/assets/\${cssFile}\`);
          
          if (response.ok) {
            const cssContent = await response.text();
            
            // Create a style element and add the CSS
            const styleElement = document.createElement('style');
            styleElement.id = \`federated-\${cssFile}\`;
            styleElement.textContent = cssContent;
            
            // Remove any existing style with the same ID
            const existingStyle = document.getElementById(\`federated-\${cssFile}\`);
            if (existingStyle) {
              existingStyle.remove();
            }
            
            document.head.appendChild(styleElement);
            setLoadedCSS(prev => [...prev, cssFile]);
            
    
          } else {
            throw new Error(\`Failed to load \${cssFile}: \${response.status}\`);
          }
        } catch (error) {
          console.warn(\`Failed to load federated CSS \${cssFile}:\`, error);
          setFailedCSS(prev => [...prev, cssFile]);
          
          // If fallback is enabled, continue using local CSS
          if (fallbackEnabled) {

          }
        }
      }
    };

    loadCSSFromHost();
  }, [cssFiles, fallbackEnabled]);

  // This component doesn't render anything visual
  return null;
};

export default CSSLoader;`,

        'src/Theme.jsx': `import React, { useEffect } from 'react';
import { useTheme } from 'SuperAdmin/providers/ThemeProvider';

export const Theme = ({ children }) => {
    const { theme, updateTheme } = useTheme();
    useEffect(() => {
        updateTheme({
            colorPrimary: '${primaryColor || '#163b7c'}',
            colorSecondary: '${secondaryColor || '#55b56c'}',
            colorTextPrimary: '${textPrimaryColor || '#262626'}',
            colorTextSecondary: '${textSecondaryColor || '#7e7e7e'}',
            colorBackgroundSecondary: '${backgroundColor || '#f5f8fc'}',
            colorBorder: '${borderColor || '#e9efff'}',
            colorShadowPrimary: '${shadowColor || '#dce4ef'}',
            colorSubinfo: '${iconColor || '#476189'}',
            colorPrimaryBorder: '${borderColor || '#e9efff'}',
            colorCustomPrimary: '${primaryColor || '#163b7c'}',
            colorCustomSecondary: '${secondaryColor || '#55b56c'}',
            colorPrimaryDark: '${primaryColor || '#163b7c'}',
            colorPrimaryLight: '${primaryColor || '#163b7c'}',
            colorPrimaryBg: '${backgroundColor || '#f5f8fc'}',
            colorPrimaryDeep: '${primaryColor || '#163b7c'}',
            colorPrimaryBgLight: '${backgroundColor || '#f5f8fc'}',
            colorPrimaryLightest: '${backgroundColor || '#f5f8fc'}',
            colorSecondaryLight: '${secondaryColor || '#55b56c'}',
            colorSurface: '${backgroundColor || '#f5f8fc'}',
            colorGradientPrimary: 'linear-gradient(135deg, ${
                primaryColor || '#163b7c'
            }, ${primaryColor || '#163b7c'})',
            colorGradientSecondary: 'linear-gradient(135deg, ${
                secondaryColor || '#55b56c'
            }, ${secondaryColor || '#55b56c'})'
        });
    }, []);

    return <div>{children}</div>;
};`,

        'src/types/federation.d.ts': `
declare module 'SuperAdmin/Dashboard' {
  const Dashboard: React.ComponentType<any>;
  export default Dashboard;
}

declare module 'SuperAdmin/Consumers' {
  const Consumers: React.ComponentType<any>;
  export default Consumers;
}

declare module 'SuperAdmin/Sidebar' {
  const Sidebar: React.ComponentType<any>;
  export default Sidebar;
}

declare module 'SuperAdmin/Header' {
  const Header: React.ComponentType<any>;
  export default Header;
}

declare module 'SuperAdmin/Ticket' {
  const Ticket: React.ComponentType<any>;
  export default Ticket;
}

declare module 'SuperAdmin/ConsumerView' {
  const ConsumerView: React.ComponentType<any>;
  export default ConsumerView;
}

declare module 'SuperAdmin/BillsPrepaid' {
  const BillsPrepaid: React.ComponentType<any>;
  export default BillsPrepaid;
}

declare module 'SuperAdmin/BillsPostpaid' { 
  const BillsPostpaid: React.ComponentType<any>;
  export default BillsPostpaid;
}

declare module 'SuperAdmin/Transformer' {
  const Transformer: React.ComponentType<any>;
  export default Transformer;
}

declare module 'SuperAdmin/Assets' {
  const Assets: React.ComponentType<any>;
  export default Assets;
}

declare module 'SuperAdmin/Meters' {
  const Meters: React.ComponentType<any>;
  export default Meters;
}
declare module 'SuperAdmin/DataLoggerMaster' {
  const DataLoggerMaster: React.ComponentType<any>;
  export default DataLoggerMaster;
}

declare module 'SuperAdmin/Users' {
  const Users: React.ComponentType<any>;
  export default Users;
}

declare module 'SuperAdmin/RoleManagement' {
  const RoleManagement: React.ComponentType<any>;
  export default RoleManagement;
}

declare module 'SuperAdmin/TicketView' {
  const TicketView: React.ComponentType<any>;
  export default TicketView;
}

declare module 'SuperAdmin/Page' {
  const Page: React.ComponentType<any>;
  export default Page;
}

declare module 'SuperAdmin/Table' {
  const Table: React.ComponentType<any>;
  export default Table;
}

declare module 'SuperAdmin/Dropdown' {
  const Dropdown: React.ComponentType<any>;
  export default Dropdown;
}

declare module 'SuperAdmin/Card' {
  const Card: React.ComponentType<any>;
  export default Card;
}

declare module 'SuperAdmin/PieChart' {
  const PieChart: React.ComponentType<any>;
  export default PieChart;
}

declare module 'SuperAdmin/BarChart' {
  const BarChart: React.ComponentType<any>;
  export default BarChart;
}

declare module 'SuperAdmin/TimeRangeSelector' {
  const TimeRangeSelector: React.ComponentType<any>;
  export default TimeRangeSelector;
}

declare module 'SuperAdmin/PageHeader' {
  const PageHeader: React.ComponentType<any>;
  export default PageHeader;
}

declare module 'SuperAdmin/OrgChart' {
  const OrgChart: React.ComponentType<any>;
  export default OrgChart;
}

declare module 'SuperAdmin/context/AppContext' {
  export const useApp: () => any;
  export const AppProvider: React.ComponentType<any>;
}

declare module 'SuperAdmin/AppProvider' {
  const AppProvider: React.ComponentType<any>;
  export default AppProvider;
}

declare module 'SuperAdmin/useApp' {
  export const useApp: () => any;
}
`,

        'README.md': `# ${appName || 'Admin App'}

This is a React application generated from the Admin Module configuration.

## App Details

- **App Name**: ${appName || 'Not specified'}
- **Company**: ${companyName || 'Not specified'}
- **Subdomain**: ${subdomain || 'Not specified'}
- **Admin**: ${adminFirstName} ${adminLastName} (${adminEmail})
- **Role**: ${adminRole || 'Administrator'}
- **Timezone**: ${timezone || 'Not specified'}
- **Currency**: ${currency || 'Not specified'}

## Modules

${modules?.map((module) => `- ${module}`).join('\n') || 'No modules configured'}

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run lint\` - Run ESLint

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router

## Project Structure

\`\`\`
src/
├── components/     # Reusable components
├── pages/         # Page components
├── context/       # React context
├── App.tsx        # Main app component
├── main.tsx       # App entry point
└── index.css      # Global styles
\`\`\`

## Features

- **Dark Mode Support**: Toggle between light and dark themes
- **Collapsible Sidebar**: Expandable/collapsible navigation sidebar
- **Responsive Design**: Works on desktop and mobile devices
- **Search Functionality**: Global search with keyboard shortcuts (Ctrl+K)
- **Module-based Navigation**: Dynamic navigation based on enabled modules

Generated on: ${new Date().toLocaleDateString()}
`,
    };

    // --- BACKEND SCAFFOLDING START ---
    // Get dynamic port for this backend
    const dynamicPort = deployer.findAvailablePort();

    // Backend template files
    const backendFiles = {
        'package.json': JSON.stringify(
            {
                name: `${projectFolderName}-backend`,
                version: '1.0.0',
                main: 'server.js',
                scripts: {
                    start: 'node server.js',
                },
                dependencies: {
                    express: '^4.18.2',
                    dotenv: '^16.0.3',
                },
            },
            null,
            2
        ),

        'server.js': `require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || ${dynamicPort};

app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Add your routes here

app.listen(PORT, () => console.log('Backend running on port ' + PORT));
`,

        'routes/index.js': `\nconst express = require('express');\nconst router = express.Router();\n\n// Define your routes here\n\nmodule.exports = router;\n`,
    };

    // Create backend directory
    const backendDir = path.join(baseDir, 'backend');
    ensureDir(backendDir);
    ensureDir(path.join(backendDir, 'routes'));

    // Write backend files
    Object.entries(backendFiles).forEach(([filePath, content]) => {
        const fullPath = path.join(backendDir, filePath);
        ensureDir(path.dirname(fullPath));
        fs.writeFileSync(fullPath, content.trimStart());
    });

    // Add .env example file for backend
    const envExampleContent = `# Example environment file for backend
NODE_ENV=development
PORT=${dynamicPort}

JWT_EXPIRES_IN=4h

DATABASE_URL=postgresql://postgres:password@localhost:5432/your_db_name_here?schema=public
`;
    fs.writeFileSync(path.join(backendDir, '.env'), envExampleContent);
    // --- BACKEND SCAFFOLDING END ---

    // --- PRISMA SUPPORT START ---
    // Update backend package.json for Prisma
    const backendPkgPath = path.join(backendDir, 'package.json');
    if (fs.existsSync(backendPkgPath)) {
        const backendPkg = JSON.parse(fs.readFileSync(backendPkgPath, 'utf8'));
        backendPkg.dependencies = backendPkg.dependencies || {};
        backendPkg.devDependencies = backendPkg.devDependencies || {};
        backendPkg.dependencies['@prisma/client'] = '^5.12.0';
        backendPkg.devDependencies['prisma'] = '^5.12.0';
        fs.writeFileSync(backendPkgPath, JSON.stringify(backendPkg, null, 2));
    }

    // Create prisma directory and schema.prisma
    const prismaDir = path.join(backendDir, 'prisma');
    ensureDir(prismaDir);

    // Copy db_schema.txt as schema.prisma if it exists, otherwise use example schema
    const dbSchemaPath = path.join(
        __dirname,
        '..',
        'AdminModule',
        'db_schema.txt'
    );
    const targetSchemaPath = path.join(prismaDir, 'schema.prisma');
    if (fs.existsSync(dbSchemaPath)) {
        fs.copyFileSync(dbSchemaPath, targetSchemaPath);
        console.log('Copied db_schema.txt to', targetSchemaPath);
    } else {
        const schemaContent = `// Example Prisma schema
// Replace this with your actual schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Example model
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}
`;
        fs.writeFileSync(targetSchemaPath, schemaContent);
        console.log('Wrote example schema.prisma to', targetSchemaPath);
    }

    // Add Prisma usage comment to server.js
    const serverPath = path.join(backendDir, 'server.js');
    if (fs.existsSync(serverPath)) {
        let serverContent = fs.readFileSync(serverPath, 'utf8');
        if (!serverContent.includes('PrismaClient')) {
            serverContent =
                `// To use Prisma:
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

` + serverContent;
            fs.writeFileSync(serverPath, serverContent);
        }
    }
    // --- PRISMA SUPPORT END ---

    // Create directories and write files
    Object.entries(projectStructure).forEach(([filePath, content]) => {
        const fullPath = path.join(frontendDir, filePath);
        const dir = path.dirname(fullPath);

        // Ensure directory exists
        ensureDir(dir);

        // Write file
        fs.writeFileSync(fullPath, content);
    });

    console.log(
        `Project "${projectFolderName}" created successfully at: ${baseDir}`
    );
    console.log(`Next steps:`);
    console.log(`   1. cd ${baseDir}`);
    console.log(`   2. npm install`);
    console.log(`   3. npm run dev`);

    // --- BACKEND DEPLOYMENT START ---
    // Deploy backend to XAMPP using optimized deployer
    try {
        console.log('\n🚀 Deploying backend to XAMPP...');
        const deploymentResult = deployer.deployBackend(
            projectFolderName,
            backendDir
        );

        if (deploymentResult.success) {
            console.log('\n✅ Backend deployed successfully!');
            console.log(`   • Root URL: ${deploymentResult.rootUrl}`);
            console.log(`   • Health Check: ${deploymentResult.healthUrl}`);
            console.log(`   • Environment: ${deploymentResult.envUrl}`);
            console.log(`   • Port: ${deploymentResult.port}`);
            console.log(`   • Mode: DEVELOPMENT`);
        } else {
            console.log(
                '\n⚠️  Backend deployment failed:',
                deploymentResult.error
            );
            console.log('   You can manually deploy using:');
            console.log(
                `   node scripts/optimizedDeployer.js deploy ${projectFolderName} ${backendDir}`
            );
        }
    } catch (error) {
        console.log('\n⚠️  Backend deployment failed:', error.message);
        console.log('   You can manually deploy using:');
        console.log(
            `   node scripts/optimizedDeployer.js deploy ${projectFolderName} ${backendDir}`
        );
    }
    // --- BACKEND DEPLOYMENT END ---

    return baseDir;
}
// Export the function
module.exports = { createAppProject };
// If running directly, use example data
if (require.main === module) {
    const exampleFormData = {
        appName: 'Example App',
        subdomain: 'example-app',
        companyName: 'Example Company',
        adminFirstName: 'Admin',
        adminLastName: 'User',
        adminEmail: 'admin@example.com',
        adminRole: 'Administrator',
        primaryColor: '#3B82F6',
        secondaryColor: '#10B981',
        textPrimaryColor: '#262626',
        textSecondaryColor: '#7e7e7e',
        backgroundColor: '#f5f8fc',
        borderColor: '#e9efff',
        shadowColor: '#dce4ef',
        iconColor: '#476189',
        gradientColor: '#163b7c',
        timezone: 'UTC',
        currency: 'USD',
        modules: ['dashboard', 'user_management_default', 'role_management'],
    };

    createAppProject(exampleFormData);
}
