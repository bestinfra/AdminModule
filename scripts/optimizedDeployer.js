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
    this.apacheConfigPath = 'C:/xampp/apache/conf/extra';
    this.apacheMainConfigPath = 'C:/xampp/apache/conf/httpd.conf';
    this.portRegistryPath = path.join(__dirname, '..', 'data', 'port-registry.json');
    this.startPort = 4001;
    this.lastAssignedPort = null; // Added to track the last assigned port
    
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

  // Insert admin credentials into the database
  async insertAdminCredentials(appName, dbName, credentials) {
    if (!Client) {
      console.warn(`⚠️  Cannot insert credentials: pg module not available`);
      return;
    }
    
    try {
      console.log(`👤 Inserting admin credentials for ${appName}...`);
      
      const client = new Client({
        host: this.dbConfig.host,
        port: this.dbConfig.port,
        user: this.dbConfig.user,
        password: this.dbConfig.password,
        database: dbName
      });
      
      await client.connect();
      
      // Hash the password using bcrypt
      const bcrypt = require('bcrypt');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(credentials.adminPassword, saltRounds);
      
      // Check if user already exists
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1 OR username = $2',
        [credentials.adminEmail, credentials.adminUsername]
      );
      
      if (existingUser.rows.length > 0) {
        console.log(`⚠️  Admin user already exists in database ${dbName}`);
        await client.end();
        return;
      }
      
      // Insert admin user
      const insertUserQuery = `
        INSERT INTO users (
          username, 
          email, 
          password, 
          "firstName", 
          "lastName", 
          phone, 
          "isActive", 
          "accessLevel",
          "createdAt",
          "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        RETURNING id
      `;
      
      const userResult = await client.query(insertUserQuery, [
        credentials.adminUsername,
        credentials.adminEmail,
        hashedPassword,
        credentials.adminFirstName,
        credentials.adminLastName,
        credentials.adminPhone || null,
        true,
        'ADMIN'
      ]);
      
      const userId = userResult.rows[0].id;
      console.log(`   ✅ Admin user created with ID: ${userId}`);
      
      // Create default roles if they don't exist
      const roles = ['ADMIN', 'USER'];
      for (const roleName of roles) {
        const roleExists = await client.query(
          'SELECT id FROM roles WHERE name = $1',
          [roleName]
        );
        
        if (roleExists.rows.length === 0) {
          await client.query(
            'INSERT INTO roles (name) VALUES ($1)',
            [roleName]
          );
          console.log(`   ✅ Created role: ${roleName}`);
        }
      }
      
      // Assign admin role to the user
      const adminRole = await client.query(
        "SELECT id FROM roles WHERE name = 'ADMIN'"
      );
      
      if (adminRole.rows.length > 0) {
        await client.query(
          'INSERT INTO user_roles ("userId", "roleId") VALUES ($1, $2)',
          [userId, adminRole.rows[0].id]
        );
        console.log(`   ✅ Assigned ADMIN role to user`);
      }
      
      await client.end();
      console.log(`✅ Admin credentials inserted successfully for ${appName}`);
      
    } catch (error) {
      console.error(`❌ Failed to insert admin credentials:`, error.message);
      
      // Try fallback method using direct SQL
      try {
        console.log(`🔄 Trying fallback method for credential insertion...`);
        const insertCommand = `psql -h ${this.dbConfig.host} -p ${this.dbConfig.port} -U ${this.dbConfig.user} -d ${dbName} -c "INSERT INTO users (username, email, password, \\"firstName\\", \\"lastName\\", \\"isActive\\", \\"accessLevel\\", \\"createdAt\\", \\"updatedAt\\") VALUES ('${credentials.adminUsername}', '${credentials.adminEmail}', '${credentials.adminPassword}', '${credentials.adminFirstName}', '${credentials.adminLastName}', true, 'ADMIN', NOW(), NOW());"`;
        
        const env = { ...process.env, PGPASSWORD: this.dbConfig.password };
        
        execSync(insertCommand, { 
          env,
          stdio: 'pipe',
          encoding: 'utf8'
        });
        
        console.log(`✅ Admin credentials inserted using fallback method`);
        
      } catch (psqlError) {
        console.error(`❌ Fallback method also failed:`, psqlError.message);
        console.log(`⚠️  You may need to manually insert admin credentials into database ${dbName}`);
      }
    }
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
        "dotenv": "^16.0.3",
        "bcrypt": "^6.0.0"
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
  async deployBackend(appName, backendPath, credentials = null) {
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
      
      console.log(`\n🗄️  Setting up database for ${appName}...`);
      const dbName = await this.createSubAppDatabase(appName);
      
      // Copy backend to XAMPP (now also updates server.js port)
      const targetPath = this.copyBackendToXampp(appName, backendPath);
      
      // Create optimized files (skip server.js, only update .env, package.json, etc.)
      this.createOptimizedPackageJson(appName);
      this.createEnvFile(appName, port);
      this.createPm2Config(appName, port);
      this.createLogsDirectory(appName);
      
      await this.runPrismaMigrations(appName, dbName);
      
      // Insert admin credentials if provided
      if (credentials) {
        await this.insertAdminCredentials(appName, dbName, credentials);
      }
      
      // Update port registry
      this.updatePortRegistry(appName, port);
      
      // Install dependencies and start
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
    console.log('  node optimizedDeployer.js deploy <app-name> <backend-path> [credentials-file]');
    console.log('  node optimizedDeployer.js list');
    console.log('  node optimizedDeployer.js create-db <app-name>');
    console.log('');
    console.log('Credentials file should be a JSON file with:');
    console.log('  {');
    console.log('    "adminFirstName": "Admin",');
    console.log('    "adminLastName": "User",');
    console.log('    "adminEmail": "admin@example.com",');
    console.log('    "adminUsername": "admin",');
    console.log('    "adminPassword": "password123",');
    console.log('    "adminPhone": "+1234567890"');
    console.log('  }');
    process.exit(1);
  }
  
  const command = args[0];
  
  switch (command) {
    case 'deploy':
      if (args.length < 3) {
        console.error('Usage: node optimizedDeployer.js deploy <app-name> <backend-path> [credentials-file]');
        process.exit(1);
      }
      (async () => {
        try {
          let credentials = null;
          
          // Load credentials from file if provided
          if (args[3]) {
            try {
              const credentialsPath = path.resolve(args[3]);
              if (fs.existsSync(credentialsPath)) {
                const credentialsData = fs.readFileSync(credentialsPath, 'utf8');
                credentials = JSON.parse(credentialsData);
                console.log(`📋 Loaded credentials from: ${credentialsPath}`);
              } else {
                console.warn(`⚠️  Credentials file not found: ${credentialsPath}`);
              }
            } catch (error) {
              console.warn(`⚠️  Failed to load credentials: ${error.message}`);
            }
          }
          
          const result = await deployer.deployBackend(args[1], args[2], credentials);
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