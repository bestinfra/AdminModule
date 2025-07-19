const fs = require('fs');
const path = require('path');
const { copyTemplateDirectory, loadAndProcessTemplate } = require('./utils/templateProcessor');

/**
 * Generate backend application structure
 * @param {string} baseDir - Base directory for the project
 * @param {Object} formData - Form data with app configuration
 */
function generateBackend(baseDir, formData) {
  const { appName } = formData;
  
  const backendDir = path.join(baseDir, 'backend');
  
  // Create variables for template replacement
  const variables = {
    projectFolderName: appName?.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'my-admin-app'
  };

  // Copy template directory
  const templateDir = path.join(__dirname, 'templates', 'backend');
  copyTemplateDirectory(templateDir, backendDir, variables);

  // Generate additional backend files
  generateRoutes(backendDir, variables);
  generatePrismaSchema(backendDir, variables);
  generateEnvFile(backendDir, variables);

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
 * Generate environment file
 */
function generateEnvFile(backendDir, variables) {
  const envTemplate = path.join(__dirname, 'templates', 'backend', 'env.template');
  const envContent = loadAndProcessTemplate(envTemplate, variables);
  const envPath = path.join(backendDir, '.env');
  fs.writeFileSync(envPath, envContent);
}

module.exports = { generateBackend }; 