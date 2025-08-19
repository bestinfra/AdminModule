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

    const frontendFormData = { ...formData, backendPort: dynamicPort };
    generateFrontend(baseDir, frontendFormData);
    
    // Copy assets after frontend is generated
    copyAssets(baseDir, formData);

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
      
      // Prepare new accounts data
      const newAccounts = formData.newAccounts || [];
      
      // Prepare modules data
      const modules = formData.modules || [];
      
      const deploymentResult = await deployer.deployBackend(projectFolderName, applicationBackendDir, credentials, newAccounts, modules);
      
      if (deploymentResult.success) {
        console.log('\n✅ Backend deployed successfully!');
        console.log(`   • Root URL: ${deploymentResult.rootUrl}`);
        console.log(`   • Health Check: ${deploymentResult.healthUrl}`);
        console.log(`   • Port: ${deploymentResult.port}`);
        console.log(`   • Database: ${deploymentResult.database}`);
        console.log(`   • Admin User: ${credentials.adminUsername} (${credentials.adminEmail})`);
        console.log(`   • Mode: DEVELOPMENT`);
        if (deploymentResult.newAccountsCount > 0) {
          console.log(`   • New Accounts Created: ${deploymentResult.newAccountsCount}`);
        }
        if (deploymentResult.modulesCount > 0) {
          console.log(`   • Modules Enabled: ${deploymentResult.modulesCount}`);
        }
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

    // Use pages as the source for pages
    const sourcePagesDir = path.join(sourceFrontendDir, 'src', 'pages');
    const destPagesDir = path.join(frontendDir, 'src', 'pages');
    
    // Module to page file mapping - Updated to match frontendGenerator.js structure
    const moduleToPageMapping = {
        // Dashboard modules
        'consumer_dashboard': ['ConsumerDashboard.tsx'],
        'dtr_dashboard': ['DTRDashboard.tsx', 'Feeders.tsx'],
        
        // User management modules
        'users': ['Users.tsx', 'UserDetail.tsx', 'AddUser.tsx'], // Users includes UserDetail and AddUser
        'role_management': ['RoleManagement.tsx'],
        'user_management_default': ['Users.tsx', 'UserDetail.tsx', 'AddUser.tsx', 'RoleManagement.tsx'], // Parent module includes all
        
        // Billing modules
        'prepaid': ['Prepaid.tsx'],
        'postpaid': ['Postpaid.tsx'],
        'bills': ['Prepaid.tsx', 'Postpaid.tsx'], // Parent module includes only prepaid and postpaid
        
        // Ticket modules
        'tickets': ['Tickets.tsx', 'TicketView.tsx', 'AddTicket.tsx'], // Tickets includes all ticket pages
        
        // Asset management
        'asset_management': ['AssetManagement.tsx'],
        
        // Meter management modules
        'meter_list': ['Meters.tsx', 'MetersList.tsx', 'MeterDetails.tsx'], // Meter list includes all meter pages
        'data_logger_master': ['DataLogger.tsx', 'DataLoggerDashboard.tsx'],
        'add_meter': ['AddMeter.tsx'],
        'meter_management': ['Meters.tsx', 'MetersList.tsx', 'MeterDetails.tsx', 'DataLogger.tsx', 'AddMeter.tsx'], // Parent module includes all
        
        // Consumer modules
        'consumer': ['Consumers.tsx', 'ConsumerView.tsx'], // Consumer includes ConsumerView
        
        // Individual meter modules (for backward compatibility)
        'meter_details': ['MeterDetails.tsx'],
        'meters': ['Meters.tsx'],
        'meters_list': ['MetersList.tsx'],
        'consumer_view': ['ConsumerView.tsx'],
        'user_detail': ['UserDetail.tsx'],
        'ticket_view': ['TicketView.tsx'],
        
        // Additional components that might be needed
        'add_ticket': ['AddTicket.tsx'],
        'add_user': ['AddUser.tsx']
    };

    if (fs.existsSync(sourcePagesDir)) {
        // Remove existing destPagesDir if it exists to avoid mixing old files
        if (fs.existsSync(destPagesDir)) {
            fs.rmSync(destPagesDir, { recursive: true, force: true });
        }
        
        // Create destination directory
        fs.mkdirSync(destPagesDir, { recursive: true });
        
        // Copy only selected modules
        const selectedModules = formData.modules || [];
        
        // Auto-add related modules based on frontendGenerator.js logic
        let modulesToProcess = [...selectedModules];
        
        // Auto-add role_management if users is selected
        if (selectedModules.includes('users') && !selectedModules.includes('role_management')) {
            modulesToProcess.push('role_management');
            console.log('  🔧 Auto-added role_management (included with users)');
        }
        
        // Auto-add meter_details if meter_list is selected
        if (selectedModules.includes('meter_list') && !selectedModules.includes('meter_details')) {
            modulesToProcess.push('meter_details');
            console.log('  🔧 Auto-added meter_details (included with meter_list)');
        }
        
        // Auto-add consumer_view if consumer is selected
        if (selectedModules.includes('consumer') && !selectedModules.includes('consumer_view')) {
            modulesToProcess.push('consumer_view');
            console.log('  🔧 Auto-added consumer_view (included with consumer)');
        }
        
        // Auto-add user_detail if users is selected
        if (selectedModules.includes('users') && !selectedModules.includes('user_detail')) {
            modulesToProcess.push('user_detail');
            console.log('  🔧 Auto-added user_detail (included with users)');
        }
        
        // Auto-add ticket_view if tickets is selected
        if (selectedModules.includes('tickets') && !selectedModules.includes('ticket_view')) {
            modulesToProcess.push('ticket_view');
            console.log('  🔧 Auto-added ticket_view (included with tickets)');
        }
        
        // Auto-add add_ticket if tickets is selected
        if (selectedModules.includes('tickets') && !selectedModules.includes('add_ticket')) {
            modulesToProcess.push('add_ticket');
            console.log('  🔧 Auto-added add_ticket (included with tickets)');
        }
        
        // Auto-add add_user if users is selected
        if (selectedModules.includes('users') && !selectedModules.includes('add_user')) {
            modulesToProcess.push('add_user');
            console.log('  🔧 Auto-added add_user (included with users)');
        }
        
        // Handle parent module mappings
        const parentModuleMapping = {
            'meter_management': ['meter_list', 'data_logger_master', 'add_meter'],
            'user_management_default': ['users', 'role_management'],
            'bills': ['prepaid', 'postpaid']
        };
        
        // Auto-add sub-modules for parent modules
        Object.entries(parentModuleMapping).forEach(([parentModule, subModules]) => {
            if (selectedModules.includes(parentModule)) {
                subModules.forEach(subModule => {
                    if (!modulesToProcess.includes(subModule)) {
                        modulesToProcess.push(subModule);
                        console.log(`  🔧 Auto-added ${subModule} (included with ${parentModule})`);
                    }
                });
            }
        });
        
        // Handle dependencies for individual sub-modules
        const subModuleDependencies = {
            'meter_list': ['meter_details'],
            'consumer': ['consumer_view'],
            'users': ['user_detail', 'add_user'],
            'tickets': ['ticket_view', 'add_ticket']
        };
        
        // Auto-add dependencies for selected sub-modules
        Object.entries(subModuleDependencies).forEach(([subModule, dependencies]) => {
            if (modulesToProcess.includes(subModule)) {
                dependencies.forEach(dependency => {
                    if (!modulesToProcess.includes(dependency)) {
                        modulesToProcess.push(dependency);
                        console.log(`  🔧 Auto-added ${dependency} (dependency of ${subModule})`);
                    }
                });
            }
        });
        
        console.log('📁 Copying selected modules:', selectedModules);
        console.log('📁 Processing modules (including auto-added):', modulesToProcess);
        console.log('📁 Source pages directory:', sourcePagesDir);
        console.log('📁 Destination pages directory:', destPagesDir);
        
        modulesToProcess.forEach(module => {
            const pageFiles = moduleToPageMapping[module];
            if (pageFiles) {
                console.log(`  📂 Processing module: ${module}`);
                console.log(`     Page files: ${pageFiles.join(', ')}`);
                
                pageFiles.forEach(pageFile => {
                    const sourcePath = path.join(sourcePagesDir, pageFile);
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
            const sourcePath = path.join(sourcePagesDir, file);
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
        
        // Fix pages_v2 imports to use pages instead
        content = content.replace(/@pages_v2\//g, '@pages/');
        content = content.replace(/\.\.\/pages_v2\//g, '../pages/');
        
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
