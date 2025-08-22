const fs = require('fs');
const path = require('path');
const { loadAndProcessTemplate } = require('./utils/templateProcessor');



/**
 * Generate a filtered backend based on selected modules
 * Returns the generated backend directory path
 * @param {string} baseDir
 * @param {{ appName?: string, modules?: string[] }} formData
 */
function generateBackend(baseDir, formData) {
  const { appName, modules = [] } = formData || {};
  
  const backendDir = path.join(baseDir, 'backend');
  
  const dynamicPort = Math.floor(Math.random() * 1000) + 4000;
  
  const variables = {
    projectFolderName:
      appName
        ?.toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'my-admin-app',
    dynamicPort: dynamicPort,
  };

  // Build a filtered backend folder using mapping
  copyFilteredApplicationBackend(backendDir, modules, variables);

  console.log('Backend generated successfully at', backendDir);
  return backendDir;
}

/**
 * Copy only the necessary backend files based on selected modules
 */
function copyFilteredApplicationBackend(backendDir, selectedModules, variables) {
  const sourceBackendDir = path.join(__dirname, '..', 'application-backend');
  if (!fs.existsSync(sourceBackendDir)) {
    console.error('application-backend directory not found');
    return;
  }

  if (fs.existsSync(backendDir)) {
    try {
      fs.rmSync(backendDir, { recursive: true, force: true });
    } catch (_) {}
  }
  fs.mkdirSync(backendDir, { recursive: true });

  const routesToInclude = resolveBackendRoutesFromModules(selectedModules);

  routesToInclude.add('subAppAuth');
  
  copyIfExists(path.join(sourceBackendDir, 'package.json'), path.join(backendDir, 'package.json'));
  
  copyDirectoryRecursive(path.join(sourceBackendDir, 'prisma'), path.join(backendDir, 'prisma'));
  copyDirectoryRecursive(path.join(sourceBackendDir, 'config'), path.join(backendDir, 'config'));
  copyDirectoryRecursive(path.join(sourceBackendDir, 'utils'), path.join(backendDir, 'utils'));
  copyDirectoryRecursive(path.join(sourceBackendDir, 'middleware'), path.join(backendDir, 'middleware'));
  copyFilteredCronJobs(path.join(sourceBackendDir, 'cron'), path.join(backendDir, 'cron'), routesToInclude);
  copyDirectoryRecursive(path.join(sourceBackendDir, 'sockets'), path.join(backendDir, 'sockets'));
  copyDirectoryRecursive(path.join(sourceBackendDir, 'scripts'), path.join(backendDir, 'scripts'));
  
  generateFilteredServer(backendDir, routesToInclude, variables.dynamicPort);

  const routesDir = path.join(backendDir, 'routes');
  const controllersDir = path.join(backendDir, 'controllers');
  const validationsDir = path.join(backendDir, 'validations');
  const modelsDir = path.join(backendDir, 'models');
  fs.mkdirSync(routesDir, { recursive: true });
  fs.mkdirSync(controllersDir, { recursive: true });
  fs.mkdirSync(validationsDir, { recursive: true });
  fs.mkdirSync(modelsDir, { recursive: true });

  const routeFileMap = {
    meters: 'meters.js',
    consumers: 'consumers.js',
    assets: 'assets.js',
    users: 'users.js',
    roles: 'roles.js',
    billing: 'billing.js',
    prepaidBilling: 'prepaidBilling.js',
    dashboard: 'dashboard.js',
    tickets: 'tickets.js',
    dtrs: 'dtrs.js',
    subAppAuth: 'subAppAuth.js',
    overall: 'overall.js',
  };

  routesToInclude.forEach((key) => {
    const file = routeFileMap[key];
    if (file) {
      const sourceFile = path.join(sourceBackendDir, 'routes', file);
      const destFile = path.join(routesDir, file);
      
      if (fs.existsSync(sourceFile)) {
        copyIfExists(sourceFile, destFile);
      } else {
        console.warn(`Route file not found: ${sourceFile}`);
      }
    }
  });

  const dependencyMap = {
    meters: {
      controllers: ['meterController.js'],
      validations: ['meterValidation.js'],
      models: ['MeterDB.js'],
      dependencies: ['MeterDB.js'],
    },
    consumers: {
      controllers: ['consumerController.js'],
      validations: ['consumerValidation.js'],
      models: ['ConsumerDB.js'],
      dependencies: ['ConsumerDB.js'],
    },
    assets: {
      controllers: ['assetController.js'],
      validations: ['assetValidation.js'],
      models: ['AssetDB.js'],
      dependencies: ['AssetDB.js'],
    },
    users: {
      controllers: ['userController.js'],
      validations: ['userValidation.js'],
      models: ['UserDB.js'],
      dependencies: ['UserDB.js'],
    },
    roles: {
      controllers: ['roleController.js'],
      validations: ['roleValidation.js'],
      models: ['RoleDB.js'],
      dependencies: ['RoleDB.js'],
    },
    billing: {
      controllers: ['billingController.js'],
      validations: [],
      models: ['BillingDB.js'],
      dependencies: ['BillingDB.js'],
    },
    prepaidBilling: {
      controllers: ['prepaidBillingController.js'],
      validations: [],
      models: ['PrepaidBillingDB.js'],
      dependencies: ['PrepaidBillingDB.js'],
    },
    dashboard: {
      controllers: ['dashboardController.js'],
      validations: [],
      models: ['DashboardDB.js'],
      dependencies: ['DashboardDB.js'],
    },
    tickets: {
      controllers: ['ticketController.js'],
      validations: ['ticketValidation.js'],
      models: ['TicketDB.js'],
      dependencies: ['TicketDB.js'],
    },
    dtrs: {
      controllers: ['dtrController.js'],
      validations: [],
      models: ['DTRDB.js'],
      dependencies: ['DTRDB.js'],
    },
    subAppAuth: {
      controllers: ['subAppAuthController.js'],
      validations: [],
      models: [],
      dependencies: [],
    },
    overall: {
      controllers: ['overallController.js'],
      validations: [],
      models: [],
      dependencies: [],
    },
  };

  const uniq = (arr) => Array.from(new Set(arr));
  let controllersToCopy = [];
  let validationsToCopy = [];
  let modelsToCopy = [];
  routesToInclude.forEach((key) => {
    const d = dependencyMap[key];
    if (!d) return;
    controllersToCopy.push(...(d.controllers || []));
    validationsToCopy.push(...(d.validations || []));
    modelsToCopy.push(...(d.models || []));
  });

  controllersToCopy = uniq(controllersToCopy);
  validationsToCopy = uniq(validationsToCopy.concat(['index.js']));
  modelsToCopy = uniq(modelsToCopy);

  controllersToCopy.forEach((f) =>
    copyIfExists(path.join(sourceBackendDir, 'controllers', f), path.join(controllersDir, f))
  );
  validationsToCopy.forEach((f) =>
    copyIfExists(path.join(sourceBackendDir, 'validations', f), path.join(validationsDir, f))
  );
  modelsToCopy.forEach((f) =>
    copyIfExists(path.join(sourceBackendDir, 'models', f), path.join(modelsDir, f))
  );

  ensureCrossModuleDependencies(sourceBackendDir, backendDir, routesToInclude, dependencyMap);
  generateFilteredApiRoutes(routesDir, routesToInclude);
  updatePackageJson(backendDir, variables);
}

