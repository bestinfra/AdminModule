const fs = require('fs');
const path = require('path');
const { generateFrontend } = require('./frontendGenerator');
const { generateBackend } = require('./backendGenerator');

// Import the optimized deployer for automatic backend deployment
const OptimizedDeployer = require('../scripts/optimizedDeployer.js');
const deployer = new OptimizedDeployer();

function createAppProjectOptimized(formData) {
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

    // Log selected modules for debugging
    console.log('\n📋 Selected modules:', modules || []);
    console.log('📋 Total modules selected:', (modules || []).length);

    const baseDir = path.join(
        __dirname,
        '..',
        'generated-apps',
        projectFolderName
    );

    function ensureDir(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    ensureDir(baseDir);

    const dynamicPort = deployer.findAvailablePort();

    copyAssets(baseDir, formData);

    const frontendFormData = { ...formData, backendPort: dynamicPort };
    generateFrontend(baseDir, frontendFormData);

  // --- BACKEND DEPLOYMENT START ---
  // Deploy backend to XAMPP using optimized deployer
  (async () => {
    try {
      console.log('\n🚀 Deploying backend to XAMPP...');
      // Deploy directly from application-backend
      const applicationBackendDir = path.join(__dirname, '..', 'application-backend');
      
      // Prepare credentials for database insertion
      const credentials = {
        adminFirstName: formData.adminFirstName || 'Admin',
        adminLastName: formData.adminLastName || 'User',
        adminEmail: formData.adminEmail || `admin@${projectFolderName}.com`,
        adminUsername: formData.adminUsername || 'admin',
        adminPassword: formData.adminPassword || 'admin123',
        adminPhone: formData.adminPhone || '+1234567890'
      };
      
      const deploymentResult = await deployer.deployBackend(projectFolderName, applicationBackendDir, credentials);
      
      if (deploymentResult.success) {
        console.log('\n✅ Backend deployed successfully!');
        console.log(`   • Root URL: ${deploymentResult.rootUrl}`);
        console.log(`   • Health Check: ${deploymentResult.healthUrl}`);
        console.log(`   • Port: ${deploymentResult.port}`);
        console.log(`   • Database: ${deploymentResult.database}`);
        console.log(`   • Admin User: ${credentials.adminUsername} (${credentials.adminEmail})`);
        console.log(`   • Mode: DEVELOPMENT`);
      } else {
        console.log('\n⚠️  Backend deployment failed:', deploymentResult.error);
        console.log('   You can manually deploy using:');
        console.log(`   node scripts/optimizedDeployer.js deploy ${projectFolderName} ${applicationBackendDir}`);
      }
    } catch (error) {
      console.log('\n⚠️  Backend deployment failed:', error.message);
      console.log('   You can manually deploy using:');
      console.log(`   node scripts/optimizedDeployer.js deploy ${projectFolderName} ${applicationBackendDir}`);
    }
  })();
  // --- BACKEND DEPLOYMENT END ---

    console.log(
        `Project "${projectFolderName}" created successfully at: ${baseDir}`
    );
    console.log(`Next steps:`);
    console.log(`   1. cd ${baseDir}`);
    console.log(`   2. npm install`);
    console.log(`   3. npm run dev`);

    return baseDir;
}

function copyAssets(baseDir, formData) {
    const frontendDir = path.join(baseDir, 'frontend');
    const sourceFrontendDir = path.join(__dirname, '..', 'frontend');

    // Prefer pages_v2 as the source for pages
    const sourcePagesV2Dir = path.join(sourceFrontendDir, 'src', 'pages_v2');
    const destPagesDir = path.join(frontendDir, 'src', 'pages');
    
    // Module to page file mapping
    const moduleToPageMapping = {
        'consumer_dashboard': ['ConsumerDashboard.tsx'], // Consumer dashboard component (becomes main dashboard)
        'dtr_dashboard': ['DTRDashboard.tsx', 'Feeders.tsx'], // DTR Dashboard includes Feeders (becomes main dashboard)
        'users': ['Users.tsx'],
        'role_management': ['RoleManagement.tsx'],
        'prepaid': ['Prepaid.tsx'],
        'postpaid': ['Postpaid.tsx'],
        'tickets': ['Tickets.tsx', 'TicketView.tsx', 'AddTicket.tsx'], // Tickets includes all ticket pages
        'asset_management': ['AssetManagement.tsx'],
        'meters': ['Meters.tsx', 'MeterDetails.tsx']
    };

    if (fs.existsSync(sourcePagesV2Dir)) {
        // Remove existing destPagesDir if it exists to avoid mixing old files
        if (fs.existsSync(destPagesDir)) {
            fs.rmSync(destPagesDir, { recursive: true, force: true });
        }
        
        // Create destination directory
        fs.mkdirSync(destPagesDir, { recursive: true });
        
        // Copy only selected modules
        const selectedModules = formData.modules || [];
        
        // Add role_management automatically if users is selected (same logic as backend)
        let modulesToProcess = [...selectedModules];
        if (selectedModules.includes('users') && !selectedModules.includes('role_management')) {
            modulesToProcess.push('role_management');
            console.log('  🔧 Auto-added role_management (included with users)');
        }
        
        console.log('📁 Copying selected modules:', selectedModules);
        console.log('📁 Processing modules (including auto-added):', modulesToProcess);
        console.log('📁 Source pages directory:', sourcePagesV2Dir);
        console.log('📁 Destination pages directory:', destPagesDir);
        
        modulesToProcess.forEach(module => {
            const pageFiles = moduleToPageMapping[module];
            if (pageFiles) {
                console.log(`  📂 Processing module: ${module}`);
                console.log(`     Page files: ${pageFiles.join(', ')}`);
                
                pageFiles.forEach(pageFile => {
                    const sourcePath = path.join(sourcePagesV2Dir, pageFile);
                    const destPath = path.join(destPagesDir, pageFile);
                    
                    console.log(`     Checking: ${sourcePath}`);
                    
                    if (fs.existsSync(sourcePath)) {
                        if (fs.statSync(sourcePath).isDirectory()) {
                            // Copy directory recursively
                            copyDirectoryRecursive(sourcePath, destPath);
                            console.log(`       ✅ Copied directory: ${pageFile}`);
                        } else {
                            // Copy single file
                            try {
                                copyFileWithImportProcessing(sourcePath, destPath);
                                console.log(`       ✅ Copied file: ${pageFile}`);
                            } catch (error) {
                                console.log(`       ❌ Error copying ${pageFile}:`, error.message);
                            }
                        }
                    } else {
                        console.log(`       ⚠️  File not found: ${pageFile} for module: ${module}`);
                        console.log(`       Source path: ${sourcePath}`);
                    }
                });
            } else {
                console.log(`  ⚠️  No page mapping found for module: ${module}`);
                console.log(`     Available mappings:`, Object.keys(moduleToPageMapping));
            }
        });
        
        // Always copy essential files (login, etc.)
        const essentialFiles = ['SubLogin.tsx', 'LoginV2.tsx'];
        essentialFiles.forEach(file => {
            const sourcePath = path.join(sourcePagesV2Dir, file);
            const destPath = path.join(destPagesDir, file);
            if (fs.existsSync(sourcePath)) {
                copyFileWithImportProcessing(sourcePath, destPath);
                console.log(`  ✅ Copied essential file: ${file}`);
            }
        });
        
        // Summary of copied files
        console.log('\n📋 Summary of copied files:');
        if (fs.existsSync(destPagesDir)) {
            const copiedFiles = fs.readdirSync(destPagesDir);
            copiedFiles.forEach(file => {
                console.log(`  - ${file}`);
            });
            console.log(`  Total files copied: ${copiedFiles.length}`);
        } else {
            console.log('  No files were copied');
        }
        console.log('');
    }

    copyPublicAssets(sourceFrontendDir, frontendDir);
}

function copyDirectoryRecursive(source, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const items = fs.readdirSync(source);
    items.forEach((item) => {
        const sourcePath = path.join(source, item);
        const destPath = path.join(dest, item);

        if (fs.statSync(sourcePath).isDirectory()) {
            copyDirectoryRecursive(sourcePath, destPath);
        } else {
            if (/\.(js|jsx|ts|tsx)$/.test(item)) {
                let content = fs.readFileSync(sourcePath, 'utf8');
                const importToReplace = `import Page from '@/components/global/PageC';`;
                const lazyImport = `const Page = lazy(() => import('SuperAdmin/Page'));`;
                if (content.includes(importToReplace)) {
                    content = content.replace(importToReplace, lazyImport);
                    if (
                        !/import\s+\{\s*lazy\s*\}\s+from\s+['"]react['"]/.test(
                            content
                        )
                    ) {
                        content = `import { lazy } from 'react';\n` + content;
                    }
                }
                fs.writeFileSync(destPath, content, 'utf8');
            } else {
                fs.copyFileSync(sourcePath, destPath);
            }
        }
    });
}

function copyFileWithImportProcessing(sourcePath, destPath) {
    // Ensure destination directory exists
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    
    if (/\.(js|jsx|ts|tsx)$/.test(path.basename(sourcePath))) {
        let content = fs.readFileSync(sourcePath, 'utf8');
        
        // Replace all @/ imports with relative imports
        content = content.replace(/@\//g, '../');
        
        // Handle specific import replacements for sub-apps
        
        // 1. Replace PageC imports with SuperAdmin/Page
        content = content.replace(
            /import Page from ["']@\/components\/global\/PageC["'];?/g,
            `const Page = lazy(() => import('SuperAdmin/Page'));`
        );
        content = content.replace(
            /import PageC from ["']@\/components\/global\/PageC["'];?/g,
            `const Page = lazy(() => import('SuperAdmin/Page'));`
        );
        content = content.replace(
            /const Page = lazy\(\(\) => import\(["']@\/components\/global\/PageC["']\)\);?/g,
            `const Page = lazy(() => import('SuperAdmin/Page'));`
        );
        content = content.replace(
            /import Page from ["']\.\.\/components\/global\/PageC["'];?/g,
            `const Page = lazy(() => import('SuperAdmin/Page'));`
        );
        content = content.replace(
            /const Page = lazy\(\(\) => import\(["']\.\.\/components\/global\/PageC["']\)\);?/g,
            `const Page = lazy(() => import('SuperAdmin/Page'));`
        );
        // Handle the specific pattern in Tickets.tsx (without quotes)
        content = content.replace(
            /import Page from \.\.\/components\/global\/PageC;?/g,
            `const Page = lazy(() => import('SuperAdmin/Page'));`
        );
        
        // 2. Replace TableData imports with local interface definition
        content = content.replace(
            /import type \{ TableData \} from ["']@\/components\/global\/Table["'];?\n?/g,
            `// Define TableData type locally since we're using federated components\ninterface TableData {\n  [key: string]: string | number | boolean | null | undefined;\n}\n`
        );
        content = content.replace(
            /import type \{ TableData \} from ["']\.\.\/components\/global\/Table["'];?\n?/g,
            `// Define TableData type locally since we're using federated components\ninterface TableData {\n  [key: string]: string | number | boolean | null | undefined;\n}\n`
        );
        
        // 3. Replace CarouselSlide imports with local interface definition
        content = content.replace(
            /import type \{ CarouselSlide \} from ["']@\/components\/global\/Carousel["'];?\n?/g,
            `// Define CarouselSlide type locally since we're using federated components\ninterface CarouselSlide {\n  title: string;\n  img: string;\n}\n`
        );
        content = content.replace(
            /import type \{ CarouselSlide \} from ["']\.\.\/components\/global\/Carousel["'];?\n?/g,
            `// Define CarouselSlide type locally since we're using federated components\ninterface CarouselSlide {\n  title: string;\n  img: string;\n}\n`
        );
        
        // 4. Replace FormInputValue imports with local type definition
        content = content.replace(
            /import type \{ FormInputValue \} from ["']@\/components\/Form\/types["'];?\n?/g,
            `// Define FormInputValue type locally since we're using federated components\ntype FormInputValue = string | string[] | number | boolean | FileList | File | null | undefined;\n`
        );
        content = content.replace(
            /import type \{ FormInputValue \} from ["']\.\.\/components\/Form\/types["'];?\n?/g,
            `// Define FormInputValue type locally since we're using federated components\ntype FormInputValue = string | string[] | number | boolean | FileList | File | null | undefined;\n`
        );
        
        // Add lazy import if it's used but not imported
        if (content.includes('lazy(') && !/import\s+\{\s*lazy\s*\}\s+from\s+['"]react['"]/.test(content)) {
            content = `import { lazy } from 'react';\n` + content;
        }
        
        fs.writeFileSync(destPath, content, 'utf8');
    } else {
        fs.copyFileSync(sourcePath, destPath);
    }
}

/**
 * Copy public assets (icons, images, fonts)
 * @param {string} sourceFrontendDir - Source frontend directory
 * @param {string} destFrontendDir - Destination frontend directory
 */
function copyPublicAssets(sourceFrontendDir, destFrontendDir) {
    const publicDir = path.join(destFrontendDir, 'public');
    fs.mkdirSync(publicDir, { recursive: true });

    // Copy icons
    const sourceIconsDir = path.join(sourceFrontendDir, 'public', 'icons');
    const destIconsDir = path.join(publicDir, 'icons');
    if (fs.existsSync(sourceIconsDir)) {
        copyDirectoryRecursive(sourceIconsDir, destIconsDir);
    }

    // Copy images
    const sourceImagesDir = path.join(sourceFrontendDir, 'public', 'images');
    const destImagesDir = path.join(publicDir, 'images');
    if (fs.existsSync(sourceImagesDir)) {
        copyDirectoryRecursive(sourceImagesDir, destImagesDir);
    }

    // Copy fonts
    const sourceFontsDir = path.join(sourceFrontendDir, 'public', 'fonts');
    const destFontsDir = path.join(publicDir, 'fonts');
    if (fs.existsSync(sourceFontsDir)) {
        copyDirectoryRecursive(sourceFontsDir, destFontsDir);
    }
}

// Export the function
module.exports = { createAppProjectOptimized };

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
        modules: ['consumer_dashboard', 'users', 'role_management', 'prepaid', 'postpaid', 'tickets', 'asset_management', 'meters'],
    };

    createAppProjectOptimized(exampleFormData);
}
