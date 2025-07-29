const fs = require('fs');
const path = require('path');
const { copyTemplateDirectory, loadAndProcessTemplate } = require('./utils/templateProcessor');

/**
 * Generate frontend application structure
 * @param {string} baseDir - Base directory for the project
 * @param {Object} formData - Form data with app configuration
 */
function generateFrontend(baseDir, formData) {
  const {
    appName,
    companyName,
    adminFirstName,
    adminLastName,
    primaryColor,
    secondaryColor,
    textPrimaryColor,
    textSecondaryColor,
    backgroundColor,
    borderColor,
    shadowColor,
    iconColor,
    gradientColor,
    modules,
    backendPort
  } = formData;

  const frontendDir = path.join(baseDir, 'frontend');
  
  // Create variables for template replacement
  const variables = {
    appName: appName || 'Admin App',
    projectFolderName: appName?.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'my-admin-app',
    companyName: companyName || 'Company',
    adminFirstName: adminFirstName || 'Admin',
    adminLastName: adminLastName || 'User',
    // New color variables from BrandPersonalization
    colorPrimaryBg: formData.colorPrimaryBg || '#efefef',
    colorPrimaryBgLight: formData.colorPrimaryBgLight || '#dce7ec',
    colorPrimaryLightest: formData.colorPrimaryLightest || '#f5f8fc',
    colorSecondary: formData.colorSecondary || '#55b56c',
    colorSecondaryLight: formData.colorSecondaryLight || '#bbe1c4',
    colorSecondaryPositive: formData.colorSecondaryPositive || '#029447',
    colorSecondaryPositiveLight: formData.colorSecondaryPositiveLight || 'rgba(52, 199, 89, 0.15)',
    colorTextPrimary: formData.colorTextPrimary || '#262626',
    colorTextSecondary: formData.colorTextSecondary || '#7e7e7e',
    colorPrimaryBorder: formData.colorPrimaryBorder || '#e9efff',
    colorWarning: formData.colorWarning || '#ed8c22',
    colorWarningAlt: formData.colorWarningAlt || '#ffd108',
    colorWarningLight: formData.colorWarningLight || 'rgba(255, 180, 0, 0.15)',
    colorDanger: formData.colorDanger || '#dc272c',
    colorDangerAlt: formData.colorDangerAlt || '#ff7c5c',
    colorDangerLight: formData.colorDangerLight || 'rgba(231, 45, 63, 0.1)',
    colorInfo: formData.colorInfo || 'none',
    colorNeutralDark: formData.colorNeutralDark || '#3c3c3c',
    colorNeutralDarker: formData.colorNeutralDarker || '#262626',
    colorNeutralLightest: formData.colorNeutralLightest || '#ffffff',
    colorAccentLight: formData.colorAccentLight || 'rgba(0, 209, 178, 0.05)',
    colorShadowPrimary: formData.colorShadowPrimary || '#dce4ef',
    colorShadowSecondary: formData.colorShadowSecondary || '#dce4ef',
    colorPrimaryDark: formData.colorPrimaryDark || '#041328',
    colorPrimaryDarkLight: formData.colorPrimaryDarkLight || '#06152d',
    colorDarkPrimary: formData.colorDarkPrimary || '#476189',
    colorDarkSecondary: formData.colorDarkSecondary || '#476189',
    colorDarkBorder: formData.colorDarkBorder || '#091b3b',
    colorPrimaryGradient: formData.colorPrimaryGradient || 'linear-gradient(135deg, var(--colorSecondaryLight), var(--colorSecondaryLightestTransperent))',
    colorPrimaryDarkGradient: formData.colorPrimaryDarkGradient || 'linear-gradient(135deg, var(--colorPrimaryLight), var(--colorSecondaryLightestTransperent))',
    colorGradientSecondary: formData.colorGradientSecondary || 'linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light))',
    colorStatIconGradient: formData.colorStatIconGradient || 'linear-gradient(0deg, rgb(187 225 196), rgba(22, 59, 124, 0))',
    modules: modules || [],
    modulesArray: JSON.stringify(modules || []),
    backendPort: backendPort || 4000
  };

  // Copy template directory (excluding App.tsx which will be processed separately)
  const templateDir = path.join(__dirname, 'templates', 'frontend');
  copyTemplateDirectory(templateDir, frontendDir, variables, ['App.tsx.template']);

  // Generate additional files that need complex logic
  generateAppComponent(frontendDir, variables);
  generateContextFiles(frontendDir, variables);
  generateComponentFiles(frontendDir, variables);
  generateTypeDefinitions(frontendDir, variables);
  generateThemeFile(frontendDir, variables);
  generateReadme(frontendDir, variables);
  generateEnvFile(frontendDir, variables);
  generateApiUtils(frontendDir, variables);

  console.log('Frontend generated successfully');
}