function resolveBackendRoutesFromModules(selectedModules = []) {
  const modules = new Set(selectedModules || []);

  if (modules.has('meter_management')) {
    ['meter_list', 'meter_details', 'data_logger_master', 'add_meter'].forEach((m) => modules.add(m));
  }
  if (modules.has('user_management_default')) {
    ['users', 'role_management'].forEach((m) => modules.add(m));
  }
  if (modules.has('bills')) {
    ['prepaid', 'postpaid'].forEach((m) => modules.add(m));
  }

  const map = {
    meter_list: 'meters',
    meter_details: 'meters',
    add_meter: 'meters',
    data_logger_master: 'meters',
    tickets: 'tickets',
    ticket_view: 'tickets',
    add_ticket: 'tickets',
    users: 'users',
    user_detail: 'users',
    add_user: 'users',
    role_management: 'roles',
    asset_management: 'assets',
    consumer: 'consumers',
    consumer_detail: 'consumers',
    add_consumer: 'consumers',
    consumer_dashboard: 'dashboard',
    dtr_dashboard: 'dtrs',
    prepaid: 'prepaidBilling',
    postpaid: 'billing',
    dashboard: 'dashboard',
    dtr_management: 'dtrs',
  };

  const routes = new Set();
  modules.forEach((module) => {
    const route = map[module];
    if (route) routes.add(route);
  });

  return routes;
}

