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
      }
    },
  },
  plugins: [],
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
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}`,
    
    'src/App.tsx': `import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import './App.css'

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              ${modules?.map((module: string) => `
              <Route path="/${module}" element={<div className="p-6"><h1 className="text-2xl font-bold">${module.charAt(0).toUpperCase() + module.slice(1)} Module</h1><p className="text-gray-600">This is the ${module} module page.</p></div>} />`).join('') || ''}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App`,
    
    'src/App.css': `#root {
  width: 100%;
  margin: 0 auto;
  text-align: center;
}`,
    
    'src/components/Sidebar.tsx': `import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()
  
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    ${modules?.map((module: string) => `{ path: '/${module}', label: '${module.charAt(0).toUpperCase() + module.slice(1)}', icon: '📋' }`).join(',\n    ') || ''}
  ]

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-800">${appName || 'Admin App'}</h1>
        <p className="text-sm text-gray-600">${companyName || 'Company Name'}</p>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={\`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 \${location.pathname === item.path ? 'bg-blue-50 border-r-2 border-blue-500' : ''}\`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar`,
    
    'src/components/Header.tsx': `const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Welcome, ${adminFirstName || 'Admin'}!</h2>
          <p className="text-sm text-gray-600">${adminRole || 'Administrator'}</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">${adminEmail || 'admin@example.com'}</span>
          <button className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header`,
    
    'src/pages/Dashboard.tsx': `const Dashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome to your ${appName || 'Admin'} application</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">App Info</h3>
          <p className="text-gray-600">Name: ${appName || 'Not specified'}</p>
          <p className="text-gray-600">Subdomain: ${subdomain || 'Not specified'}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">Company</h3>
          <p className="text-gray-600">${companyName || 'Not specified'}</p>
          <p className="text-gray-600">${companyWebsite || 'No website'}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">Settings</h3>
          <p className="text-gray-600">Timezone: ${timezone || 'Not specified'}</p>
          <p className="text-gray-600">Currency: ${currency || 'Not specified'}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">Modules</h3>
          <p className="text-gray-600">${modules?.length || 0} modules enabled</p>
          <p className="text-gray-600">${modules?.join(', ') || 'None'}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          ${modules?.map((module: string) => `
          <button className="p-4 border rounded-lg hover:bg-gray-50">
            <div className="text-2xl mb-2">📋</div>
            <div className="font-medium">${module.charAt(0).toUpperCase() + module.slice(1)}</div>
          </button>`).join('\n          ') || '<p className="text-gray-500">No modules configured</p>'}
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
├── App.tsx        # Main app component
├── main.tsx       # App entry point
└── index.css      # Global styles
\`\`\`

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