/**
 * Generate the main App.tsx component
 */
function generateAppComponent(frontendDir, variables) {
  // Calculate conditional cases based on selected modules
  const modules = variables.modules || [];
  
  // Ensure modulesArray is properly set for template replacement
  variables.modulesArray = JSON.stringify(modules);
  
  // Set basic app variables
  variables.appName = variables.appName || 'Admin App';
  variables.companyName = variables.companyName || 'Company';
  
  variables.userManagementCase = modules.includes('user_management_default') ? `
      case '/users':
        return 'Users';` : '';
  
  variables.roleManagementCase = (modules.includes('role_management') || modules.includes('user_management_default')) ? `
      case '/role-management':
        return 'Role Management';` : '';
  
  variables.consumerCase = modules.includes('consumer') ? `
      case '/consumers':
        return 'Consumers';` : '';
  
  variables.billsPrepaidCase = (modules.includes('bills') || modules.includes('prepaid')) ? `
      case '/bills/prepaid':
        return 'Prepaid Bills';` : '';
  
  variables.billsPostpaidCase = (modules.includes('bills') || modules.includes('postpaid')) ? `
      case '/bills/postpaid':
        return 'Postpaid Bills';` : '';
  
  variables.ticketsCase = modules.includes('tickets') ? `
      case '/all-tickets':
        return 'All Tickets';
      case '/tickets/:ticketId':
        return 'Ticket View';` : '';
  
  variables.assetManagementCase = modules.includes('asset_management') ? `
      case '/asset-management':
        return 'Asset Management';` : '';
  
  variables.meterManagementCase = modules.includes('meter_management') ? `
      case '/meters':
        return 'Meters';
      case '/data-logger-master':
        return 'Data Logger Master';
      case '/meter-details/:meterSlNo':
        return 'Meter Details';` : '';
  
  variables.dtrCase = modules.includes('dtr') ? `
      case '/dtr-dashboard':
        return 'DTR Dashboard';
      case '/dtr/:dtrId':
        return 'Feeders';` : '';
  
  // Dashboard submenu case variables
  variables.consumerDashboardCase = modules.includes('consumer_dashboard') ? `
      case '/consumer-dashboard':
        return 'Consumer Dashboard';` : '';
  
  variables.dtrDashboardCase = modules.includes('dtr_dashboard') ? `
      case '/dtr-dashboard':
        return 'DTR Dashboard';` : '';
  
  variables.consumerCase = modules.includes('consumer') ? `
      case '/consumers':
        return 'Consumers';` : '';
  
  variables.userManagementCase = modules.includes('user_management_default') ? `
      case '/users':
        return 'Users';` : '';

  // Calculate route variables
  variables.billsPrepaidRoute = (modules.includes('bills') || modules.includes('prepaid')) ? 
    '<Route path="/bills/prepaid" element={<Prepaid />} />' : '';
  
  variables.billsPostpaidRoute = (modules.includes('bills') || modules.includes('postpaid')) ? 
    '<Route path="/bills/postpaid" element={<Postpaid />} />' : '';
  
  variables.assetManagementRoute = modules.includes('asset_management') ? 
    '<Route path="/asset-management" element={<AssetManagment />} />' : '';
   
  variables.meterManagementRoute = modules.includes('meter_management') ? 
    '<Route path="/meters" element={<Meters />} />' : '';
  
  // Data Logger route commented out
  // variables.dataLoggerRoute = modules.includes('meter_management') ? 
  //   '<Route path="/data-logger-master" element={<DataLoggerMaster />} />' : '';
  
  variables.ticketsRoute = modules.includes('tickets') ? 
    '<Route path="/all-tickets" element={<Tickets />} />' : '';
  
  variables.usersRoute = modules.includes('user_management_default') ? 
    '<Route path="/users" element={<Users />} />' : '';
  
  variables.roleManagementRoute = (modules.includes('role_management') || modules.includes('user_management_default')) ? 
    '<Route path="/role-management" element={<RoleManagement />} />' : '';
  
  variables.consumerRoute = modules.includes('consumer') ? 
    '<Route path="/consumers" element={<Consumers />} />' : '';
  
  variables.dtrRoute = modules.includes('dtr') ? 
    '' : ''; // DTR dashboard route is handled by dtrDashboardRoute, feeders by feedersRoute
   
  variables.meterDetailsRoute = modules.includes('meter_management') ? 
    '<Route path="/meter-details/:meterSlNo" element={<MeterDetails />} />' : '';
  
  variables.ticketViewRoute = modules.includes('tickets') ? 
    '<Route path="/tickets/:ticketId" element={<TicketView />} />' : '';
  
 // Dashboard submenu routes

 variables.consumerDashboardRoute = modules.includes('consumer_dashboard') ? 

 '<Route path="/consumer-dashboard" element={<Dashboard />} />' : '';



variables.dtrDashboardRoute = modules.includes('dtr_dashboard') ? 

 '<Route path="/dtr-dashboard" element={<DTRDashboard />} />' : '';

  variables.feedersRoute = modules.includes('dtr') ? 
    '<Route path="/dtr/:dtrId" element={<Feeders />} />' : '';

  // Calculate dashboard route dynamically based on selected dashboard modules
  let defaultDashboardComponent = 'Dashboard';
  let defaultDashboardPath = '/';
  
  // Check which dashboard modules are selected and set the default
  if (modules.includes('dtr_dashboard')) {
    defaultDashboardComponent = 'DTRDashboard';
    defaultDashboardPath = '/';
  } else if (modules.includes('consumer_dashboard')) {
    defaultDashboardComponent = 'Dashboard'; // Consumer dashboard uses the main Dashboard component
    defaultDashboardPath = '/';
  }
  
  // Generate dashboard routes - both / and /dashboard for dashboard module
  if (modules.includes('dashboard') || modules.includes('consumer_dashboard')) {
    variables.dashboardRoute = `<Route path="/" element={<${defaultDashboardComponent} />} />
                      <Route path="/dashboard" element={<${defaultDashboardComponent} />} />`;
    variables.dashboardError = `<li>/ - ${defaultDashboardComponent}</li>
                                <li>/dashboard - ${defaultDashboardComponent}</li>`;
  } else {
    variables.dashboardRoute = `<Route path="${defaultDashboardPath}" element={<${defaultDashboardComponent} />} />`;
    variables.dashboardError = `<li>/ - ${defaultDashboardComponent}</li>`;
  }

  // Calculate import variables based on selected modules
  variables.dashboardImport = `import ${defaultDashboardComponent} from './pages/${defaultDashboardComponent}';`;
  
  // Add Dashboard import for consumer dashboard route
  variables.dashboardImportForConsumer = modules.includes('consumer_dashboard') ? 
    'import Dashboard from \'./pages/Dashboard\';' : '';
  
  variables.consumersImport = modules.includes('consumer') ? 
    'import Consumers from \'./pages/Consumers\';' : '';
  
  variables.consumerViewImport = modules.includes('consumer') ? 
    'import ConsumerView from \'./pages/ConsumerView\';' : '';
  
  variables.usersImport = modules.includes('user_management_default') ? 
    'import Users from \'./pages/Users\';' : '';
  
  variables.roleManagementImport = (modules.includes('role_management') || modules.includes('user_management_default')) ? 
    'import RoleManagement from \'./pages/RoleManagement\';' : '';
  
  variables.metersImport = modules.includes('meter_management') ? 
    'import Meters from \'./pages/Meters\';' : '';
  
  // Data Logger import commented out
  // variables.dataLoggerImport = modules.includes('meter_management') ? 
  //   'import DataLoggerMaster from \'./pages/DataLogger\';' : '';
  
  variables.dtrDashboardImport = modules.includes('dtr') ? 
    'import DTRDashboard from \'./pages/DTRDashboard\';' : '';
  
  variables.assetManagementImport = modules.includes('asset_management') ? 
    'import AssetManagment from \'./pages/AssetManagment\';' : '';
  
  variables.ticketsImport = modules.includes('tickets') ? 
    'import Tickets from \'./pages/Tickets\';' : '';
  
  variables.prepaidImport = (modules.includes('bills') || modules.includes('prepaid')) ? 
    'import Prepaid from \'./pages/Prepaid\';' : '';
  
  variables.postpaidImport = (modules.includes('bills') || modules.includes('postpaid')) ? 
    'import Postpaid from \'./pages/Postpaid\';' : '';
  
  variables.meterDetailsImport = modules.includes('meter_management') ? 
    'import MeterDetails from \'./pages/MeterDetails\';' : '';
  
  variables.ticketViewImport = modules.includes('tickets') ? 
    'import TicketView from \'./pages/TicketView\';' : '';
  
  variables.feedersImport = modules.includes('dtr') ? 
    'import Feeders from \'./pages/Feeders\';' : '';
  
  // Calculate fallback components
  variables.loginFallback = `const LoginFallback = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Login</h1>
    <p className="text-gray-600">Loading login page...</p>
    <div className="mt-4 p-4 bg-blue-100 border border-blue-400 rounded">
      <h3 className="font-semibold text-blue-800">Debug Info:</h3>
      <p className="text-sm text-blue-700">This is the fallback component. The remote Login component failed to load.</p>
      <p className="text-sm text-blue-700">Make sure SuperAdmin app is running on port 3000 and accessible.</p>
    </div>
  </div>
);`;

  variables.sidebarFallback = `const SidebarFallback = () => (
  <div className="w-72 bg-gray-100 h-screen p-4">
    <div className="text-center">Sidebar Loading...</div>
  </div>
);`;

  variables.headerFallback = `const HeaderFallback = () => (
  <div className="h-16 bg-gray-100 border-b flex items-center px-6">
    <span>Header Loading...</span>
  </div>
);`;

  // Calculate theme provider import
  variables.themeProviderImport = `import { ThemeProvider } from 'SuperAdmin/providers/ThemeProvider';`;

  // Calculate federated components
  variables.sidebarComponent = `const Sidebar = createSafeLazyComponent(
  () => import('SuperAdmin/Sidebar'),
  SidebarFallback
);`;

  variables.headerComponent = `const Header = createSafeLazyComponent(
  () => import('SuperAdmin/Header'),
  HeaderFallback
);`;

  variables.loginComponent = `const Login = createSafeLazyComponent(
  () => import('SuperAdmin/Login'),
  LoginFallback
);`;

  // Calculate error page variables
  variables.billsPrepaidError = (modules.includes('bills') || modules.includes('prepaid')) ? 
    '<li>/bills/prepaid - Bills Prepaid</li>' : '';
  
  variables.billsPostpaidError = (modules.includes('bills') || modules.includes('postpaid')) ? 
    '<li>/bills/postpaid - Bills Postpaid</li>' : '';
  
  variables.assetManagementError = modules.includes('asset_management') ? 
    '<li>/asset-management - Asset Management</li>' : '';
  
  variables.meterManagementError = modules.includes('meter_management') ? 
    '<li>/meters - Meters List</li>\n                                <li>/meter-details/:meterSlNo - Meter Details</li>' : '';
  
  // Data Logger error commented out
  // variables.dataLoggerError = modules.includes('meter_management') ? 
  //   '<li>/data-logger-master - Data Logger Master</li>' : '';
  
  variables.ticketsError = modules.includes('tickets') ? 
    '<li>/all-tickets - All Tickets</li>\n                                <li>/tickets/:ticketId - Ticket View</li>' : '';
  
  variables.usersError = modules.includes('user_management_default') ? 
    '<li>/users - Users</li>' : '';
  
  variables.roleManagementError = (modules.includes('role_management') || modules.includes('user_management_default')) ? 
    '<li>/role-management - Role Management</li>' : '';
  
  variables.consumerError = modules.includes('consumer') ? 
    '<li>/consumers - Consumers</li>' : '';
  
  variables.dtrError = modules.includes('dtr') ? 
    '<li>/dtr-dashboard - DTR Dashboard</li>\n                                <li>/dtr/:dtrId - Feeders</li>' : '';
  
 // Dashboard submenu error variables

 variables.consumerDashboardError = modules.includes('consumer_dashboard') ? 

 '<li>/consumer-dashboard - Consumer Dashboard</li>' : '';



variables.dtrDashboardError = modules.includes('dtr_dashboard') ? 

 '<li>/dtr-dashboard - DTR Dashboard</li>' : '';

  variables.feedersError = modules.includes('dtr') ? 
    '<li>/dtr/:dtrId - Feeders</li>' : '';

  const appTemplate = path.join(__dirname, 'templates', 'frontend', 'src', 'App.tsx.template');
  const appContent = loadAndProcessTemplate(appTemplate, variables);
  
  // Debug: Check if any placeholders were not replaced
  const placeholders = appContent.match(/{{[^}]+}}/g);
  if (placeholders && placeholders.length > 0) {
    console.error('Warning: Template placeholders were not replaced!');
    console.error('Unreplaced placeholders:', placeholders);
  }
  
  const appPath = path.join(frontendDir, 'src', 'App.tsx');
  fs.writeFileSync(appPath, appContent);
}

