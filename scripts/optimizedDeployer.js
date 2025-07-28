const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Lazy load pg module only when needed
let Client;
try {
  const pg = require('pg');
  Client = pg.Client;
} catch (error) {
  console.warn('⚠️  pg module not found. Database functionality will be disabled.');
}

class OptimizedDeployer {
  constructor() {
    this.xamppHtdocsPath = 'C:/xampp/htdocs';
    this.portRegistryPath = path.join(__dirname, '..', 'data', 'port-registry.json');
    this.startPort = 4001;
    this.lastAssignedPort = null;
    
    // Database configuration
    this.dbConfig = {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'root1234',
      templateDb: 'subapp_db'
    };
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

  // Copy directory recursively
  copyDirectory(source, destination) {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    const items = fs.readdirSync(source);
    items.forEach((item) => {
      const sourcePath = path.join(source, item);
      const destPath = path.join(destination, item);

      if (fs.statSync(sourcePath).isDirectory()) {
        this.copyDirectory(sourcePath, destPath);
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
    });
  }

  // Copy backend to XAMPP
  copyBackendToXampp(appName, backendPath) {
    const targetPath = path.join(this.xamppHtdocsPath, `${appName}-backend`);
    
    if (fs.existsSync(targetPath)) {
      console.log(`Removing existing backend at ${targetPath}`);
      try {
        execSync(`rmdir /s /q "${targetPath}"`, { stdio: 'ignore' });
      } catch (error) {
        try {
          execSync(`powershell -Command "Remove-Item -Path '${targetPath}' -Recurse -Force"`, { stdio: 'ignore' });
        } catch (psError) {
          try {
            fs.rmSync(targetPath, { recursive: true, force: true });
          } catch (fsError) {
            console.log(`⚠️  Could not remove existing backend, will overwrite files instead`);
          }
        }
      }
    }

    console.log(`Copying backend from ${backendPath} to ${targetPath}`);
    this.copyDirectory(backendPath, targetPath);

    // Update server.js port
    const serverPath = path.join(targetPath, 'server.js');
    if (fs.existsSync(serverPath)) {
      let serverContent = fs.readFileSync(serverPath, 'utf8');
      serverContent = serverContent.replace(/const PORT = process\.env\.PORT \|\| \d+/, `const PORT = process.env.PORT || ${this.lastAssignedPort}`);
      fs.writeFileSync(serverPath, serverContent);
      console.log(`✅ Updated server.js with dynamic port`);
    }
    
    return targetPath;
  }

  // Create database for sub-app
  async createSubAppDatabase(appName) {
    const dbName = `${appName}_db`;
    
    if (!Client) {
      console.warn(`⚠️  Cannot create database ${dbName}: pg module not available`);
      return dbName;
    }
    
    try {
      console.log(`🗄️  Creating database: ${dbName}`);
      
      const client = new Client({
        host: this.dbConfig.host,
        port: this.dbConfig.port,
        user: this.dbConfig.user,
        password: this.dbConfig.password,
        database: 'postgres'
      });
      
      await client.connect();
      
      const dbExistsResult = await client.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [dbName]
      );
      
      if (dbExistsResult.rows.length > 0) {
        console.log(`⚠️  Database ${dbName} already exists, skipping creation`);
        await client.end();
        return dbName;
      }
      
      const templateExistsResult = await client.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [this.dbConfig.templateDb]
      );
      
      if (templateExistsResult.rows.length === 0) {
        console.log(`⚠️  Template database ${this.dbConfig.templateDb} not found, creating empty database`);
        await client.query(`CREATE DATABASE "${dbName}"`);
      } else {
        console.log(`📋 Copying structure from template database: ${this.dbConfig.templateDb}`);
        
        await client.query(`CREATE DATABASE "${dbName}" TEMPLATE "${this.dbConfig.templateDb}"`);
        
        await client.end();
        
        const newDbClient = new Client({
          host: this.dbConfig.host,
          port: this.dbConfig.port,
          user: this.dbConfig.user,
          password: this.dbConfig.password,
          database: dbName
        });
        
        await newDbClient.connect();
        
        const tablesResult = await newDbClient.query(`
          SELECT tablename 
          FROM pg_tables 
          WHERE schemaname = 'public' 
          AND tablename NOT LIKE 'pg_%' 
          AND tablename NOT LIKE 'sql_%'
        `);
        
        for (const table of tablesResult.rows) {
          try {
            await newDbClient.query(`TRUNCATE TABLE "${table.tablename}" RESTART IDENTITY CASCADE`);
            console.log(`   ✅ Cleared data from table: ${table.tablename}`);
          } catch (error) {
            console.log(`   ⚠️  Could not clear table ${table.tablename}: ${error.message}`);
          }
        }
        
        await newDbClient.end();
      }
      
      console.log(`✅ Database ${dbName} created successfully`);
      return dbName;
      
    } catch (error) {
      console.error(`❌ Failed to create database ${dbName}:`, error.message);
      
      try {
        console.log(`🔄 Trying fallback method using psql...`);
        const createDbCommand = `psql -h ${this.dbConfig.host} -p ${this.dbConfig.port} -U ${this.dbConfig.user} -d postgres -c "CREATE DATABASE \\"${dbName}\\";"`;
        
        const env = { ...process.env, PGPASSWORD: this.dbConfig.password };
        
        execSync(createDbCommand, { 
          env,
          stdio: 'pipe',
          encoding: 'utf8'
        });
        
        console.log(`✅ Database ${dbName} created using fallback method`);
        return dbName;
        
      } catch (psqlError) {
        console.error(`❌ Fallback method also failed:`, psqlError.message);
        throw new Error(`Could not create database ${dbName}. Please ensure PostgreSQL is running and accessible.`);
      }
    }
  }

