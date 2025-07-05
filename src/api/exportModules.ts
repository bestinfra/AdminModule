import type { Module } from '../types/module';
import JSZip from 'jszip';

export async function exportModules(modules: Module[]): Promise<Blob> {
  const zip = new JSZip();

  // Create the Next.js project structure
  const projectStructure = {
    'package.json': JSON.stringify({
      name: 'nextjs-modules',
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint'
      },
      dependencies: {
        next: 'latest',
        react: 'latest',
        'react-dom': 'latest',
        '@types/node': 'latest',
        '@types/react': 'latest',
        '@types/react-dom': 'latest',
        typescript: 'latest',
        tailwindcss: 'latest',
        postcss: 'latest',
        autoprefixer: 'latest'
      }
    }, null, 2),
    'tsconfig.json': JSON.stringify({
      compilerOptions: {
        target: 'es5',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'node',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx'],
      exclude: ['node_modules']
    }, null, 2),
    'tailwind.config.js': `module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,
    'postcss.config.js': `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,
    'pages/_app.tsx': `import '../styles/globals.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;`,
    'styles/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;`
  };

  // Add project structure to zip
  Object.entries(projectStructure).forEach(([path, content]) => {
    zip.file(path, content);
  });

  // Add module files
  modules.forEach(module => {
    // Create module directory
    const moduleDir = zip.folder(`pages/${module.id}`);
    
    // Add module pages
    module.pages.forEach(page => {
      const pageContent = `import React from 'react';

export default function ${page.name}() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">${page.name}</h1>
      <p className="text-gray-600">${page.description}</p>
    </div>
  );
}`;
      moduleDir?.file(`${page.id}.tsx`, pageContent);
    });

    // Add module index page
    const indexContent = `import React from 'react';
import Link from 'next/link';

export default function ${module.name}Index() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">${module.name}</h1>
      <p className="text-gray-600 mb-8">${module.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${module.pages.map(page => `
        <Link href="/${module.id}/${page.id}" key="${page.id}">
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">${page.name}</h2>
            <p className="text-gray-600">${page.description}</p>
          </div>
        </Link>
        `).join('')}
      </div>
    </div>
  );
}`;
    moduleDir?.file('index.tsx', indexContent);
  });

  // Generate zip file
  return await zip.generateAsync({ type: 'blob' });
}

