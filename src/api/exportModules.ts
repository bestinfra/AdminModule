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