function generateFilteredApiRoutes(routesDir, routesToInclude) {
  const sourceBackendDir = path.join(__dirname, '..', 'application-backend');
  const sourceApiRoutesPath = path.join(sourceBackendDir, 'routes', 'apiRoutes.js');
  
  if (!fs.existsSync(sourceApiRoutesPath)) {
    console.warn('apiRoutes.js not found, skipping');
    return;
  }

  let imports = [];
  let routes = [];
  
  const routeConfig = {
    meters: { import: 'meters', path: '/meters', file: 'meters.js' },
    consumers: { import: 'consumers', path: '/consumers', file: 'consumers.js' },
    assets: { import: 'assets', path: '/assets', file: 'assets.js' },
    users: { import: 'users', path: '/users', file: 'users.js' },
    roles: { import: 'roles', path: '/roles', file: 'roles.js' },
    billing: { import: 'billing', path: '/billing', file: 'billing.js' },
    prepaidBilling: { import: 'prepaidBilling', path: '/prepaid-billing', file: 'prepaidBilling.js' },
    dashboard: { import: 'dashboard', path: '/dashboard', file: 'dashboard.js' },
    tickets: { import: 'tickets', path: '/tickets', file: 'tickets.js' },
    dtrs: { import: 'dtrs', path: '/dtrs', file: 'dtrs.js' },
    subAppAuth: { import: 'subAppAuth', path: '/sub-app/auth', file: 'subAppAuth.js' },
    overall: { import: 'overall', path: '/overall', file: 'overall.js' },
  };

  routesToInclude.forEach((routeKey) => {
    const config = routeConfig[routeKey];
    if (config) {
      imports.push(`import ${config.import} from './${config.file}';`);
      routes.push(`router.use('${config.path}', ${config.import});`);
    }
  });
  const apiRoutesContent = `import express from 'express';
${imports.join('\n')}

const router = express.Router();

${routes.join('\n')}

// Health check endpoint
router.get('/health', (req, res) => res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Application Backend API is running'
}));

export default router;`;

  fs.writeFileSync(path.join(routesDir, 'apiRoutes.js'), apiRoutesContent);
}

function generateFilteredServer(backendDir, routesToInclude, dynamicPort) {
  const availableRoutes = {
    meters: 'meters',
    consumers: 'consumers',
    assets: 'assets',
    users: 'users',
    roles: 'roles',
    billing: 'billing',
    dashboard: 'dashboard',
    tickets: 'tickets',
    dtrs: 'dtrs',
  };

  let routeImports = [];
  routesToInclude.forEach((routeKey) => {
    if (availableRoutes[routeKey]) {
      routeImports.push(`import ${availableRoutes[routeKey]} from './routes/${availableRoutes[routeKey]}.js';`);
    }
  });
  const serverContent = `import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
${routeImports.join('\n')}
import apiRoutes from './routes/apiRoutes.js';
import subAppAuthRoutes from './routes/subAppAuth.js';
import { initializeCronJobs } from './cron/jobs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || ${dynamicPort};

const prisma = new PrismaClient();

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:1700',
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:4221',
            'https://www.test35.bestinfra.app'
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.CORS_ORIGIN === '*') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(cookieParser()); // Add cookie parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(\`\${new Date().toISOString()} - \${req.method} \${req.path}\`);
    next();
});

app.use('/api', apiRoutes);

// Sub-app authentication routes
app.use('/api/sub-app/auth', subAppAuthRoutes);

app.get('/api/health', (req, res) => res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Application Backend API is running'
}));

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        error: \`Cannot \${req.method} \${req.originalUrl}\`
    });
});

async function startServer() {
    try {
        await prisma.$connect();
        console.log('Connected to database successfully');
        
        await initializeCronJobs();
        console.log('Cron jobs initialized successfully');
        
        app.listen(PORT, () => {
            console.log(\`Backend running on port \${PORT}\`);
            console.log(\`API Documentation: http://localhost:\${PORT}/api/health\`);
        });
    } catch (error) {
        console.error('Server startup failed:', error);
        process.exit(1);
    }
}

process.on('SIGINT', async () => {
    console.log('\\nShutting down gracefully...');
    try {
        await prisma.$disconnect();
        console.log('Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});

startServer();`;

  fs.writeFileSync(path.join(backendDir, 'server.js'), serverContent);
}



