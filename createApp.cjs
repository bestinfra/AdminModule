const fs = require("fs");
const path = require("path");

// CONFIGURATION
const DEFAULT_CONFIG = { port: 1700, primaryColor: '#163b7c', timezone: 'UTC', currency: 'USD', adminRole: 'Administrator' };

// UTILITY FUNCTIONS
const ensureDir = dir => !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });
const copyDirectory = (source, destination) => {
  if (!fs.existsSync(source)) return;
  ensureDir(destination);
  fs.readdirSync(source).forEach(file => {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    fs.statSync(sourcePath).isDirectory() ? copyDirectory(sourcePath, destPath) : fs.copyFileSync(sourcePath, destPath);
  });
};
const generateSafeFolderName = appName => appName?.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'my-admin-app';

// TEMPLATE CONFIGURATIONS
const TEMPLATES = {
  packageJson: (appName, projectFolderName) => JSON.stringify({
    name: projectFolderName, version: '0.1.0', private: true,
    scripts: { dev: 'vite', build: 'tsc && vite build', preview: 'vite preview', lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0' },
    dependencies: {
      react: '^19.1.0', 'react-dom': '^19.1.0', 'react-router-dom': '^6.8.0', 'js-cookie': '^3.0.5',
      '@types/react': '^18.0.28', '@types/react-dom': '^18.0.11', typescript: '^4.9.3', vite: '^4.1.0',
      '@vitejs/plugin-react': '^3.1.0', '@originjs/vite-plugin-federation': '^1.4.1', tailwindcss: '^3.2.7',
      postcss: '^8.4.21', autoprefixer: '^10.4.14'
    },
    devDependencies: { '@types/node': '^18.15.11', eslint: '^8.36.0', '@typescript-eslint/eslint-plugin': '^5.57.1', '@typescript-eslint/parser': '^5.57.1' }
  }, null, 2),
  
  tsConfig: () => JSON.stringify({
    compilerOptions: {
      target: 'ES2020', useDefineForClassFields: true, lib: ['ES2020', 'DOM', 'DOM.Iterable'], module: 'ESNext',
      skipLibCheck: true, moduleResolution: 'bundler', allowImportingTsExtensions: true, resolveJsonModule: true,
      isolatedModules: true, noEmit: true, jsx: 'react-jsx', jsxImportSource: 'react', strict: true,
      noUnusedLocals: true, noUnusedParameters: true, noFallthroughCasesInSwitch: true, baseUrl: '.',
      paths: { '@/*': ['src/*'], '@components/*': ['src/components/*'] }
    }, include: ['src'], references: [{ path: './tsconfig.node.json' }]
  }, null, 2),
  
  viteConfig: (projectFolderName) => `import { defineConfig } from 'vite';import react from '@vitejs/plugin-react';import federation from '@originjs/vite-plugin-federation';import path from 'path';export default defineConfig({plugins:[react(),federation({name:'${projectFolderName}',remotes:{SuperAdmin:'http://localhost:3000/assets/remoteEntry.js'},shared:['react','react-dom','react-router','react-router-dom']})],resolve:{alias:{'@':path.resolve(__dirname,'src'),'@components':path.resolve(__dirname,'src/components')}},build:{modulePreload:false,target:'esnext',minify:false,cssCodeSplit:false},server:{port:1700,fs:{allow:['..']}},publicDir:'public'});`,
  
  tailwindConfig: () => `/** @type {import('tailwindcss').Config} */export default {content:['./index.html','./src/**/*.{js,ts,jsx,tsx}','./src/**/*.css'],theme:{extend:{fontFamily:{sans:['Manrope','sans-serif'],manrope:['Manrope','sans-serif']}}},experimental:{optimizeUniversalDefaults:true}};`,
  
  postCssConfig: () => `module.exports = {
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

export default CSSLoader;`
});

