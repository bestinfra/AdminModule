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

    copyAssets(baseDir);

    const frontendFormData = { ...formData, backendPort: dynamicPort };
    generateFrontend(baseDir, frontendFormData);

    // --- BACKEND DEPLOYMENT START ---
    try {
        console.log('\n🚀 Deploying backend to XAMPP...');
        const applicationBackendDir = path.join(
            __dirname,
            '..',
            'application-backend'
        );
        const deploymentResult = deployer.deployBackend(
            projectFolderName,
            applicationBackendDir
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
                `   node scripts/optimizedDeployer.js deploy ${projectFolderName} ${applicationBackendDir}`
            );
        }
    } catch (error) {
        console.log('\n⚠️  Backend deployment failed:', error.message);
        console.log('   You can manually deploy using:');
        console.log(
            `   node scripts/optimizedDeployer.js deploy ${projectFolderName} ${applicationBackendDir}`
        );
    }

    console.log(
        `Project "${projectFolderName}" created successfully at: ${baseDir}`
    );
    console.log(`Next steps:`);
    console.log(`   1. cd ${baseDir}`);
    console.log(`   2. npm install`);
    console.log(`   3. npm run dev`);

    return baseDir;
}


function copyAssets(baseDir) {
    const frontendDir = path.join(baseDir, 'frontend');
    const sourceFrontendDir = path.join(__dirname, '..', 'frontend');

    // Prefer pages_v2 as the source for pages
    const sourcePagesV2Dir = path.join(
        sourceFrontendDir,
        'src',
        'export_pages'
    );
    const destPagesDir = path.join(frontendDir, 'src', 'pages');
    if (fs.existsSync(sourcePagesV2Dir)) {
        // Remove existing destPagesDir if it exists to avoid mixing old files
        if (fs.existsSync(destPagesDir)) {
            fs.rmSync(destPagesDir, { recursive: true, force: true });
        }
        copyDirectoryRecursive(sourcePagesV2Dir, destPagesDir);
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
            fs.copyFileSync(sourcePath, destPath);
        }
    });
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
