const fs = require('fs');
const path = require('path');
const { copyTemplateDirectory, loadAndProcessTemplate } = require('./utils/templateProcessor');

// Import the optimized deployer for dynamic port assignment
const OptimizedDeployer = require('../scripts/optimizedDeployer.js');
const deployer = new OptimizedDeployer();

/**
 * Generate backend application structure
 * @param {string} baseDir - Base directory for the project
 * @param {Object} formData - Form data with app configuration
 */
function generateBackend(baseDir, formData) {
  const { appName } = formData;
  
  const backendDir = path.join(baseDir, 'backend');
  
  // Get dynamic port for this backend
  const dynamicPort = deployer.findAvailablePort();
  
  // Create variables for template replacement
  const variables = {
    projectFolderName: appName?.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'my-admin-app',
    dynamicPort: dynamicPort
  };

  // Copy complete application-backend structure
  copyApplicationBackendStructure(backendDir, variables);

  console.log('Backend generated successfully');
}

/**
 * Generate routes directory and files
 */
function generateRoutes(backendDir, variables) {
  const routesDir = path.join(backendDir, 'routes');
  fs.mkdirSync(routesDir, { recursive: true });

  // Generate index.js route file
  const indexRouteTemplate = path.join(__dirname, 'templates', 'backend', 'routes', 'index.js.template');
  if (fs.existsSync(indexRouteTemplate)) {
    const indexRouteContent = loadAndProcessTemplate(indexRouteTemplate, variables);
    const indexRoutePath = path.join(routesDir, 'index.js');
    fs.writeFileSync(indexRoutePath, indexRouteContent);
  }
}

/**
 * Generate Prisma schema
 */
function generatePrismaSchema(backendDir, variables) {
  const prismaDir = path.join(backendDir, 'prisma');
  fs.mkdirSync(prismaDir, { recursive: true });

  // Check if db_schema.txt exists in AdminModule
  const dbSchemaPath = path.join(__dirname, '..', 'db_schema.txt');
  const targetSchemaPath = path.join(prismaDir, 'schema.prisma');

  if (fs.existsSync(dbSchemaPath)) {
    fs.copyFileSync(dbSchemaPath, targetSchemaPath);
    console.log('Copied db_schema.txt to', targetSchemaPath);
  } else {
    // Generate default schema
    const schemaTemplate = path.join(__dirname, 'templates', 'backend', 'prisma', 'schema.prisma.template');
    if (fs.existsSync(schemaTemplate)) {
      const schemaContent = loadAndProcessTemplate(schemaTemplate, variables);
      fs.writeFileSync(targetSchemaPath, schemaContent);
    } else {
      // Fallback schema
      const fallbackSchema = `// Example Prisma schema
// Replace this with your actual schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Example model
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}`;
      fs.writeFileSync(targetSchemaPath, fallbackSchema);
    }
    console.log('Generated example schema.prisma');
  }
}

/**
 * Copy complete application-backend structure
 */
function copyApplicationBackendStructure(backendDir, variables) {
  const sourceBackendDir = path.join(__dirname, '..', 'application-backend');
  
  if (!fs.existsSync(sourceBackendDir)) {
    console.error('application-backend directory not found');
    return;
  }

  // Create backend directory
  fs.mkdirSync(backendDir, { recursive: true });

  // Copy all files and directories from application-backend
  copyDirectoryRecursive(sourceBackendDir, backendDir);

  // Update server.js with dynamic port
  updateServerWithDynamicPort(backendDir, variables);

  // Create .env file with dynamic port
  createEnvFile(backendDir, variables);

  // Update package.json with dynamic port
  updatePackageJson(backendDir, variables);

  console.log('✅ Copied complete application-backend structure');
}

/**
 * Copy directory recursively
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
 * Update server.js with dynamic port
 */
function updateServerWithDynamicPort(backendDir, variables) {
  const serverPath = path.join(backendDir, 'server.js');
  
  if (fs.existsSync(serverPath)) {
    let serverContent = fs.readFileSync(serverPath, 'utf8');
    
    // Replace hardcoded port with dynamic port
    serverContent = serverContent.replace(
      /const PORT = process\.env\.PORT \|\| \d+/,
      `const PORT = process.env.PORT || ${variables.dynamicPort}`
    );
    
    fs.writeFileSync(serverPath, serverContent);
    console.log('✅ Updated server.js with dynamic port');
  }
}

/**
 * Create .env file with dynamic port
 */
function createEnvFile(backendDir, variables) {
  const envContent = `# Backend Environment Configuration
NODE_ENV=development
PORT=${variables.dynamicPort}

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/${variables.projectFolderName}_db?schema=public

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=4h

# App Configuration
APP_NAME=${variables.projectFolderName}
APP_VERSION=1.0.0

# CORS Configuration
CORS_ORIGIN=http://localhost:1700

# Logging Configuration
LOG_LEVEL=debug
ENABLE_REQUEST_LOGGING=true

# Feature Flags
ENABLE_SWAGGER=true
ENABLE_RATE_LIMITING=true
`;
  
  const envPath = path.join(backendDir, '.env');
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file with dynamic port');
}

/**
 * Update package.json with app name
 */
function updatePackageJson(backendDir, variables) {
  const packagePath = path.join(backendDir, 'package.json');
  
  if (fs.existsSync(packagePath)) {
    let packageContent = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    
    // Update package name
    packageJson.name = `${variables.projectFolderName}-backend`;
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Updated package.json with app name');
  }
}

module.exports = { generateBackend }; 