// MAIN APP CREATION FUNCTION
const createAppProject = (formData) => {
  const { appName, modules } = formData;
  const projectFolderName = generateSafeFolderName(appName);
  const baseDir = path.join(__dirname, 'generated-apps', projectFolderName);
  
  console.log(`Creating project: ${projectFolderName}`);
  ensureDir(baseDir);
  
  // FRONTEND SETUP
  const frontendDir = path.join(baseDir, 'frontend');
  ensureDir(frontendDir);
  ['src/pages', 'src/components', 'src/context', 'src/types', 'src/styles', 'public/icons', 'public/images', 'public/fonts/Manrope'].forEach(dir => ensureDir(path.join(frontendDir, dir)));
  
  // Copy assets
  const sourceAssets = path.join(__dirname, 'frontend', 'public');
  copyDirectory(sourceAssets, path.join(frontendDir, 'public'));
  
  // Copy CSS files
  ['global.css', 'default.css', 'custom.css'].forEach(cssFile => {
    const sourcePath = path.join(__dirname, 'frontend', 'src', 'styles', cssFile);
    const destPath = path.join(frontendDir, 'src', 'styles', cssFile);
    fs.existsSync(sourcePath) && fs.copyFileSync(sourcePath, destPath);
  });
  
  // Generate frontend files
  const frontendFiles = {
    'package.json': TEMPLATES.packageJson(appName, projectFolderName),
    'tsconfig.json': TEMPLATES.tsConfig(),
    'tsconfig.node.json': JSON.stringify({ compilerOptions: { composite: true, skipLibCheck: true, module: 'ESNext', moduleResolution: 'bundler', allowSyntheticDefaultImports: true }, include: ['vite.config.ts'] }, null, 2),
    'vite.config.ts': TEMPLATES.viteConfig(projectFolderName),
    'tailwind.config.js': TEMPLATES.tailwindConfig(),
    'postcss.config.js': TEMPLATES.postCssConfig(),
    'index.html': TEMPLATES.htmlTemplate(appName),
    'src/main.tsx': TEMPLATES.mainTsx(),
    'src/index.css': TEMPLATES.indexCss(),
    'src/App.css': '#root { width: 100%; margin: 0 auto; }',
    'src/App.tsx': generateAppTsx(formData),
    'src/pages/SubLogin.tsx': TEMPLATES.subLogin(appName),
    'src/types/federation.d.ts': TEMPLATES.typeDefinitions(),
    'README.md': generateReadme(formData),
    ...generateContextFiles(modules)
  };
  
  Object.entries(frontendFiles).forEach(([filePath, content]) => {
    const fullPath = path.join(frontendDir, filePath);
    ensureDir(path.dirname(fullPath));
    fs.writeFileSync(fullPath, content);
  });
  
  // BACKEND SETUP
  const backendDir = path.join(baseDir, 'backend');
  ensureDir(backendDir);
  ensureDir(path.join(backendDir, 'routes'));
  ensureDir(path.join(backendDir, 'prisma'));
  
  const backendFiles = {
    'package.json': TEMPLATES.backendPackage(projectFolderName),
    'server.js': TEMPLATES.backendServer(),
    'routes/index.js': `const express=require('express');const router=express.Router();router.get('/test',(req,res)=>{res.json({message:'Backend is working!'})});module.exports=router;`,
    '.env': TEMPLATES.backendEnv(),
    'prisma/schema.prisma': TEMPLATES.prismaSchema()
  };
  
  Object.entries(backendFiles).forEach(([filePath, content]) => {
    const fullPath = path.join(backendDir, filePath);
    ensureDir(path.dirname(fullPath));
    fs.writeFileSync(fullPath, content);
  });
  
  console.log(`\n✅ Project "${projectFolderName}" created successfully!\n📁 Location: ${baseDir}`);
  return baseDir;
};

