const fs = require("fs");

const OptimizedDeployer = require('./scripts/optimizedDeployer.js');
const deployer = new OptimizedDeployer();

const path = require("path");

// Function to copy pages directory recursively
function copyPagesDirectory(sourcePagesDir, destPagesDir) {
  // Ensure the destination directory exists
  if (!fs.existsSync(destPagesDir)) {
    fs.mkdirSync(destPagesDir, { recursive: true });
  }

  // Read all files and directories in the source
  const items = fs.readdirSync(sourcePagesDir);

  items.forEach((item) => { 
    const sourcePath = path.join(sourcePagesDir, item);
    const destPath = path.join(destPagesDir, item);

    if (fs.statSync(sourcePath).isDirectory()) {
      // If it's a directory, recursively copy it
      copyPagesDirectory(sourcePath, destPath);
    } else {
      // If it's a file, copy it
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

// Function to create app project in generated-apps folder
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

  // Create the project folder name - use appName instead of subdomain to avoid special characters
  const projectFolderName =
    appName
      ?.toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "my-admin-app";
  const baseDir = path.join(__dirname, "generated-apps", projectFolderName);

  // Helper to ensure directory exists
  function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Create base directory
  ensureDir(baseDir);

  // Set up frontend directory
  const frontendDir = path.join(baseDir, "frontend");
  ensureDir(frontendDir);

  // Copy pages directory
  const sourcePagesDir = path.join(__dirname, "frontend", "src", "pages");
  const destPagesDir = path.join(frontendDir, "src", "pages");
  if (fs.existsSync(sourcePagesDir)) {
    copyPagesDirectory(sourcePagesDir, destPagesDir);
  }

  // Helper to copy all icons and images
  function copyAllAssets() {
    // Copy all icons
    const sourceIconsDir = path.join(__dirname, "frontend", "public", "icons");
    const destIconsDir = path.join(frontendDir, "public", "icons");
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
      "frontend",
      "public",
      "images"
    );
    const destImagesDir = path.join(frontendDir, "public", "images");
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
    const sourceFontsDir = path.join(__dirname, "frontend", "public", "fonts");
    const destFontsDir = path.join(frontendDir, "public", "fonts");

    // Ensure Manrope font subdirectory exists in destination
    const sourceManropeDir = path.join(sourceFontsDir, "Manrope");
    const destManropeDir = path.join(destFontsDir, "Manrope");
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

  // Copy all assets (icons, images, fonts)
  copyAllAssets();

  // Create the React project structure
  const projectStructure = {
    "package.json": JSON.stringify(
      {
        name:
          appName
            ?.toLowerCase()
            .replace(/[^a-z0-9-]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "") || projectFolderName,
        version: "0.1.0",
        private: true,

        scripts: {
          dev: "vite",
          build: "tsc && vite build",
          preview: "vite preview",
          lint: "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
        },
        dependencies: {
          react: "^19.1.0",
          "react-dom": "^19.1.0",
          "react-router-dom": "^6.8.0",
          "js-cookie": "^3.0.5",
          "@types/react": "^18.0.28",
          "@types/react-dom": "^18.0.11",
          typescript: "^4.9.3",
          vite: "^4.1.0",
          "@vitejs/plugin-react": "^3.1.0",
          "@originjs/vite-plugin-federation": "^1.4.1",
          tailwindcss: "^3.2.7",
          postcss: "^8.4.21",
          autoprefixer: "^10.4.14",
        },
        devDependencies: {
          "@types/node": "^18.15.11",
          eslint: "^8.36.0",
          "@typescript-eslint/eslint-plugin": "^5.57.1",
          "@typescript-eslint/parser": "^5.57.1",
        },
      },
      null,
      2
    ),

    "tsconfig.json": JSON.stringify(
      {
        compilerOptions: {
          target: "ES2020",
          useDefineForClassFields: true,
          lib: ["ES2020", "DOM", "DOM.Iterable"],
          module: "ESNext",
          skipLibCheck: true,
          moduleResolution: "bundler",
          allowImportingTsExtensions: true,
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: "react-jsx",
          jsxImportSource: "react",
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          noFallthroughCasesInSwitch: true,
        },
        include: ["src"],
        references: [{ path: "./tsconfig.node.json" }],
      },
      null,
      2
    ),

    "tsconfig.node.json": JSON.stringify(
      {
        compilerOptions: {
          composite: true,
          skipLibCheck: true,
          module: "ESNext",
          moduleResolution: "bundler",
          allowSyntheticDefaultImports: true,
        },
        include: ["vite.config.ts"],
      },
      null,
      2
    ),

    "vite.config.ts": `import { defineConfig } from 'vite';
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

    "tailwind.config.js": `/** @type {import('tailwindcss').Config} */
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

    "postcss.config.js": `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};`,
  
  htmlTemplate: (appName) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${appName || "Admin App"}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
  
  mainTsx: () => `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
  
  indexCss: () => `@tailwind base;
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
}

/* Border utilities */
.border-r-primary-border {
  border-right-color: rgb(233, 239, 255);
}

.border-b-primary-border {
  border-bottom-color: rgb(233, 239, 255);
}

.dark .border-dark-border {
  border-color: rgba(9, 27, 59, 1);
}

/* Background utilities */
.bg-background-secondary {
  background-color: rgb(245, 248, 252);
}

.bg-primary-dark-light {
  background-color: rgba(6, 21, 45, 1);
}

.bg-primary-dark {
  background-color: rgba(4, 19, 40, 1);
}

.bg-primary {
  background-color: rgba(22, 59, 124, 1);
}

/* Text utilities */
.text-main {
  color: rgba(38, 38, 38, 1);
}

.text-primary {
  color: rgba(22, 59, 124, 1);
}

.text-secondary {
  color: rgba(85, 181, 108, 1);
}

.text-neutral-dark {
  color: rgba(60, 60, 60, 1);
}

/* Dark mode support */
.dark .text-white {
  color: white;
}

.dark .bg-primary-dark-light {
  background-color: rgba(6, 21, 45, 1);
}

.dark .bg-primary-dark {
  background-color: rgba(4, 19, 40, 1);
}

.dark .bg-brand-blue {
  background-color: rgba(22, 59, 124, 1);
}

/* Custom utilities */
.custom-shadow {
  box-shadow: 0px 5px 5px -2px rgb(220, 228, 239);
}

.custom-filter {
  filter: brightness(0) saturate(100%) invert(52%) sepia(60%) saturate(497%) hue-rotate(105deg) brightness(95%) contrast(90%);
}

.bg-stat-icon-gradient {
  background-image: linear-gradient(0deg, rgb(187 225 196), rgba(22, 59, 124, 0));
}`,
  
  subLogin: (appName) => `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  );
};

export default SubLogin;`,
  
  typeDefinitions: () => `declare module 'SuperAdmin/Sidebar' {
  const Sidebar: React.ComponentType<any>;
  export default Sidebar;
}

declare module 'SuperAdmin/Header' {
  const Header: React.ComponentType<any>;
  export default Header;
}`,
  
  backendPackage: (projectFolderName) => JSON.stringify({
    name: `${projectFolderName}-backend`, version: '1.0.0', main: 'server.js',
    scripts: { start: 'node server.js', dev: 'nodemon server.js' },
    dependencies: { express: '^4.18.2', dotenv: '^16.0.3', '@prisma/client': '^5.12.0' },
    devDependencies: { nodemon: '^2.0.22', prisma: '^5.12.0' }
  }, null, 2),
  
  backendServer: () => `require('dotenv').config();const express=require('express');const app=express();const PORT=process.env.PORT||4000;app.use(express.json());app.get('/api/health',(req,res)=>res.json({status:'ok'}));app.listen(PORT,()=>console.log('Backend running on port '+PORT));`,
  
  backendEnv: () => `NODE_ENV=development\nPORT=4000\nJWT_EXPIRES_IN=4h\nDATABASE_URL=postgresql://postgres:password@localhost:5432/your_db_name_here?schema=public`,
  
  prismaSchema: () => `generator client{provider="prisma-client-js"}datasource db{provider="postgresql"url=env("DATABASE_URL")}model User{id Int @id @default(autoincrement())email String @unique name String}`
};

// MENU GENERATION
const generateSidebarMenus = (selectedModules = []) => {
  const mandatoryMenus = [{ category: 'MAIN NAVIGATION', items: [
    { title: 'Dashboard', icon: '/icons/dashboard.svg', link: '/', hasSubmenu: false },
    { title: 'Consumers', icon: '/icons/user.svg', link: '/consumers', hasSubmenu: false },
    { title: 'User Management', icon: '/icons/user-gear.svg', link: '/users', hasSubmenu: false },
    { title: 'Role Management', icon: '/icons/roles.svg', link: '/role-management', hasSubmenu: false }
  ]}];
  
  const menuMap = {
    billing: { category: 'BILLING', items: [
      { title: 'Bills Postpaid', icon: '/icons/bills.svg', link: '/bills/postpaid', hasSubmenu: false },
      { title: 'Bills Prepaid', icon: '/icons/bills2.svg', link: '/bills/prepaid', hasSubmenu: false }
    ]},
    dtr_dashboard: { category: 'DTR MANAGEMENT', items: [
      { title: 'DTR Overview', icon: '/icons/dtr.svg', link: '/dtr-dashboard', hasSubmenu: false }
    ]},
    asset_management: { category: 'ASSET MANAGEMENT', items: [
      { title: 'Asset Management', icon: '/icons/workflow-setting-alt.svg', link: '/asset-management', hasSubmenu: false },
      { title: 'Connect/Disconnect', icon: '/icons/connect.svg', link: '/connect-disconnect', hasSubmenu: false }
    ]},
    meters: { category: 'METER MANAGEMENT', items: [
      { title: 'Meters List', icon: '/icons/meter.svg', link: '/meter-management/meters-list', hasSubmenu: false },
      { title: 'Add Meter', icon: '/icons/meter-bolt.svg', link: '/meter-management/meters-list/add', hasSubmenu: false },
      { title: 'Data Logger Master', icon: '/icons/database.svg', link: '/meter-management/data-logger-master', hasSubmenu: false },
      { title: 'Add Data Logger', icon: '/icons/server.svg', link: '/meter-management/data-logger-master/add', hasSubmenu: false }
    ]},
    tickets: { category: 'TICKETS & SUPPORT', items: [
      { title: 'All Tickets', icon: '/icons/support-tickets.svg', link: '/all-tickets', hasSubmenu: false }
    ]},
    reports: { category: 'REPORTS', items: [
      { title: 'Analytics', icon: '/icons/graph-bar.svg', link: '/reports/analytics', hasSubmenu: false },
      { title: 'Exports', icon: '/icons/export.svg', link: '/reports/exports', hasSubmenu: false }
    ]}
  };
  
  const optionalMenus = selectedModules.map(module => menuMap[module]).filter(Boolean);
  return [...mandatoryMenus, ...optionalMenus];
};

// CONTEXT FILES GENERATION
const generateContextFiles = (modules) => ({
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
};`,
  
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
        }
      }
    };

    loadCSSFromHost();
  }, [cssFiles, fallbackEnabled]);

  // This component doesn't render anything visual
  return null;
};

export default CSSLoader;`,

    "src/Theme.jsx": `import React, { useEffect } from 'react';
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
            colorGradientPrimary: 'linear-gradient(135deg, ${primaryColor || '#163b7c'}, ${primaryColor || '#163b7c'})',
            colorGradientSecondary: 'linear-gradient(135deg, ${secondaryColor || '#55b56c'}, ${secondaryColor || '#55b56c'})'
        });
    }, []);

    return <div>{children}</div>;
};`,

    "src/types/federation.d.ts": `
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

    "README.md": `# ${appName || "Admin App"}

This is a React application generated from the Admin Module configuration.

## App Details

- **App Name**: ${appName || "Not specified"}
- **Company**: ${companyName || "Not specified"}
- **Subdomain**: ${subdomain || "Not specified"}
- **Admin**: ${adminFirstName} ${adminLastName} (${adminEmail})
- **Role**: ${adminRole || "Administrator"}
- **Timezone**: ${timezone || "Not specified"}
- **Currency**: ${currency || "Not specified"}

## Modules

${modules?.map((module) => `- ${module}`).join("\n") || "No modules configured"}

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
    "package.json": JSON.stringify(
      {
        name: `${projectFolderName}-backend`,
        version: "1.0.0",
        main: "server.js",
        scripts: {
          start: "node server.js",
        },
        dependencies: {
          express: "^4.18.2",
          dotenv: "^16.0.3",
        },
      },
      null,
      2
    ),

    "server.js": `require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || ${dynamicPort};

app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Add your routes here

app.listen(PORT, () => console.log('Backend running on port ' + PORT));
`,

    "routes/index.js": `\nconst express = require('express');\nconst router = express.Router();\n\n// Define your routes here\n\nmodule.exports = router;\n`,
  };

  // Create backend directory
  const backendDir = path.join(baseDir, "backend");
  ensureDir(backendDir);
  ensureDir(path.join(backendDir, "routes"));

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
  fs.writeFileSync(path.join(backendDir, ".env"), envExampleContent);
  // --- BACKEND SCAFFOLDING END ---

  // --- PRISMA SUPPORT START ---
  // Update backend package.json for Prisma
  const backendPkgPath = path.join(backendDir, "package.json");
  if (fs.existsSync(backendPkgPath)) {
    const backendPkg = JSON.parse(fs.readFileSync(backendPkgPath, "utf8"));
    backendPkg.dependencies = backendPkg.dependencies || {};
    backendPkg.devDependencies = backendPkg.devDependencies || {};
    backendPkg.dependencies["@prisma/client"] = "^5.12.0";
    backendPkg.devDependencies["prisma"] = "^5.12.0";
    fs.writeFileSync(backendPkgPath, JSON.stringify(backendPkg, null, 2));
  }

  // Create prisma directory and schema.prisma
  const prismaDir = path.join(backendDir, "prisma");
  ensureDir(prismaDir);

  // Copy db_schema.txt as schema.prisma if it exists, otherwise use example schema
  const dbSchemaPath = path.join(
    __dirname,
    "..",
    "AdminModule",
    "db_schema.txt"
  );
  const targetSchemaPath = path.join(prismaDir, "schema.prisma");
  if (fs.existsSync(dbSchemaPath)) {
    fs.copyFileSync(dbSchemaPath, targetSchemaPath);
    console.log("Copied db_schema.txt to", targetSchemaPath);
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
    console.log("Wrote example schema.prisma to", targetSchemaPath);
  }

  // Add Prisma usage comment to server.js
  const serverPath = path.join(backendDir, "server.js");
  if (fs.existsSync(serverPath)) {
    let serverContent = fs.readFileSync(serverPath, "utf8");
    if (!serverContent.includes("PrismaClient")) {
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
    const deploymentResult = deployer.deployBackend(projectFolderName, backendDir);
    
    if (deploymentResult.success) {
      console.log('\n✅ Backend deployed successfully!');
      console.log(`   • Root URL: ${deploymentResult.rootUrl}`);
      console.log(`   • Health Check: ${deploymentResult.healthUrl}`);
      console.log(`   • Environment: ${deploymentResult.envUrl}`);
      console.log(`   • Port: ${deploymentResult.port}`);
      console.log(`   • Mode: DEVELOPMENT`);
    } else {
      console.log('\n⚠️  Backend deployment failed:', deploymentResult.error);
      console.log('   You can manually deploy using:');
      console.log(`   node scripts/optimizedDeployer.js deploy ${projectFolderName} ${backendDir}`);
    }
  } catch (error) {
    console.log('\n⚠️  Backend deployment failed:', error.message);
    console.log('   You can manually deploy using:');
    console.log(`   node scripts/optimizedDeployer.js deploy ${projectFolderName} ${backendDir}`);
  }
  // --- BACKEND DEPLOYMENT END ---


  return baseDir;
}
// Export the function
module.exports = { createAppProject };
// If running directly, use example data
if (require.main === module) {
  const exampleFormData = {
    appName: 'Example App', subdomain: 'example-app', companyName: 'Example Company',
    adminFirstName: 'Admin', adminLastName: 'User', adminEmail: 'admin@example.com',
    adminRole: 'Administrator', primaryColor: '#3B82F6', timezone: 'UTC', currency: 'USD',
    modules: ['dashboard', 'user_management_default', 'role_management']
  };
  createAppProject(exampleFormData);
}