export async function generateAppProject(formData: any): Promise<Blob> {
  const zip = new JSZip();

  // Extract data from form
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
    timezone,
    currency,
    modules
  } = formData;

  // Create the React project structure
  const projectStructure = {
    'package.json': JSON.stringify({
      name: subdomain || appName?.toLowerCase().replace(/\s+/g, '-') || 'my-admin-app',
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview',
        lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0'
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        'react-router-dom': '^6.8.0',
        '@types/react': '^18.0.28',
        '@types/react-dom': '^18.0.11',
        typescript: '^4.9.3',
        vite: '^4.1.0',
        '@vitejs/plugin-react': '^3.1.0',
        tailwindcss: '^3.2.7',
        postcss: '^8.4.21',
        autoprefixer: '^10.4.14'
      },
      devDependencies: {
        '@types/node': '^18.15.11',
        eslint: '^8.36.0',
        '@typescript-eslint/eslint-plugin': '^5.57.1',
        '@typescript-eslint/parser': '^5.57.1'
      }
    }, null, 2),
    
    'tsconfig.json': JSON.stringify({
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
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true
      },
      include: ['src'],
      references: [{ path: './tsconfig.node.json' }]
    }, null, 2),
    
    'tsconfig.node.json': JSON.stringify({
      compilerOptions: {
        composite: true,
        skipLibCheck: true,
        module: 'ESNext',
        moduleResolution: 'bundler',
        allowSyntheticDefaultImports: true
      },
      include: ['vite.config.ts']
    }, null, 2),
    
    'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})`,
    
    'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '${primaryColor || '#3B82F6'}',
        'primary-lightest': '#F0F9FF',
        'primary-border': '#E5E7EB',
        'dark-border': '#374151',
        'primary-dark': '#1F2937',
        'primary-dark-light': '#374151',
        'dark-secondary': '#4B5563',
        'subinfo': '#9CA3AF',
        'main': '#111827',
        'light': '#6B7280',
        'light-border': '#D1D5DB'
      }
    },
  },
  plugins: [],
  darkMode: 'class'
}`,
    
    'postcss.config.js': `export default {
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
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
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
    
    'src/App.tsx': `import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import { AppProvider } from './context/AppContext'
import './App.css'

function App() {
  return (
    <AppProvider>
    <Router>
        <div className="flex h-screen bg-white">
        <Sidebar />
          <div className="flex flex-col flex-1">
          <Header />
            <main className="flex-1 p-6 bg-white overflow-auto dark:bg-primary-dark">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              ${modules?.map((module: string) => `
              <Route path="/${module}" element={<div className="p-6"><h1 className="text-2xl font-bold">${module.charAt(0).toUpperCase() + module.slice(1)} Module</h1><p className="text-gray-600">This is the ${module} module page.</p></div>} />`).join('') || ''}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
    </AppProvider>
  )
}

export default App`,
    
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
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
        setIsSidebarCollapsed((prev) => !prev);
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
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        ${modules?.map((module: string) => `{
          title: '${module.charAt(0).toUpperCase() + module.slice(1)}',
          icon: '📋',
          link: '/${module}',
        }`).join(',\n        ') || ''}
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
                {isSidebarCollapsed ? '${appName?.charAt(0) || 'A'}' : '${appName || 'Admin App'}'}
              </h1>
              {!isSidebarCollapsed && (
                <p className="text-sm text-gray-600 dark:text-gray-400">${companyName || 'Company Name'}</p>
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
              <section className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 flex flex-col items-center justify-center p-6 gap-4">
                <div className="flex items-center justify-between w-full">
                  <span className="w-10 h-10 bg-white rounded-full transition-all duration-300 flex justify-center items-center">
                    <span className="text-blue-600 text-xl">📱</span>
                  </span>
                  <span className="bg-yellow-400 text-gray-800 text-xs font-medium rounded-lg px-2 py-1">
                    New
                  </span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-white text-2xl font-bold">
                    Mobile App
                  </h3>
                  <p className="text-white text-sm font-semibold">
                    Download our mobile app
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
                    onClick={() => console.log('Download app clicked')}>
                    Download Now
                  </button>
                  <button
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-full p-2 cursor-pointer transition-colors duration-300 hover:bg-gray-100">
                    <span className="text-blue-600 text-lg">📤</span>
                  </button>
                </div>
              </section>
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
              <span className="w-10 h-10 bg-transparent p-2 rounded-full">
                <span className="text-gray-600 dark:text-gray-400 text-xl">📱</span>
              </span>
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
        return 'Dashboard';
      ${modules?.map((module: string) => `case '/${module}':
        return '${module.charAt(0).toUpperCase() + module.slice(1)} Module';`).join('\n      ') || ''}
      default:
        return 'Dashboard';
    }
  };

  const defaultActions: HeaderAction[] = [
    {
      icon: '🔔',
      alt: 'Notifications icon',
      onClick: () => console.log('Notifications clicked'),
      ariaLabel: 'Notifications',
    },
    {
      icon: '⛶',
      alt: 'Full screen icon',
      onClick: () => console.log('Full screen clicked'),
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l3 3m0 0l3-3m-3 3V9" />
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
            ${adminFirstName?.charAt(0) || 'A'}${adminLastName?.charAt(0) || 'U'}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;`,
    
    'src/pages/Dashboard.tsx': `const Dashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome to your ${appName || 'Admin'} application</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">App Info</h3>
          <p className="text-gray-600 dark:text-gray-400">Name: ${appName || 'Not specified'}</p>
          <p className="text-gray-600 dark:text-gray-400">Subdomain: ${subdomain || 'Not specified'}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Company</h3>
          <p className="text-gray-600 dark:text-gray-400">${companyName || 'Not specified'}</p>
          <p className="text-gray-600 dark:text-gray-400">${companyWebsite || 'No website'}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Settings</h3>
          <p className="text-gray-600 dark:text-gray-400">Timezone: ${timezone || 'Not specified'}</p>
          <p className="text-gray-600 dark:text-gray-400">Currency: ${currency || 'Not specified'}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Modules</h3>
          <p className="text-gray-600 dark:text-gray-400">${modules?.length || 0} modules enabled</p>
          <p className="text-gray-600 dark:text-gray-400">${modules?.join(', ') || 'None'}</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          ${modules?.map((module: string) => `
          <button className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-white">
            <div className="text-2xl mb-2">📋</div>
            <div className="font-medium">${module.charAt(0).toUpperCase() + module.slice(1)}</div>
          </button>`).join('\n          ') || '<p className="text-gray-500 dark:text-gray-400">No modules configured</p>'}
        </div>
      </div>
    </div>
  )
}

export default Dashboard`,
    
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

${modules?.map((module: string) => `- ${module}`).join('\n') || 'No modules configured'}

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
`
  };

  // Add project structure to zip
  Object.entries(projectStructure).forEach(([path, content]) => {
    zip.file(path, content);
  });

  // Generate zip file
  return await zip.generateAsync({ type: 'blob' });
} 