/**
 * Generate context files
 */
function generateContextFiles(frontendDir, variables) {
  const contextDir = path.join(frontendDir, 'src', 'context');
  fs.mkdirSync(contextDir, { recursive: true });

  const appContextTemplate = path.join(__dirname, 'templates', 'frontend', 'src', 'context', 'AppContext.tsx.template');
  const appContextContent = loadAndProcessTemplate(appContextTemplate, variables);
  const appContextPath = path.join(contextDir, 'AppContext.tsx');
  fs.writeFileSync(appContextPath, appContextContent);
}

/**
 * Generate component files
 */
function generateComponentFiles(frontendDir, variables) {
  const componentsDir = path.join(frontendDir, 'src', 'components');
  fs.mkdirSync(componentsDir, { recursive: true });

  // Generate each component
  const componentTemplates = [
    'Input.tsx.template',
    'FederatedWrapper.tsx.template',
    'CSSLoader.tsx.template'
  ];

  componentTemplates.forEach(templateName => {
    const templatePath = path.join(__dirname, 'templates', 'frontend', 'src', 'components', templateName);
    if (fs.existsSync(templatePath)) {
      const content = loadAndProcessTemplate(templatePath, variables);
      const outputPath = path.join(componentsDir, templateName.replace('.template', ''));
      fs.writeFileSync(outputPath, content);
    }
  });
}

