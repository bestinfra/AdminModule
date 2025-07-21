const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class OptimizedDeployer {
  constructor() {
    this.xamppHtdocsPath = 'C:/xampp/htdocs';
    this.apacheConfigPath = 'C:/xampp/apache/conf/extra';
    this.apacheMainConfigPath = 'C:/xampp/apache/conf/httpd.conf';
    this.portRegistryPath = path.join(__dirname, '..', 'data', 'port-registry.json');
    this.startPort = 4001;
    this.lastAssignedPort = null; // Added to track the last assigned port
  }

  // Initialize port registry
  initializePortRegistry() {
    const dataDir = path.dirname(this.portRegistryPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(this.portRegistryPath)) {
      const initialRegistry = {
        nextPort: this.startPort,
        deployedApps: {}
      };
      fs.writeFileSync(this.portRegistryPath, JSON.stringify(initialRegistry, null, 2));
    }
  }

  // Find available port
  findAvailablePort() {
    this.initializePortRegistry();
    const registry = JSON.parse(fs.readFileSync(this.portRegistryPath, 'utf8'));
    let port = registry.nextPort;
    
    // Check if port is available
    try {
      const netstat = execSync(`netstat -an | findstr :${port}`, { encoding: 'utf8' });
      while (netstat.includes(`:${port}`)) {
        port++;
      }
    } catch (error) {
      // Port is available if netstat fails
    }
    
    return port;
  }

  // Update port registry
  updatePortRegistry(appName, port) {
    const registry = JSON.parse(fs.readFileSync(this.portRegistryPath, 'utf8'));
    registry.deployedApps[appName] = {
      port,
      deployedAt: new Date().toISOString(),
      path: path.join(this.xamppHtdocsPath, `${appName}-backend`)
    };
    registry.nextPort = port + 1;
    fs.writeFileSync(this.portRegistryPath, JSON.stringify(registry, null, 2));
  }

  // Copy backend to XAMPP
  copyBackendToXampp(appName, backendPath) {
    const targetPath = path.join(this.xamppHtdocsPath, `${appName}-backend`);
    
    if (fs.existsSync(targetPath)) {
      console.log(`Removing existing backend at ${targetPath}`);
      try {
        // Use a more robust deletion method for Windows
        const { execSync } = require('child_process');
        execSync(`rmdir /s /q "${targetPath}"`, { stdio: 'ignore' });
      } catch (error) {
        // If rmdir fails, try using PowerShell
        try {
          execSync(`powershell -Command "Remove-Item -Path '${targetPath}' -Recurse -Force"`, { stdio: 'ignore' });
        } catch (psError) {
          // If both fail, try fs.rmSync as fallback
          try {
            fs.rmSync(targetPath, { recursive: true, force: true });
          } catch (fsError) {
            console.log(`⚠️  Could not remove existing backend, will overwrite files instead`);
            // Don't throw error, just continue with overwrite
          }
        }
      }
    }

    console.log(`Copying backend from ${backendPath} to ${targetPath}`);
    this.copyDirectory(backendPath, targetPath);

    // After copying, update the port in server.js (always use the copied file)
    const serverPath = path.join(targetPath, 'server.js');
    if (fs.existsSync(serverPath)) {
      let serverContent = fs.readFileSync(serverPath, 'utf8');
      // Replace the port assignment line
      serverContent = serverContent.replace(/const PORT = process\.env\.PORT \|\| \d+/, `const PORT = process.env.PORT || ${this.lastAssignedPort}`);
      fs.writeFileSync(serverPath, serverContent);
      console.log(`✅ Updated server.js with dynamic port (copied from application-backend)`);
    }
    return targetPath;
  }

  // Copy directory recursively
  copyDirectory(source, destination) {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    const items = fs.readdirSync(source);
    
    for (const item of items) {
      const sourcePath = path.join(source, item);
      const destPath = path.join(destination, item);
      
      if (fs.statSync(sourcePath).isDirectory()) {
        this.copyDirectory(sourcePath, destPath);
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
    }
  }

  // Create optimized server.js with environment logging
  createOptimizedServer(appName, port) {
    const backendPath = path.join(this.xamppHtdocsPath, `${appName}-backend`);
    const serverPath = path.join(backendPath, 'server.js');
    
    const serverCode = `const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || ${port};
const NODE_ENV = process.env.NODE_ENV || 'development';

// Environment logging
console.log('\\n🚀 ========================================');
console.log('   BACKEND STARTUP INFORMATION');
console.log('========================================');
console.log(\`📱 App Name: ${appName}-backend\`);
console.log(\`🌍 Environment: \${NODE_ENV.toUpperCase()}\`);
console.log(\`🔌 Port: \${PORT}\`);
console.log(\`⏰ Start Time: \${new Date().toISOString()}\`);
console.log(\`📁 Directory: \${__dirname}\`);
console.log('========================================\\n');

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const userAgent = req.get('User-Agent') || 'Unknown';
    
    console.log(\`[\${timestamp}] \${method} \${url} - \${userAgent}\`);
    next();
});

// Root route with environment info
app.get('/', (req, res) => {
    res.json({
        message: '${appName} Backend API is running!',
        environment: NODE_ENV,
        timestamp: new Date().toISOString(),
        port: PORT,
        app: '${appName}-backend',
        mode: NODE_ENV === 'production' ? 'PRODUCTION' : 'DEVELOPMENT',
        endpoints: {
            health: '/api/health',
            test: '/api/test',
            env: '/api/env'
        }
    });
});

// Health check with environment info
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        environment: NODE_ENV,
        timestamp: new Date().toISOString(),
        message: '${appName} Backend is healthy',
        mode: NODE_ENV === 'production' ? 'PRODUCTION' : 'DEVELOPMENT',
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// Environment info endpoint
app.get('/api/env', (req, res) => {
    res.json({
        environment: NODE_ENV,
        mode: NODE_ENV === 'production' ? 'PRODUCTION' : 'DEVELOPMENT',
        port: PORT,
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Test endpoint working!',
        environment: NODE_ENV,
        data: {
            app: '${appName}',
            port: PORT,
            mode: NODE_ENV === 'production' ? 'PRODUCTION' : 'DEVELOPMENT',
            time: new Date().toISOString()
        }
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        environment: NODE_ENV,
        error: \`Cannot \${req.method} \${req.originalUrl}\`
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        environment: NODE_ENV,
        error: NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

app.listen(PORT, () => {
    console.log('\\n✅ ========================================');
    console.log(\`   🚀 ${appName} Backend Started Successfully!\`);
    console.log('========================================');
    console.log(\`📊 Health Check: http://localhost:\${PORT}/api/health\`);
    console.log(\`🌐 Root URL: http://localhost:\${PORT}/\`);
    console.log(\`🔧 Environment: \${NODE_ENV.toUpperCase()}\`);
    console.log(\`📱 App: ${appName}-backend\`);
    console.log(\`⏰ Started: \${new Date().toISOString()}\`);
    console.log('========================================\\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\\n🛑 Shutting down server gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\\n🛑 Shutting down server gracefully...');
    process.exit(0);
});`;

    fs.writeFileSync(serverPath, serverCode);
    console.log(`✅ Created optimized server.js for ${appName} backend`);
  }

  // Create optimized package.json
  createOptimizedPackageJson(appName) {
    const backendPath = path.join(this.xamppHtdocsPath, `${appName}-backend`);
    const packagePath = path.join(backendPath, 'package.json');
    
    const packageJson = {
      "name": `${appName}-backend`,
      "version": "1.0.0",
      "main": "server.js",
      "scripts": {
        "start": "node server.js",
        "dev": "nodemon server.js"
      },
      "dependencies": {
        "express": "^4.18.2",
        "cors": "^2.8.5",
        "dotenv": "^16.0.3"
      },
      "devDependencies": {
        "nodemon": "^3.0.0"
      }
    };

    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log(`✅ Created optimized package.json for ${appName} backend`);
  }

  // Create .env file
  createEnvFile(appName, port) {
    const backendPath = path.join(this.xamppHtdocsPath, `${appName}-backend`);
    const envPath = path.join(backendPath, '.env');
    
    const envContent = `# Environment configuration for ${appName}-backend
NODE_ENV=development
PORT=${port}

# Database configuration
DATABASE_URL=postgresql://postgres:root1234@localhost:5432/subapp_db?schema=public

# JWT configuration (optional)
# JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
# JWT_EXPIRES_IN=4h

# CORS configuration
CORS_ORIGIN=http://${appName}-backend.local

# Logging
LOG_LEVEL=debug

# App specific
APP_NAME=${appName}-backend
APP_VERSION=1.0.0
`;

    fs.writeFileSync(envPath, envContent);
    console.log(`✅ Created .env file for ${appName} backend`);
  }

  // Create PM2 ecosystem config
  createPm2Config(appName, port) {
    const backendPath = path.join(this.xamppHtdocsPath, `${appName}-backend`);
    const ecosystemPath = path.join(backendPath, 'ecosystem.config.js');
    
    const ecosystemConfig = `module.exports = {
  apps: [{
    name: '${appName}-backend',
    script: 'server.js',
    cwd: '${backendPath.replace(/\\/g, '/')}',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: ${port},
      APP_NAME: '${appName}-backend',
      APP_VERSION: '1.0.0'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: ${port},
      APP_NAME: '${appName}-backend',
      APP_VERSION: '1.0.0'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};`;

    fs.writeFileSync(ecosystemPath, ecosystemConfig);
    console.log(`✅ Created PM2 ecosystem config for ${appName} backend`);
  }

  // Create logs directory
  createLogsDirectory(appName) {
    const backendPath = path.join(this.xamppHtdocsPath, `${appName}-backend`);
    const logsPath = path.join(backendPath, 'logs');
    
    if (!fs.existsSync(logsPath)) {
      fs.mkdirSync(logsPath, { recursive: true });
      console.log(`✅ Created logs directory for ${appName} backend`);
    }
  }

  // Install dependencies and start with PM2
  installAndStart(appName) {
    const backendPath = path.join(this.xamppHtdocsPath, `${appName}-backend`);
    
    console.log(`🚀 Installing dependencies and starting ${appName} backend...`);
    
    try {
      // Change to backend directory
      process.chdir(backendPath);
      
      // Ensure @prisma/client and prisma are in package.json
      let pkgPath = path.join(backendPath, 'package.json');
      if (fs.existsSync(pkgPath)) {
        let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        pkg.dependencies = pkg.dependencies || {};
        pkg.devDependencies = pkg.devDependencies || {};
        if (!pkg.dependencies['@prisma/client']) {
          pkg.dependencies['@prisma/client'] = '^5.12.0';
        }
        if (!pkg.devDependencies['prisma']) {
          pkg.devDependencies['prisma'] = '^5.12.0';
        }
        // Ensure all dependencies from application-backend/package.json are present
        const appBackendPkgPath = path.join(__dirname, '..', 'application-backend', 'package.json');
        if (fs.existsSync(appBackendPkgPath)) {
          const appBackendPkg = JSON.parse(fs.readFileSync(appBackendPkgPath, 'utf8'));
          pkg.dependencies = pkg.dependencies || {};
          pkg.devDependencies = pkg.devDependencies || {};
          // Merge dependencies
          if (appBackendPkg.dependencies) {
            for (const [dep, ver] of Object.entries(appBackendPkg.dependencies)) {
              if (!pkg.dependencies[dep]) {
                pkg.dependencies[dep] = ver;
              }
            }
          }
          // Merge devDependencies
          if (appBackendPkg.devDependencies) {
            for (const [dep, ver] of Object.entries(appBackendPkg.devDependencies)) {
              if (!pkg.devDependencies[dep]) {
                pkg.devDependencies[dep] = ver;
              }
            }
          }
        }
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      }
      // Install dependencies
      console.log('📦 Installing dependencies...');
      execSync('npm install', { stdio: 'inherit' });
      // Run prisma generate if schema.prisma exists
      if (fs.existsSync(path.join(backendPath, 'prisma', 'schema.prisma'))) {
        try {
          execSync('npx prisma generate', { stdio: 'inherit' });
        } catch (e) {
          console.warn('⚠️  Prisma generate failed:', e.message);
        }
      }
      // Install PM2 globally if not installed
      try {
        execSync('pm2 --version', { stdio: 'ignore' });
      } catch (error) {
        console.log('📦 Installing PM2 globally...');
        execSync('npm install -g pm2', { stdio: 'inherit' });
      }
      // Start with PM2
      console.log('🔄 Starting with PM2...');
      execSync('pm2 start ecosystem.config.js', { stdio: 'inherit' });
      console.log(`✅ ${appName} backend started successfully with PM2`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to start ${appName} backend:`, error.message);
      return false;
    }
  }

  // Main deployment method
  deployBackend(appName, backendPath) {
    console.log(`\n🚀 Starting optimized backend deployment for: ${appName}`);
    console.log(`📁 Backend source: ${backendPath}`);
    
    try {
      // Check if XAMPP htdocs exists
      if (!fs.existsSync(this.xamppHtdocsPath)) {
        throw new Error(`XAMPP htdocs directory not found at ${this.xamppHtdocsPath}`);
      }
      
      // Find available port
      const port = this.findAvailablePort();
      this.lastAssignedPort = port;
      console.log(`🔌 Assigned port: ${port}`);
      
      // Copy backend to XAMPP (now also updates server.js port)
      const targetPath = this.copyBackendToXampp(appName, backendPath);
      
      // Create optimized files (skip server.js, only update .env, package.json, etc.)
      this.createOptimizedPackageJson(appName);
      this.createEnvFile(appName, port);
      this.createPm2Config(appName, port);
      this.createLogsDirectory(appName);
      
      // Update port registry
      this.updatePortRegistry(appName, port);
      
      // Install dependencies and start
      this.installAndStart(appName);
      
      console.log(`\n✅ Optimized backend deployment completed successfully!`);
      console.log(`📊 Deployment Summary:`);
      console.log(`   • App Name: ${appName}`);
      console.log(`   • Backend Path: ${targetPath}`);
      console.log(`   • Port: ${port}`);
      console.log(`   • Root URL: http://localhost:${port}/`);
      console.log(`   • Health Check: http://localhost:${port}/api/health`);
      console.log(`   • Environment: http://localhost:${port}/api/env`);
      
      return {
        success: true,
        appName,
        port,
        targetPath,
        rootUrl: `http://localhost:${port}/`,
        healthUrl: `http://localhost:${port}/api/health`,
        envUrl: `http://localhost:${port}/api/env`
      };
      
    } catch (error) {
      console.error(`❌ Backend deployment failed:`, error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // List deployed apps
  listDeployedApps() {
    this.initializePortRegistry();
    const registry = JSON.parse(fs.readFileSync(this.portRegistryPath, 'utf8'));
    
    console.log('\n📋 Deployed Backend Applications:');
    console.log('=====================================');
    
    if (Object.keys(registry.deployedApps).length === 0) {
      console.log('No deployed applications found.');
      return;
    }
    
    Object.entries(registry.deployedApps).forEach(([appName, info]) => {
      console.log(`\n🏢 ${appName}:`);
      console.log(`   • Port: ${info.port}`);
      console.log(`   • Path: ${info.path}`);
      console.log(`   • Deployed: ${new Date(info.deployedAt).toLocaleString()}`);
      console.log(`   • Root URL: http://localhost:${info.port}/`);
      console.log(`   • Health: http://localhost:${info.port}/api/health`);
    });
    
    console.log(`\nNext available port: ${registry.nextPort}`);
  }
}

// Export the class
module.exports = OptimizedDeployer;

// CLI interface
if (require.main === module) {
  const deployer = new OptimizedDeployer();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node optimizedDeployer.js deploy <app-name> <backend-path>');
    console.log('  node optimizedDeployer.js list');
    process.exit(1);
  }
  
  const command = args[0];
  
  switch (command) {
    case 'deploy':
      if (args.length < 3) {
        console.error('Usage: node optimizedDeployer.js deploy <app-name> <backend-path>');
        process.exit(1);
      }
      const result = deployer.deployBackend(args[1], args[2]);
      process.exit(result.success ? 0 : 1);
      
    case 'list':
      deployer.listDeployedApps();
      break;
      
    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
} 