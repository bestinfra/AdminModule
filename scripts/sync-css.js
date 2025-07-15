const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

// Function to transform CSS content for generated apps
function transformCSSForGeneratedApp(cssContent) {
  let transformedContent = cssContent;
  
  // Convert Tailwind CSS v4 syntax to v3 syntax for host app
  transformedContent = transformedContent.replace(/@import 'tailwindcss';/g, '@tailwind base;\n@tailwind components;\n@tailwind utilities;');
  
  // Convert @theme to :root for Tailwind CSS v3 compatibility
  transformedContent = transformedContent.replace(/@theme {/g, ':root {');
  
  // Comment out @custom-variant which is v4 specific
  transformedContent = transformedContent.replace(/@custom-variant dark \(&:where\(\.dark, \.dark \*\)\);/g, '/* @custom-variant dark (&:where(.dark, .dark *)); */');
  
  return transformedContent;
}

// Function to sync CSS files from frontend to a specific generated app
function syncCSSToApp(appName) {
  const frontendStylesDir = path.join(__dirname, '..', 'frontend', 'src', 'styles');
  const appStylesDir = path.join(__dirname, '..', 'generated-apps', appName, 'src', 'styles');
  
  // Check if both directories exist
  if (!fs.existsSync(frontendStylesDir)) {
    console.log(`❌ Frontend styles directory not found: ${frontendStylesDir}`);
    return false;
  }
  
  if (!fs.existsSync(appStylesDir)) {
    console.log(`❌ App styles directory not found: ${appStylesDir}`);
    return false;
  }
  
  // Read all CSS files from frontend
  const cssFiles = fs.readdirSync(frontendStylesDir).filter(file => file.endsWith('.css'));
  
  if (cssFiles.length === 0) {
    console.log(`❌ No CSS files found in ${frontendStylesDir}`);
    return false;
  }
  
  let syncedCount = 0;
  
  cssFiles.forEach(cssFile => {
    const sourcePath = path.join(frontendStylesDir, cssFile);
    const destPath = path.join(appStylesDir, cssFile);
    
    try {
      // Read the source CSS file
      const cssContent = fs.readFileSync(sourcePath, 'utf8');
      
      // Transform CSS for generated app compatibility
      const transformedContent = transformCSSForGeneratedApp(cssContent);
      
      // Write the transformed content to the destination
      fs.writeFileSync(destPath, transformedContent);
      
      console.log(`✅ Synced ${cssFile} to ${appName}`);
      syncedCount++;
    } catch (error) {
      console.error(`❌ Error syncing ${cssFile} to ${appName}:`, error.message);
    }
  });
  
  return syncedCount > 0;
}

// Function to sync CSS files to all generated apps
function syncCSSToAllApps() {
  const generatedAppsDir = path.join(__dirname, '..', 'generated-apps');
  
  if (!fs.existsSync(generatedAppsDir)) {
    console.log(`❌ Generated apps directory not found: ${generatedAppsDir}`);
    return;
  }
  
  const appDirs = fs.readdirSync(generatedAppsDir).filter(dir => {
    const appPath = path.join(generatedAppsDir, dir);
    return fs.statSync(appPath).isDirectory();
  });
  
  if (appDirs.length === 0) {
    console.log(`❌ No generated apps found in ${generatedAppsDir}`);
    return;
  }
  
  console.log(`🔄 Syncing CSS to ${appDirs.length} generated app(s)...`);
  
  appDirs.forEach(appName => {
    console.log(`\n📦 Syncing to app: ${appName}`);
    const success = syncCSSToApp(appName);
    if (!success) {
      console.log(`❌ Failed to sync CSS to ${appName}`);
    }
  });
  
  console.log('\n✅ CSS sync completed for all apps!');
}

// Function to start file watcher
function startFileWatcher() {
  const frontendStylesDir = path.join(__dirname, '..', 'frontend', 'src', 'styles');
  
  if (!fs.existsSync(frontendStylesDir)) {
    console.log(`❌ Frontend styles directory not found: ${frontendStylesDir}`);
    return;
  }
  
  console.log(`👁️  Starting file watcher for: ${frontendStylesDir}`);
  
  // Watch for changes in CSS files
  const watcher = chokidar.watch(path.join(frontendStylesDir, '*.css'), {
    ignored: /node_modules/,
    persistent: true,
    awaitWriteFinish: {
      stabilityThreshold: 500,
      pollInterval: 100
    }
  });
  
  watcher.on('change', (filePath) => {
    const fileName = path.basename(filePath);
    console.log(`\n🔄 CSS file changed: ${fileName}`);
    console.log(`📅 Time: ${new Date().toLocaleString()}`);
    
    // Sync to all apps
    syncCSSToAllApps();
  });
  
  watcher.on('error', (error) => {
    console.error('❌ File watcher error:', error);
  });
  
  console.log('✅ File watcher started successfully!');
  console.log('📝 Watching for changes in CSS files...');
  console.log('🛑 Press Ctrl+C to stop watching\n');
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'sync':
      if (args[1]) {
        // Sync to specific app
        const appName = args[1];
        console.log(`🔄 Syncing CSS to app: ${appName}`);
        const success = syncCSSToApp(appName);
        if (success) {
          console.log(`✅ Successfully synced CSS to ${appName}`);
        } else {
          console.log(`❌ Failed to sync CSS to ${appName}`);
        }
      } else {
        // Sync to all apps
        syncCSSToAllApps();
      }
      break;
      
    case 'watch':
      // Start file watcher
      startFileWatcher();
      break;
      
    default:
      console.log(`
📋 CSS Sync Utility for Generated Apps

Usage:
  node scripts/sync-css.js sync [appName]  - Sync CSS to specific app or all apps
  node scripts/sync-css.js watch          - Watch for changes and auto-sync

Examples:
  node scripts/sync-css.js sync akhil     - Sync CSS to 'akhil' app only
  node scripts/sync-css.js sync           - Sync CSS to all generated apps
  node scripts/sync-css.js watch          - Start file watcher for auto-sync

Available apps:
${getAvailableApps().map(app => `  - ${app}`).join('\n')}
      `);
      break;
  }
}

// Helper function to get available apps
function getAvailableApps() {
  const generatedAppsDir = path.join(__dirname, '..', 'generated-apps');
  
  if (!fs.existsSync(generatedAppsDir)) {
    return [];
  }
  
  return fs.readdirSync(generatedAppsDir).filter(dir => {
    const appPath = path.join(generatedAppsDir, dir);
    return fs.statSync(appPath).isDirectory();
  });
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  syncCSSToApp,
  syncCSSToAllApps,
  startFileWatcher,
  transformCSSForGeneratedApp
}; 