/**
 * Generate TypeScript definitions
 */
function generateTypeDefinitions(frontendDir, variables) {
  const typesDir = path.join(frontendDir, 'src', 'types');
  fs.mkdirSync(typesDir, { recursive: true });

  const federationTemplate = path.join(__dirname, 'templates', 'frontend', 'src', 'types', 'federation.d.ts.template');
  const federationContent = loadAndProcessTemplate(federationTemplate, variables);
  const federationPath = path.join(typesDir, 'federation.d.ts');
  fs.writeFileSync(federationPath, federationContent);
}

/**
 * Generate theme file
 */
function generateThemeFile(frontendDir, variables) {
  const themeTemplate = path.join(__dirname, 'templates', 'frontend', 'src', 'Theme.jsx.template');
  const themeContent = loadAndProcessTemplate(themeTemplate, variables);
  const themePath = path.join(frontendDir, 'src', 'Theme.jsx');
  fs.writeFileSync(themePath, themeContent);
}

/**
 * Generate README file
 */
function generateReadme(frontendDir, variables) {
  const readmeTemplate = path.join(__dirname, 'templates', 'frontend', 'README.md.template');
  const readmeContent = loadAndProcessTemplate(readmeTemplate, variables);
  const readmePath = path.join(frontendDir, 'README.md');
  fs.writeFileSync(readmePath, readmeContent);
}