// HELPER FUNCTIONS FOR TEMPLATES
const generateAppTsx = (formData) => {
  const { modules } = formData;
  const SELECTED_FEATURES = modules || [];
  const SIDEBAR_MENUS = generateSidebarMenus(modules || []);
  
  return `import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { FederatedContextProvider } from './components/FederatedWrapper';
import CSSLoader from './components/CSSLoader';
import SubLogin from './pages/SubLogin';
import './App.css';

const FederatedSidebar = React.lazy(() => import('SuperAdmin/Sidebar').catch(error => {
  console.error('Failed to load Sidebar:', error);
  return Promise.resolve({
    default: ({ isCollapsed, menus, currentPath, onNavigate }: any) => {
      const React = require('react');
      const { useState } = React;
      const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

      const toggleSubmenu = (menuTitle: string) => {
        setExpandedMenus(prev => ({
          ...prev,
          [menuTitle]: !prev[menuTitle]
        }));
      };

      return (
        <div className={\`transition-[width] duration-300 ease-in-out \${isCollapsed ? 'w-20' : 'w-72'}\`}>
          <nav className={\`h-screen flex flex-col justify-between items-center w-full bg-background-secondary dark:bg-primary-dark-light border-r border-r-primary-border relative dark:border-dark-border transition-[width] duration-300 ease-in-out \${isCollapsed ? 'w-20' : 'w-72'}\`} aria-label="Main navigation">
            <div className="flex flex-col w-full h-fit overflow-hidden overflow-y-auto scrollbar-hide">
              <header className={\`dark:bg-primary-dark flex justify-center border-b border-b-primary-border dark:border-dark-border items-center \${isCollapsed ? 'bg-primary px-4' : 'bg-white px-10'} py-6\`}>
                <img
                  src={isCollapsed ? '/images/bi-blue-logo.svg' : '/images/bi-logo-latest.svg'}
                  alt="Logo"
                  className={\`md:block \${isCollapsed ? 'w-8' : 'w-[170px]'}\`}
                />
              </header>
              <main className="flex p-4 flex-col w-full md:block dark:bg-primary-dark-light">
                {(menus || []).map((category: any, categoryIndex: number) => (
                  <section key={categoryIndex} className="flex flex-col w-full" aria-label={category.category}>
                    {!isCollapsed && (
                      <h2 className="px-4 py-2 text-sm font-semibold uppercase text-neutral-dark dark:text-white">
                        {category.category}
                      </h2>
                    )}
                    <ul className="list-none p-0 m-0 gap-2 flex flex-col">
                      {category.items.map((menuItem: any, itemIndex: number) => (
                        <li key={itemIndex}>
                          {menuItem.hasSubmenu ? (
                            <div className="relative w-full">
                              <button
                                onClick={() => toggleSubmenu(menuItem.title)}
                                className={\`flex items-center gap-4 py-3 px-4 mb-1 text-sm cursor-pointer rounded-lg font-semibold w-full text-left \${currentPath === menuItem.link ? 'text-secondary bg-white dark:bg-brand-blue dark:text-white custom-shadow' : 'text-main hover:bg-white hover:text-secondary dark:text-white dark:hover:bg-primary-dark-light dark:hover:text-white'}\`}
                                aria-expanded={expandedMenus[menuItem.title]}
                                aria-controls={\`submenu-\${menuItem.title}\`}>
                                <span className="w-6 h-6 flex items-center justify-center">
                                  <img src={menuItem.icon} alt="" className={\`w-6 h-6 icon-dark-filter transition-all duration-200 \${currentPath === menuItem.link ? 'icon-filter' : 'group-hover:icon-filter'}\`} aria-hidden="true" />
                                </span>
                                {!isCollapsed && (
                                  <div className="flex items-center justify-between w-full gap-2">
                                    <span>{menuItem.title}</span>
                                    <span className={\`transition-transform \${expandedMenus[menuItem.title] ? 'rotate-180' : ''}\`}>
                                      <img src="/icons/arrow-down.svg" alt="" className="w-3 h-3" aria-hidden="true" />
                                    </span>
                                  </div>
                                )}
                              </button>
                              {!isCollapsed && (
                                <ul id={\`submenu-\${menuItem.title}\`} className={\`relative flex flex-col overflow-hidden transition-all duration-300 ease-in-out pl-0 \${expandedMenus[menuItem.title] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}\`}>
                                  <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200"></span>
                                  {menuItem.submenu?.map((subItem: any, subIndex: number) => (
                                    <li key={subIndex} className="relative">
                                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-0.5 bg-gray-200"></span>
                                      <button
                                        onClick={() => subItem.link && onNavigate?.(subItem.link)}
                                        className={\`block pl-8 pr-4 py-2 rounded-lg font-semibold transition-all duration-200 w-full text-left \${currentPath === subItem.link ? 'bg-[linear-gradient(to_right,transparent_0_30%,white_30%_100%)] text-primary shadow' : 'text-gray-400 hover:text-primary'}\`}>
                                        {subItem.title}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => menuItem.link && onNavigate?.(menuItem.link)}
                              className={\`flex items-center gap-4 py-3 px-4 text-sm cursor-pointer group rounded-lg w-full text-left \${currentPath === menuItem.link ? 'text-primary bg-white dark:bg-primary dark:text-white custom-shadow' : 'text-main hover:bg-white hover:text-primary dark:text-white dark:hover:bg-primary-dark-light dark:hover:text-white'}\`}>
                              <span className="w-6 h-6 flex items-center justify-center">
                                <img src={menuItem.icon} alt="" className={\`w-6 h-6 icon-dark-filter transition-all duration-200 \${currentPath === menuItem.link ? 'icon-filter' : ''}\`} aria-hidden="true" />
                              </span>
                              {!isCollapsed && (
                                <div className="flex items-center justify-between w-full gap-2 font-semibold">
                                  <span>{menuItem.title}</span>
                                  {menuItem.count && (
                                    <span className={\`w-7 h-7 rounded-full text-xs text-white font-bold flex justify-center group-hover:bg-brand items-center \${currentPath === menuItem.link ? 'bg-primary dark:bg-secondary' : 'bg-primary dark:bg-secondary'}\`}>
                                      {menuItem.count}
                                    </span>
                                  )}
                                </div>
                              )}
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </main>
            </div>
          </nav>
        </div>
      );
    }
  });
}));

const FederatedHeader = React.lazy(() => import('SuperAdmin/Header').catch(error => {
  console.error('Failed to load Header:', error);
  return Promise.resolve({
    default: ({ title, onSidebarToggle }: any) => {
      const React = require('react');
      const { useState } = React;
      const [isFullScreen, setIsFullScreen] = useState(false);
      const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
      const [notifications] = useState([
        { id: 1, title: 'System Update', message: 'New system update available', time: '2 minutes ago', isRead: false, type: 'info' },
        { id: 2, title: 'Payment Received', message: 'Payment of ₹500 received from user', time: '5 minutes ago', isRead: false, type: 'success' },
        { id: 3, title: 'Alert', message: 'High power consumption detected', time: '10 minutes ago', isRead: true, type: 'warning' }
      ]);

      const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
          setIsFullScreen(true);
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
            setIsFullScreen(false);
          }
        }
      };

      const unreadCount = notifications.filter(n => !n.isRead).length;

      return (
        <header className="border-b border-primary-border flex items-center justify-between px-6 py-4">
          <nav className="flex items-center gap-4">
            <figure
              className="p-2 bg-stat-icon-gradient w-8 h-8 rounded-full flex items-center justify-center hover:text-white cursor-pointer"
              onClick={onSidebarToggle}
              aria-label="Toggle sidebar">
              <img
                src="/icons/arrow-left-from-arc.svg"
                className="h-6 w-6 custom-filter"
                alt="Toggle sidebar"
              />
            </figure>
            <h1 className="text-base text-primary-dark dark:text-white">{title || 'Dashboard'}</h1>
          </nav>
          
          <section className="flex-1 max-w-2xl mx-8" aria-label="Search section">
            <div className="relative">
              <input
                type="search"
                placeholder="Search..."
                className="w-full text-primary-dark px-4 py-3 pr-32 rounded-full border border-primary-border text-main text-sm font-light bg-white dark:bg-primary-dark dark:border-dark-border dark:bg-dark-secondary dark:text-white focus:outline-none placeholder-black placeholder:font-normal dark:placeholder:text-main dark:placeholder:font-light"
                aria-label="Search"
              />
              <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm">
                  <kbd className="px-2 text-primary-dark-light text-sm font-light bg-background-secondary dark:bg-primary-dark-light rounded dark:text-subinfo">
                    Ctrl
                  </kbd>
                  <span className="text-primary-dark dark:text-subinfo">+</span>
                  <kbd className="px-2 text-primary-dark text-sm font-light bg-background-secondary dark:bg-primary-dark-light rounded dark:text-subinfo">
                    K
                  </kbd>
                </div>
                <span className="bg-background-secondary dark:bg-primary-dark rounded-full w-8 h-8 flex items-center justify-center">
                  <img
                    src="/icons/search-icon.svg"
                    alt="Search"
                    className="h-4.5 w-4.5"
                  />
                </span>
              </div>
            </div>
          </section>

          <nav className="flex items-center gap-4" aria-label="User actions">
            <figure
              className="p-2 w-8 h-8 bg-background-secondary dark:bg-dark-secondary rounded-full flex items-center justify-center cursor-pointer"
              onClick={toggleFullScreen}
              aria-label="Toggle full screen">
              <img
                src="/icons/full-screen.svg"
                alt="Full screen"
                className="h-6 w-6"
              />
            </figure>
            
            <div className="relative">
              <figure
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 bg-background-secondary dark:bg-dark-secondary rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer relative"
                aria-label="Notifications"
              >
                <img
                  src="/icons/bell.svg"
                  alt="Notifications"
                  className="h-4 w-4"
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </figure>
            </div>
            
            <figure
              className="p-2 flex bg-background-secondary dark:bg-dark-secondary rounded-full flex items-center justify-center items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200 cursor-pointer"
              aria-label="User profile"
            >
              <img
                src="/icons/user.svg"
                alt="User profile"
                className="h-6 w-6"
              />
            </figure>
          </nav>
        </header>
      );
    }
  });
}));

declare global {
  interface Window {
    __SELECTED_MODULES__?: any[];
    __GENERATE_MENUS__?: (modules: any[]) => any[];
    __SUPERADMIN_AVAILABLE__?: boolean;
  }
}

const modules = window.__SELECTED_MODULES__ || [];
const generateSidebarMenus = window.__GENERATE_MENUS__ || (() => []);
const SELECTED_FEATURES = modules;
const SIDEBAR_MENUS = generateSidebarMenus(modules);

if (typeof window !== 'undefined') {
  window.__SUPERADMIN_AVAILABLE__ = false;
}

localStorage.setItem('selectedModules', JSON.stringify(modules));
localStorage.setItem('sidebarMenus', JSON.stringify(SIDEBAR_MENUS));

function DynamicContent() {
  const location = useLocation();
  const pathname = location.pathname;

  const isAllowedPath = () => {
    const mandatoryPaths = ['/', '/consumers', '/consumers/add', '/users', '/role-management'];
    if (mandatoryPaths.includes(pathname)) return true;

    const optionalPaths = {
      '/bills/prepaid': ['bills', 'bills_prepaid'],
      '/bills/postpaid': ['bills', 'bills_postpaid'],
      '/dtr-dashboard': ['dtr_dashboard'],
      '/asset-management': ['asset_management'],
      '/connect-disconnect': ['asset_management'],
      '/meter-management/meters-list': ['meters', 'meter_management'],
      '/meter-management/meters-list/add': ['meters', 'meter_management'],
      '/meter-management/data-logger-master': ['meters', 'meter_management'],
      '/meter-management/data-logger-master/add': ['meters', 'meter_management'],
      '/all-tickets': ['tickets', 'all_tickets'],
    };

    const allowedKeys = optionalPaths[pathname as keyof typeof optionalPaths];
    return allowedKeys ? allowedKeys.some((k: any) => SELECTED_FEATURES.includes(k)) : false;
  };

  if (!isAllowedPath()) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">This feature is not available in your plan.</p>
        </div>
      </div>
    );
  }

  function safeReplaceAll(str: string, search: string, replacement: string) {
    return str.split(search).join(replacement);
  }

  function getFederatedComponentPath(pathname: string) {
    if (pathname === '/') return '/Dashboard';
    const cleanedPath = safeReplaceAll(pathname, '-', '');
    return (
      '/' +
      cleanedPath
        .split('/')
        .map((p: string) => (p ? p.charAt(0).toUpperCase() + p.slice(1) : ''))
        .join('/')
    );
  }

  const FederatedComponent = React.lazy(() => {
    const componentPath = getFederatedComponentPath(pathname);
    console.log('Loading federated component:', \`SuperAdmin\${componentPath}\`);
    
    if (typeof window !== 'undefined' && !window.__SUPERADMIN_AVAILABLE__) {
      console.log('SuperAdmin not available, using fallback component');
      return Promise.resolve({
        default: () => {
          if (pathname === '/') {
            return (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
                  <p className="text-gray-600">Welcome to your admin dashboard</p>
                </div>
              </div>
            );
          }
          
          return (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Component Not Available</h2>
                <p className="text-gray-600">The requested component could not be loaded.</p>
                <p className="text-sm text-gray-500 mt-2">Path: {componentPath}</p>
                <p className="text-sm text-gray-500">Make sure SuperAdmin is running for full functionality.</p>
              </div>
            </div>
          );
        }
      });
    }
    
    return import(\`SuperAdmin\${componentPath}\`).then(module => {
      if (typeof window !== 'undefined') {
        window.__SUPERADMIN_AVAILABLE__ = true;
      }
      return module;
    }).catch(error => {
      console.error('Failed to load federated component:', error);
      if (typeof window !== 'undefined') {
        window.__SUPERADMIN_AVAILABLE__ = false;
      }
      return Promise.resolve({
        default: () => (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Component Not Available</h2>
              <p className="text-gray-600">The requested component could not be loaded.</p>
              <p className="text-sm text-gray-500 mt-2">Path: {componentPath}</p>
              <p className="text-sm text-gray-500">Make sure SuperAdmin is running for full functionality.</p>
            </div>
          </div>
        )
      });
    });
  });
  
  return (
    <React.Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
      <FederatedComponent />
    </React.Suspense>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isLoggedIn = !!localStorage.getItem('token');
  const location = useLocation();
  return isLoggedIn ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

function AppContent() {
  const { isSidebarCollapsed, toggleSidebar } = useApp();
  const location = useLocation();

  return (
    <FederatedContextProvider
      value={{
        isSidebarCollapsed,
        toggleSidebar,
        isDarkMode: false,
        selectedModules: [],
        toggleTheme: () => {},
        setSelectedModules: () => {},
      }}
    >
      <Routes>
        <Route path="/login" element={<SubLogin />} />
        <Route
          path="*"
          element={
            <RequireAuth>
              <div className="flex h-screen bg-white">
                <React.Suspense fallback={<div>Loading Sidebar...</div>}>
                  <FederatedSidebar
                    isCollapsed={isSidebarCollapsed}
                    menus={SIDEBAR_MENUS}
                    currentPath={location.pathname}
                    onNavigate={(path: string) => (window.location.href = path)}
                  />
                </React.Suspense>
                <div className="flex flex-col flex-1">
                  <React.Suspense fallback={<div>Loading Header...</div>}>
                    <FederatedHeader
                      title={(location.pathname.split('/').join(' ').trim()) || 'Dashboard'}
                      onSidebarToggle={toggleSidebar}
                    />
                  </React.Suspense>
                  <main className="flex-1 p-6 bg-white overflow-auto dark:bg-primary-dark">
                    <Routes>
                      <Route path="*" element={<DynamicContent />} />
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
    <Router>
      <AppProvider>
        <CSSLoader />
        <AppContent />
      </AppProvider>
    </Router>
  );
}

export default App;`;
};

