const fs = require('fs');
const path = require('path');
const { generateFrontend } = require('./frontendGenerator');
const { generateBackend } = require('./backendGenerator');

// Import the optimized deployer for automatic backend deployment
const OptimizedDeployer = require('../scripts/optimizedDeployer.js');
const deployer = new OptimizedDeployer();

/**
 * Optimized app project generator
 * @param {Object} formData - Form data with app configuration
 * @returns {string} - Path to the generated project
 */
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

  // Create the project folder name
  const projectFolderName =
    appName
      ?.toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "my-admin-app";
  
  const baseDir = path.join(__dirname, '..', 'generated-apps', projectFolderName);

  // Helper to ensure directory exists
  function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Create base directory
  ensureDir(baseDir);

  // Get dynamic port for this backend
  const dynamicPort = deployer.findAvailablePort();

  // Copy assets from existing frontend
  copyAssets(baseDir);

  // Generate frontend with backend port
  const frontendFormData = { ...formData, backendPort: dynamicPort };
  generateFrontend(baseDir, frontendFormData);

  // --- BACKEND DEPLOYMENT START ---
  // Deploy backend to XAMPP using optimized deployer
  try {
    console.log('\n🚀 Deploying backend to XAMPP...');
    // Deploy directly from application-backend
    const applicationBackendDir = path.join(__dirname, '..', 'application-backend');
    const deploymentResult = deployer.deployBackend(projectFolderName, applicationBackendDir);
    
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
      console.log(`   node scripts/optimizedDeployer.js deploy ${projectFolderName} ${applicationBackendDir}`);
    }
  } catch (error) {
    console.log('\n⚠️  Backend deployment failed:', error.message);
    console.log('   You can manually deploy using:');
    console.log(`   node scripts/optimizedDeployer.js deploy ${projectFolderName} ${applicationBackendDir}`);
  }
  // --- BACKEND DEPLOYMENT END ---

  console.log(`Project "${projectFolderName}" created successfully at: ${baseDir}`);
  console.log(`Next steps:`);
  console.log(`   1. cd ${baseDir}`);
  console.log(`   2. npm install`);
  console.log(`   3. npm run dev`);

  return baseDir;
}

/**
 * Copy assets from the existing frontend
 * @param {string} baseDir - Base directory for the project
 */
function copyAssets(baseDir) {
  const frontendDir = path.join(baseDir, 'frontend');
  const sourceFrontendDir = path.join(__dirname, '..', 'frontend');

  // Copy pages directory
  const sourcePagesDir = path.join(sourceFrontendDir, 'src', 'pages');
  const destPagesDir = path.join(frontendDir, 'src', 'pages');
  if (fs.existsSync(sourcePagesDir)) {
    copyDirectoryRecursive(sourcePagesDir, destPagesDir);
  }

  // Copy public assets
  copyPublicAssets(sourceFrontendDir, frontendDir);
}

/**
 * Copy directory recursively
 * @param {string} source - Source directory
 * @param {string} dest - Destination directory
 */
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
    appName: "Example App",
    subdomain: "example-app",
    companyName: "Example Company",
    adminFirstName: "Admin",
    adminLastName: "User",
    adminEmail: "admin@example.com",
    adminRole: "Administrator",
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    textPrimaryColor: "#262626",
    textSecondaryColor: "#7e7e7e",
    backgroundColor: "#f5f8fc",
    borderColor: "#e9efff",
    shadowColor: "#dce4ef",
    iconColor: "#476189",
    gradientColor: "#163b7c",
    timezone: "UTC",
    currency: "USD",
    modules: ["dashboard", "user_management_default", "role_management"],
  };

  createAppProjectOptimized(exampleFormData);
} 