  // Run Prisma migrations on the new database
  async runPrismaMigrations(appName, dbName) {
    const backendPath = path.join(this.xamppHtdocsPath, `${appName}-backend`);
    
    if (!Client) {
      console.warn(`⚠️  Cannot run Prisma migrations: pg module not available`);
      return;
    }
    
    try {
      console.log(`🔄 Running Prisma migrations for ${dbName}...`);
      
      const originalCwd = process.cwd();
      process.chdir(backendPath);
      
      const databaseUrl = `postgresql://${this.dbConfig.user}:${this.dbConfig.password}@${this.dbConfig.host}:${this.dbConfig.port}/${dbName}?schema=public`;
      process.env.DATABASE_URL = databaseUrl;
      
      try {
        console.log(`   📤 Running prisma db push...`);
        execSync('npx prisma db push', { 
          stdio: 'pipe',
          encoding: 'utf8',
          env: { ...process.env, DATABASE_URL: databaseUrl }
        });
        console.log(`   ✅ Prisma db push completed successfully`);
      } catch (pushError) {
        console.log(`   ⚠️  Prisma db push failed, trying migrate deploy...`);
        
        try {
          execSync('npx prisma migrate deploy', { 
            stdio: 'pipe',
            encoding: 'utf8',
            env: { ...process.env, DATABASE_URL: databaseUrl }
          });
          console.log(`   ✅ Prisma migrate deploy completed successfully`);
        } catch (migrateError) {
          console.log(`   ⚠️  Prisma migrate deploy also failed, trying generate...`);
          
          execSync('npx prisma generate', { 
            stdio: 'pipe',
            encoding: 'utf8',
            env: { ...process.env, DATABASE_URL: databaseUrl }
          });
          console.log(`   ✅ Prisma client generated successfully`);
        }
      }
      
      process.chdir(originalCwd);
      
    } catch (error) {
      console.error(`❌ Failed to run Prisma operations:`, error.message);
    }
  }

  // Create .env file
  createEnvFile(appName, port) {
    const backendPath = path.join(this.xamppHtdocsPath, `${appName}-backend`);
    const envPath = path.join(backendPath, '.env');
    
    const dbName = `${appName}_db`;
    
    const envContent = `# Environment configuration for ${appName}-backend
NODE_ENV=development
PORT=${port}

# Database configuration - Dynamic database for this sub-app
DATABASE_URL=postgresql://${this.dbConfig.user}:${this.dbConfig.password}@${this.dbConfig.host}:${this.dbConfig.port}/${dbName}?schema=public

# JWT configuration (optional)
# JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
# JWT_EXPIRES_IN=4h

# CORS configuration
CORS_ORIGIN=https://www.${appName}.bestinfra.app

# Logging
LOG_LEVEL=debug

# App specific
APP_NAME=${appName}-backend
APP_VERSION=1.0.0
`;

    fs.writeFileSync(envPath, envContent);
    console.log(`✅ Created .env file for ${appName} backend with database: ${dbName}`);
  }

