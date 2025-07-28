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
      const deploymentResult = await deployer.deployBackend(projectFolderName, applicationBackendDir);
      
      if (deploymentResult.success) {
        console.log('\n✅ Backend deployed successfully!');
        console.log(`   • Root URL: ${deploymentResult.rootUrl}`);
        console.log(`   • Health Check: ${deploymentResult.healthUrl}`);
        console.log(`   • Environment: ${deploymentResult.envUrl}`);
        console.log(`   • Port: ${deploymentResult.port}`);
        console.log(`   • Database: ${deploymentResult.database}`);
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
        'consumer_dashboard': ['Dashboard.tsx'], // Consumer dashboard is part of main Dashboard
        'dtr_dashboard': ['DTRDashboard.tsx', 'Feeders.tsx'], // Separate DTR Dashboard component
        'consumer': ['Consumers.tsx', 'ConsumerView.tsx', 'AddConsumer'],
        'tickets': ['Tickets.tsx', 'TicketView.tsx', 'AddTicket.tsx'],
        'prepaid': ['Prepaid.tsx'],
        'postpaid': ['Postpaid.tsx'],
        'asset_management': ['AssetManagment.tsx'],
        'meter_management': ['Meters.tsx', 'MeterDetails.tsx', 'DataLogger.tsx'],
        'user_management_default': ['Users.tsx'],
        'role_management': ['RoleManagement.tsx'],
        'connect_disconnect': ['ConnectDisconnect.tsx']
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
        console.log('📁 Copying selected modules:', selectedModules);
        
        selectedModules.forEach(module => {
            const pageFiles = moduleToPageMapping[module];
            if (pageFiles) {
                pageFiles.forEach(pageFile => {
                    const sourcePath = path.join(sourcePagesV2Dir, pageFile);
                    const destPath = path.join(destPagesDir, pageFile);
                    
                    if (fs.existsSync(sourcePath)) {
                        if (fs.statSync(sourcePath).isDirectory()) {
                            // Copy directory recursively
                            copyDirectoryRecursive(sourcePath, destPath);
                            console.log(`  ✅ Copied directory: ${pageFile}`);
                        } else {
                            // Copy single file
                            copyFileWithImportProcessing(sourcePath, destPath);
                            console.log(`  ✅ Copied file: ${pageFile}`);
                        }
                    } else {
                        console.log(`  ⚠️  File not found: ${pageFile} for module: ${module}`);
                    }
                });
            } else {
                console.log(`  ⚠️  No page mapping found for module: ${module}`);
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
        modules: ['dashboard', 'user_management_default', 'role_management'],
    };

    createAppProjectOptimized(exampleFormData);
}
