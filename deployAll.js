#!/usr/bin/env node

const BackendDeployer = require('./scripts/deployBackend.js');

class StandaloneDeployer {
  constructor() {
    this.deployer = new BackendDeployer();
  }

  // Deploy all backends from generated-apps
  deployAllBackends() {
    const generatedAppsPath = path.join(__dirname, 'generated-apps');
    
    if (!fs.existsSync(generatedAppsPath)) {
      console.log('No generated-apps directory found');
      return;
    }

    const apps = fs.readdirSync(generatedAppsPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(`Found ${apps.length} apps to deploy:`, apps);

    apps.forEach(appName => {
      const backendPath = path.join(generatedAppsPath, appName, 'backend');
      
      if (fs.existsSync(backendPath)) {
        console.log(`\n🚀 Deploying ${appName}...`);
        const result = this.deployer.deployBackend(appName, backendPath);
        
        if (result.success) {
          console.log(`✅ ${appName} deployed successfully!`);
        } else {
          console.log(`❌ ${appName} deployment failed: ${result.error}`);
        }
      } else {
        console.log(`⚠️  No backend found for ${appName}`);
      }
    });
  }

  // Deploy specific app
  deployApp(appName) {
    const backendPath = path.join(__dirname, 'generated-apps', appName, 'backend');
    
    if (!fs.existsSync(backendPath)) {
      console.error(`Backend not found for ${appName} at ${backendPath}`);
      return false;
    }

    console.log(`🚀 Deploying ${appName}...`);
    const result = this.deployer.deployBackend(appName, backendPath);
    
    if (result.success) {
      console.log(`✅ ${appName} deployed successfully!`);
      return true;
    } else {
      console.log(`❌ ${appName} deployment failed: ${result.error}`);
      return false;
    }
  }
}

// CLI interface
if (require.main === module) {
  const deployer = new StandaloneDeployer();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node deployAll.js                    # Deploy all apps');
    console.log('  node deployAll.js <app-name>         # Deploy specific app');
    console.log('  node deployAll.js list               # List deployed apps');
    console.log('  node deployAll.js remove <app-name>  # Remove deployed app');
    process.exit(1);
  }
  
  const command = args[0];
  
  switch (command) {
    case 'list':
      deployer.deployer.listDeployedApps();
      break;
      
    case 'remove':
      if (args.length < 2) {
        console.error('Usage: node deployAll.js remove <app-name>');
        process.exit(1);
      }
      deployer.deployer.removeDeployedApp(args[1]);
      break;
      
    default:
      // Check if it's an app name
      const appName = command;
      deployer.deployApp(appName);
      break;
  }
}

module.exports = StandaloneDeployer;