const generateReadme = (formData) => {
  const { appName, companyName, adminFirstName, adminLastName, adminEmail, adminRole, timezone, currency, modules } = formData;
  return `# ${appName || 'Admin App'}\n\nThis is a React application generated from the Admin Module configuration.\n\n## App Details\n\n- **App Name**: ${appName || 'Not specified'}\n- **Company**: ${companyName || 'Not specified'}\n- **Admin**: ${adminFirstName} ${adminLastName} (${adminEmail})\n- **Role**: ${adminRole || 'Administrator'}\n- **Timezone**: ${timezone || 'Not specified'}\n- **Currency**: ${currency || 'Not specified'}\n\n## Modules\n\n${modules?.map((module) => `- ${module}`).join('\n') || 'No modules configured'}\n\n## Getting Started\n\n1. Install dependencies:\n   \`\`\`bash\n   npm install\n   \`\`\`\n\n2. Start the development server:\n   \`\`\`bash\n   npm run dev\n   \`\`\`\n\n3. Open [http://localhost:1700](http://localhost:1700) in your browser.\n\n## Available Scripts\n\n- \`npm run dev\` - Start development server\n- \`npm run build\` - Build for production\n- \`npm run preview\` - Preview production build\n- \`npm run lint\` - Run ESLint\n\n## Technologies Used\n\n- React 19\n- TypeScript\n- Vite\n- Tailwind CSS\n- React Router\n- Module Federation\n\n## Project Structure\n\n\`\`\`\nsrc/\n├── components/     # Reusable components\n├── pages/         # Page components\n├── context/       # React context\n├── App.tsx        # Main app component\n├── main.tsx       # App entry point\n└── index.css      # Global styles\n\`\`\`\n\n## Features\n\n- **Dark Mode Support**: Toggle between light and dark themes\n- **Collapsible Sidebar**: Expandable/collapsible navigation sidebar\n- **Responsive Design**: Works on desktop and mobile devices\n- **Module-based Navigation**: Dynamic navigation based on enabled modules\n- **Federated Components**: Loads components from SuperAdmin module\n\nGenerated on: ${new Date().toLocaleDateString()}`;
};

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