/**
 * Generate environment file for frontend
 */
function generateEnvFile(frontendDir, variables) {
  const envContent = `# Frontend Environment Configuration
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:${variables.backendPort}
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=${variables.appName}
VITE_COMPANY_NAME=${variables.companyName}

# Development Configuration
VITE_DEV_MODE=true
VITE_ENABLE_LOGGING=true

# Feature Flags
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_MULTI_LANGUAGE=false

# Backend Health Check
VITE_BACKEND_HEALTH_URL=http://localhost:${variables.backendPort}/api/health
VITE_BACKEND_ENV_URL=http://localhost:${variables.backendPort}/api/env
`;
  
  const envPath = path.join(frontendDir, '.env');
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created frontend .env file with backend connection');
}

/**
 * Generate API utilities for frontend
 */
function generateApiUtils(frontendDir, variables) {
  const apiDir = path.join(frontendDir, 'src', 'api');
  fs.mkdirSync(apiDir, { recursive: true });

  const apiUtilsContent = `// API Utilities for ${variables.appName}
// This file provides utilities to connect to the backend API

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:${variables.backendPort}';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000;

/**
 * Make API requests to the backend
 */
export class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl = API_BASE_URL, timeout = API_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * Make a GET request
   */
  async get(endpoint: string, options: RequestInit = {}) {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    return response.json();
  }

  /**
   * Make a POST request
   */
  async post(endpoint: string, data: any, options: RequestInit = {}) {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    return response.json();
  }

  /**
   * Make a PUT request
   */
  async put(endpoint: string, data: any, options: RequestInit = {}) {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    return response.json();
  }

  /**
   * Make a DELETE request
   */
  async delete(endpoint: string, options: RequestInit = {}) {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    return response.json();
  }

  /**
   * Check backend health
   */
  async healthCheck() {
    try {
      const health = await this.get('/api/health');
      return { status: 'healthy', data: health };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  /**
   * Get backend environment info
   */
  async getEnvironmentInfo() {
    try {
      const env = await this.get('/api/env');
      return { status: 'success', data: env };
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }
}

// Create a default API client instance
export const apiClient = new ApiClient();

// Export commonly used API functions
export const api = {
  // Health check
  health: () => apiClient.healthCheck(),
  
  // Environment info
  env: () => apiClient.getEnvironmentInfo(),
  
  // Example API endpoints (customize based on your backend)
  users: {
    getAll: () => apiClient.get('/api/users'),
    getById: (id: string) => apiClient.get(\`/api/users/\${id}\`),
    create: (data: any) => apiClient.post('/api/users', data),
    update: (id: string, data: any) => apiClient.put(\`/api/users/\${id}\`, data),
    delete: (id: string) => apiClient.delete(\`/api/users/\${id}\`),
  },
  
  // Add more API endpoints as needed
  // Example: posts, comments, etc.
};

export default apiClient;
`;

  const apiUtilsPath = path.join(apiDir, 'apiUtils.ts');
  fs.writeFileSync(apiUtilsPath, apiUtilsContent);
  console.log('✅ Created API utilities for frontend-backend connection');
}

module.exports = { generateFrontend }; 