function copyIfExists(src, dest) {
  try {
    if (fs.existsSync(src)) {
      const dir = path.dirname(dest);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.copyFileSync(src, dest);
    }
  } catch (e) {
    console.warn('Warning copying file', src, '->', dest, e.message);
  }
}

/**
 * Copy directory recursively
 */
function copyDirectoryRecursive(source, dest) {
  if (!fs.existsSync(source)) return;
  
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
 * Update package.json with app name and module type
 */
function updatePackageJson(backendDir, variables) {
  const packagePath = path.join(backendDir, 'package.json');
  
  if (fs.existsSync(packagePath)) {
    let packageContent = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    
    // Update package name
    packageJson.name = `${variables.projectFolderName}-backend`;
    
    // Ensure type is set to module for ES6 imports
    packageJson.type = 'module';
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  }
}

/**
 * Ensure cross-module dependencies are satisfied
 */
function ensureCrossModuleDependencies(sourceBackendDir, backendDir, routesToInclude, dependencyMap) {
  const criticalDependencies = {
    'BillingDB.js': ['billing', 'prepaidBilling'],
    'TicketDB.js': ['tickets'],
    'UserDB.js': ['users', 'roles', 'subAppAuth'],
    'RoleDB.js': ['users', 'roles', 'subAppAuth'],
  };

  Object.entries(criticalDependencies).forEach(([modelFile, requiredModules]) => {
    const isAnyRequiredModuleSelected = requiredModules.some(module => routesToInclude.has(module));
    
    if (isAnyRequiredModuleSelected) {
      const sourceModelPath = path.join(sourceBackendDir, 'models', modelFile);
      const destModelPath = path.join(backendDir, 'models', modelFile);
      
      if (fs.existsSync(sourceModelPath) && !fs.existsSync(destModelPath)) {
        copyIfExists(sourceModelPath, destModelPath);
      }
    }
  });

  if (routesToInclude.has('billing') || routesToInclude.has('prepaidBilling')) {
    const billingModelPath = path.join(sourceBackendDir, 'models', 'BillingDB.js');
    const destBillingModelPath = path.join(backendDir, 'models', 'BillingDB.js');
    
    if (fs.existsSync(billingModelPath) && !fs.existsSync(destBillingModelPath)) {
      copyIfExists(billingModelPath, destBillingModelPath);
    }
  }

  if (routesToInclude.has('tickets')) {
    const ticketModelPath = path.join(sourceBackendDir, 'models', 'TicketDB.js');
    const destTicketModelPath = path.join(backendDir, 'models', 'TicketDB.js');
    
    if (fs.existsSync(ticketModelPath) && !fs.existsSync(destTicketModelPath)) {
      copyIfExists(ticketModelPath, destTicketModelPath);
    }
  }
}

/**
 * Copy cron jobs with dependency filtering
 */
function copyFilteredCronJobs(sourceCronDir, destCronDir, routesToInclude) {
  if (!fs.existsSync(sourceCronDir)) return;
  
  if (!fs.existsSync(destCronDir)) {
    fs.mkdirSync(destCronDir, { recursive: true });
  }

  const cronUtilsDir = path.join(sourceCronDir, 'utils');
  if (fs.existsSync(cronUtilsDir)) {
    copyDirectoryRecursive(cronUtilsDir, path.join(destCronDir, 'utils'));
  }

  const basicCronFiles = ['jobs.js'];
  basicCronFiles.forEach(file => {
    const sourceFile = path.join(sourceCronDir, file);
    if (fs.existsSync(sourceFile)) {
      copyIfExists(sourceFile, path.join(destCronDir, file));
    }
  });

  const moduleCronFiles = {
    billing: ['billing.js'],
    prepaidBilling: ['billing.js'],
    tickets: ['escalation.js'],
    meters: [],
    consumers: [],
    users: [],
    roles: [],
    assets: [],
    dashboard: [],
    dtrs: [],
  };

  Object.entries(moduleCronFiles).forEach(([module, files]) => {
    if (routesToInclude.has(module)) {
      files.forEach(file => {
        if (file) {
          const sourceFile = path.join(sourceCronDir, file);
          if (fs.existsSync(sourceFile)) {
            copyIfExists(sourceFile, path.join(destCronDir, file));
            console.log(`Copied cron file: ${file} for module: ${module}`);
          } else {
            console.warn(`Cron file not found: ${sourceFile} for module: ${module}`);
          }
        }
      });
    }
  });
  
  console.log('Cron job files copied based on selected modules');
}



module.exports = { generateBackend }; 