  // Create package.json
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
        "dotenv": "^16.0.3",
        "pg": "^8.11.3",
        "@prisma/client": "^5.12.0"
      },
      "devDependencies": {
        "nodemon": "^3.0.0",
        "prisma": "^5.12.0"
      }
    };

    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log(`✅ Created optimized package.json for ${appName} backend`);
  }

  // Install dependencies and start
  installAndStart(appName) {
    const backendPath = path.join(this.xamppHtdocsPath, `${appName}-backend`);
    
    console.log(`🚀 Installing dependencies and starting ${appName} backend...`);
    
    try {
      process.chdir(backendPath);
      
      console.log(`📦 Installing dependencies...`);
      execSync('npm install', { stdio: 'inherit' });
      
      console.log(`✅ ${appName} backend setup completed successfully!`);
      
    } catch (error) {
      console.error(`❌ Failed to install dependencies:`, error.message);
    }
  }

  // Main deployment method
  async deployBackend(appName, backendPath) {
    console.log(`\n🚀 Starting optimized backend deployment for: ${appName}`);
    console.log(`📁 Backend source: ${backendPath}`);
    
    try {
      if (!fs.existsSync(this.xamppHtdocsPath)) {
        throw new Error(`XAMPP htdocs directory not found at ${this.xamppHtdocsPath}`);
      }
      
      const port = this.findAvailablePort();
      this.lastAssignedPort = port;
      console.log(`🔌 Assigned port: ${port}`);
      
      console.log(`\n🗄️  Setting up database for ${appName}...`);
      const dbName = await this.createSubAppDatabase(appName);
      
      const targetPath = this.copyBackendToXampp(appName, backendPath);
      
      this.createOptimizedPackageJson(appName);
      this.createEnvFile(appName, port);
      
      await this.runPrismaMigrations(appName, dbName);
      
      this.updatePortRegistry(appName, port);
      
      this.installAndStart(appName);
      
      console.log(`\n✅ Optimized backend deployment completed successfully!`);
      console.log(`📊 Deployment Summary:`);
      console.log(`   • App Name: ${appName}`);
      console.log(`   • Backend Path: ${targetPath}`);
      console.log(`   • Port: ${port}`);
      console.log(`   • Database: ${dbName}`);
      console.log(`   • Root URL: http://localhost:${port}/`);
      console.log(`   • Health Check: http://localhost:${port}/api/health`);
      
      return {
        success: true,
        appName,
        port,
        targetPath,
        database: dbName,
        rootUrl: `http://localhost:${port}/`,
        healthUrl: `http://localhost:${port}/api/health`
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
    console.log('  node optimizedDeployer.js create-db <app-name>');
    process.exit(1);
  }
  
  const command = args[0];
  
  switch (command) {
    case 'deploy':
      if (args.length < 3) {
        console.error('Usage: node optimizedDeployer.js deploy <app-name> <backend-path>');
        process.exit(1);
      }
      (async () => {
        try {
          const result = await deployer.deployBackend(args[1], args[2]);
          process.exit(result.success ? 0 : 1);
        } catch (error) {
          console.error('Deployment failed:', error.message);
          process.exit(1);
        }
      })();
      break;
      
    case 'create-db':
      if (args.length < 2) {
        console.error('Usage: node optimizedDeployer.js create-db <app-name>');
        process.exit(1);
      }
      (async () => {
        try {
          const dbName = await deployer.createSubAppDatabase(args[1]);
          console.log(`✅ Database ${dbName} created successfully`);
          process.exit(0);
        } catch (error) {
          console.error('Database creation failed:', error.message);
          process.exit(1);
        }
      })();
      break;
      
    case 'list':
      deployer.listDeployedApps();
      break;
      
    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
} 