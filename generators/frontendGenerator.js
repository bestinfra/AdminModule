const fs = require('fs');
const path = require('path');
const { copyTemplateDirectory, loadAndProcessTemplate, processTemplate } = require('./utils/templateProcessor');

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

  // Generate authentication components FIRST (before App.tsx)
  generateAuthComponents(frontendDir, variables);
  
  // Generate additional files that need complex logic
  generateAppComponent(frontendDir, variables);
  generateContextFiles(frontendDir, variables);
  generateHooksFiles(frontendDir, variables);
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
  
  // Generate imports based on selected modules
  const imports = [];
  
  // Array-based module configuration
  const moduleConfig = [
    {
      name: 'dashboard',
      title: 'Dashboard',
      icon: '/icons/dashboard.svg',
      subModules: [
        { name: 'consumer_dashboard', component: 'ConsumerDashboard', route: '/consumer-dashboard', title: 'Consumer Dashboard' },
        { name: 'dtr_dashboard', component: 'DTRDashboard', route: '/dtr-dashboard', title: 'DTR Dashboard' },
        { name: 'super_admin_dashboard', component: 'SuperAdminDashboard', route: '/super-admin', title: 'Super Admin Dashboard' }
      ]
    },
    {
      name: 'bills',
      title: 'Billing',
      icon: '/icons/bills.svg',
      subModules: [
        { name: 'prepaid', component: 'Prepaid', route: '/bills/prepaid', title: 'Prepaid Bills' },
        { name: 'postpaid', component: 'Postpaid', route: '/bills/postpaid', title: 'Postpaid Bills' }
      ]
    },
    {
      name: 'user_management',
      title: 'User Management',
      icon: '/icons/user.svg',
      subModules: [
        { name: 'users', component: 'Users', route: '/users', title: 'Users' },
        { name: 'role_management', component: 'RoleManagement', route: '/role-management', title: 'Role Management' }
      ]
    },
    {
      name: 'asset_management',
      title: 'Asset Management',
      icon: '/icons/workflow-setting-alt.svg',
      subModules: [
        { name: 'asset_management', component: 'AssetManagement', route: '/asset-management', title: 'Assets' },
        { name: 'feeders', component: 'Feeders', route: '/feeders', title: 'Feeders' }
      ]
    },
    {
      name: 'meter_management',
      title: 'Meter Management',
      icon: '/icons/meter-bolt.svg',
      subModules: [
        { name: 'meters', component: 'Meters', route: '/meters', title: 'Meters' },
        { name: 'meter_details', component: 'MeterDetails', route: '/meter-details/:meterId', title: 'Meter Details' },
        { name: 'add_meter', component: 'AddMeter', route: '/add-meter', title: 'Add Meter' }
      ]
    },
    {
      name: 'tickets',
      title: 'Tickets',
      icon: '/icons/customer-service.svg',
      subModules: [
        { name: 'tickets', component: 'Tickets', route: '/tickets', title: 'All Tickets' },
        { name: 'ticket_view', component: 'TicketView', route: '/tickets/:ticketId', title: 'Ticket Details' },
        { name: 'add_ticket', component: 'AddTicket', route: '/add-ticket', title: 'Add Ticket' }
      ]
    }
  ];

  // Process each selected module independently
  const processedComponents = new Set(); // Track processed components to avoid duplicates
  
  // Create a mapping of all available sub-modules for easy lookup
  const allSubModules = [];
  moduleConfig.forEach(parentModule => {
    parentModule.subModules.forEach(subModule => {
      allSubModules.push(subModule);
    });
  });
  
  modules.forEach(selectedModule => {
    // Find the sub-module in the config
    const subModule = allSubModules.find(sub => sub.name === selectedModule);
    if (subModule && !processedComponents.has(subModule.component)) {
      // Use @ alias for imports
      imports.push(`import ${subModule.component} from '@/pages/${subModule.component}';`);
      processedComponents.add(subModule.component);
    }
  });
  
  // Add Navigate import if we need fallback routes
  if (!modules.includes('dashboard') && modules.length > 0) {
    imports.push('import { Navigate } from \'react-router-dom\';');
  }
  
  variables.imports = imports.join('\n');
  
  // Routes are now generated from the moduleConfig array

  // Generate routes based on selected modules
  const routes = [];
  const processedRoutes = new Set(); // Track processed routes to avoid duplicates
  
  // Handle dashboard sub-modules first
  const dashboardSubModules = ['consumer_dashboard', 'dtr_dashboard'];
  const selectedDashboardModules = modules.filter(module => dashboardSubModules.includes(module));
  let mainDashboard = null;
  
  if (selectedDashboardModules.length === 1) {
    // If only one dashboard sub-module is selected, use it as the main dashboard
    const selectedModule = selectedDashboardModules[0];
    const subModule = allSubModules.find(sub => sub.name === selectedModule);
    if (subModule) {
      mainDashboard = subModule.component;
      // For single dashboard, only add the / route
      routes.push(`<Route path="/" element={<${mainDashboard} />} />`);
    }
  } else if (selectedDashboardModules.length > 1) {
    // If multiple dashboard sub-modules are selected, use the first one as default
    const firstSelectedModule = selectedDashboardModules[0];
    const subModule = allSubModules.find(sub => sub.name === firstSelectedModule);
    if (subModule) {
      mainDashboard = subModule.component;
      // For multiple dashboards, add both / and /dashboard routes
      routes.push(`<Route path="/" element={<${mainDashboard} />} />`);
      routes.push(`<Route path="/dashboard" element={<${mainDashboard} />} />`);
    }
  }
  
  // Process each selected module for routes (excluding dashboard sub-modules that were already handled)
  modules.forEach(selectedModule => {
    // Skip dashboard sub-modules as they were already handled above
    if (dashboardSubModules.includes(selectedModule)) {
      return;
    }
    
    // Find the sub-module in the config
    const subModule = allSubModules.find(sub => sub.name === selectedModule);
    if (subModule) {
      const routeKey = `${subModule.route}-${subModule.component}`;
      if (!processedRoutes.has(routeKey)) {
        routes.push(`<Route path="${subModule.route}" element={<${subModule.component} />} />`);
        processedRoutes.add(routeKey);
      }
    }
  });
  
  // Add specific dashboard routes only if multiple dashboard sub-modules are selected
  if (selectedDashboardModules.length > 1) {
    selectedDashboardModules.forEach(selectedModule => {
      const subModule = allSubModules.find(sub => sub.name === selectedModule);
      if (subModule) {
        const routeKey = `${subModule.route}-${subModule.component}`;
        if (!processedRoutes.has(routeKey)) {
          routes.push(`<Route path="${subModule.route}" element={<${subModule.component} />} />`);
          processedRoutes.add(routeKey);
        }
      }
    });
  }
  
  // If no modules selected, show a welcome page
  if (modules.length === 0) {
    routes.push('<Route path="/" element={<div className="flex items-center justify-center min-h-screen"><h1 className="text-2xl font-bold">Welcome to ' + variables.appName + '</h1></div>} />');
  }
  
  variables.routes = routes.join('\n              ');
  
  // Set basic app variables
  variables.appName = variables.appName || 'Admin App';
  variables.companyName = variables.companyName || 'Company';
  
  // Define module to page title mappings
  const modulePageTitles = {
    'dtr_dashboard': [
      { path: '/dtr-dashboard', title: 'DTR Dashboard' }
    ],
    'consumer_dashboard': [
      { path: '/consumer-dashboard', title: 'Consumer Dashboard' }
    ],
    'super_admin_dashboard': [
      { path: '/super-admin', title: 'Super Admin Dashboard' }
    ],
    'users': [
      { path: '/users', title: 'Users' }
    ],
    'role_management': [
      { path: '/role-management', title: 'Role Management' }
    ],
    'prepaid': [
      { path: '/bills/prepaid', title: 'Prepaid Bills' }
    ],
    'postpaid': [
      { path: '/bills/postpaid', title: 'Postpaid Bills' }
    ],
    'tickets': [
      { path: '/tickets', title: 'Tickets' },
      { path: '/tickets/:ticketId', title: 'Ticket View' },
      { path: '/add-ticket', title: 'Add Ticket' }
    ],
    'asset_management': [
      { path: '/asset-management', title: 'Asset Management' }
    ],
    'meters': [
      { path: '/meters', title: 'Meters' },
      { path: '/meter-details/:meterId', title: 'Meter Details' }
    ],
    // Feeders is included in dtr_dashboard module
  };

  // Generate page titles for AppLayout (only for selected modules)
  const pageTitles = [];
  const addedPaths = new Set(); // Track added paths to prevent duplicates
  
  // Process each selected module for page titles independently
  modules.forEach(module => {
    if (modulePageTitles[module]) {
      modulePageTitles[module].forEach(pageTitle => {
        if (!addedPaths.has(pageTitle.path)) {
          pageTitles.push(`    '${pageTitle.path}': '${pageTitle.title}'`);
          addedPaths.add(pageTitle.path);
        }
      });
    }
  });
  
  // Add dynamic dashboard routes based on selected dashboard sub-modules
  if (mainDashboard) {
    if (selectedDashboardModules.length === 1) {
      // If only one dashboard sub-module is selected, use it only for the / route
      const selectedModule = selectedDashboardModules[0];
      const subModule = allSubModules.find(sub => sub.name === selectedModule);
      if (subModule) {
        pageTitles.push(`    '/': '${subModule.title}'`);
      }
    } else if (selectedDashboardModules.length > 1) {
      // If multiple dashboard sub-modules are selected, use the first one for both / and /dashboard routes
      const firstSelectedModule = selectedDashboardModules[0];
      const subModule = allSubModules.find(sub => sub.name === firstSelectedModule);
      if (subModule) {
        pageTitles.push(`    '/': '${subModule.title}'`);
        pageTitles.push(`    '/dashboard': '${subModule.title}'`);
      }
    }
  }
  
  variables.pageTitles = pageTitles.join(',\n');
  
  // Initialize menuItems variable
  variables.menuItems = '';
  
  // Generate menu items for AppLayout (only for selected modules)
  const menuItems = [];
  
  // Handle dashboard sub-modules for menu items
  if (selectedDashboardModules.length === 1) {
    // If only one dashboard sub-module is selected, add it as the main dashboard
    const selectedModule = selectedDashboardModules[0];
    const subModule = allSubModules.find(sub => sub.name === selectedModule);
    if (subModule) {
      menuItems.push(`    { title: '${subModule.title}', icon: '/icons/dashboard.svg', link: '/' }`);
    }
  } else if (selectedDashboardModules.length > 1) {
    // If multiple dashboard sub-modules are selected, add the first one as main dashboard
    const firstSelectedModule = selectedDashboardModules[0];
    const subModule = allSubModules.find(sub => sub.name === firstSelectedModule);
    if (subModule) {
      menuItems.push(`    { title: '${subModule.title}', icon: '/icons/dashboard.svg', link: '/dashboard' }`);
    }
  }
  
  if (modules.includes('users')) {
    menuItems.push('    { title: \'Users\', icon: \'/icons/user.svg\', link: \'/users\' }');
  }
  
  if (modules.includes('role_management')) {
    menuItems.push('    { title: \'Role Management\', icon: \'/icons/roles.svg\', link: \'/role-management\' }');
  }
  
  if (modules.includes('prepaid')) {
    menuItems.push('    { title: \'Prepaid Bills\', icon: \'/icons/bills.svg\', link: \'/bills/prepaid\' }');
  }
  
  if (modules.includes('postpaid')) {
    menuItems.push('    { title: \'Postpaid Bills\', icon: \'/icons/bills.svg\', link: \'/bills/postpaid\' }');
  }
  
  if (modules.includes('tickets')) {
    menuItems.push('    { title: \'Tickets\', icon: \'/icons/customer-service.svg\', link: \'/tickets\' }');
  }
  
  if (modules.includes('asset_management')) {
    menuItems.push('    { title: \'Assets\', icon: \'/icons/workflow-setting-alt.svg\', link: \'/asset-management\' }');
  }
  
  if (modules.includes('meters')) {
    menuItems.push('    { title: \'Meters\', icon: \'/icons/meter-bolt.svg\', link: \'/meters\' }');
  }
  
  // Define user submenus based on selected user-related modules
  const userSubmenus = [];
  if (modules.includes('users')) {
    userSubmenus.push({ title: 'Users', link: '/users' });
  }
  if (modules.includes('role_management')) {
    userSubmenus.push({ title: 'Role Management', link: '/role-management' });
  }
  
  // Create smart user menu
  if (userSubmenus.length === 0) {
    // No user modules selected - don't add anything
  } else if (userSubmenus.length === 1) {
    // Single user module - make it the main menu
    const singleUser = userSubmenus[0];
    variables.menuItems += '    {\n';
    variables.menuItems += `      title: '${singleUser.title}',\n`;
    variables.menuItems += '      icon: \'/icons/user.svg\',\n';
    variables.menuItems += `      link: '${singleUser.link}',\n`;
    variables.menuItems += '    },\n';
  } else {
    // Multiple user modules - create parent with submenus
    variables.menuItems += '    {\n';
    variables.menuItems += '      title: \'Users\',\n';
    variables.menuItems += '      icon: \'/icons/user.svg\',\n';
    variables.menuItems += '      hasSubmenu: true,\n';
    variables.menuItems += '      submenu: [\n';
    userSubmenus.forEach(submenu => {
      variables.menuItems += '        {\n';
      variables.menuItems += `          title: '${submenu.title}',\n`;
      variables.menuItems += `          link: '${submenu.link}',\n`;
      variables.menuItems += '        },\n';
    });
    variables.menuItems += '      ],\n';
    variables.menuItems += '    },\n';
  }
  // variables.menuItems = menuItems.join(',\n');
  
  // Process the App.tsx template
  const templatePath = path.join(__dirname, 'templates', 'frontend', 'src', 'App.tsx.template');
  const outputPath = path.join(frontendDir, 'src', 'App.tsx');
  
  try {
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const processedContent = processTemplate(templateContent, variables);
    fs.writeFileSync(outputPath, processedContent);
    console.log('✅ App.tsx generated successfully');
  } catch (error) {
    console.error('❌ Error generating App.tsx:', error);
    throw error;
  }
}

/**
 * Generate context files
 */
function generateContextFiles(frontendDir, variables) {
  // Generate context folder (singular) for AppContext
  const contextDir = path.join(frontendDir, 'src', 'context');
  fs.mkdirSync(contextDir, { recursive: true });

  const appContextTemplate = path.join(__dirname, 'templates', 'frontend', 'src', 'context', 'AppContext.tsx.template');
  const appContextContent = loadAndProcessTemplate(appContextTemplate, variables);
  const appContextPath = path.join(contextDir, 'AppContext.tsx');
  fs.writeFileSync(appContextPath, appContextContent);

  // Generate contexts folder (plural) for additional context providers
  const contextsDir = path.join(frontendDir, 'src', 'contexts');
  fs.mkdirSync(contextsDir, { recursive: true });

  // Copy FilterStyleContext from the main frontend
  const sourceFilterStyleContext = path.join(__dirname, '..', 'frontend', 'src', 'contexts', 'FilterStyleContext.tsx', 'api');
  const targetFilterStyleContext = path.join(contextsDir, 'FilterStyleContext.tsx');
  
  if (fs.existsSync(sourceFilterStyleContext)) {
    fs.copyFileSync(sourceFilterStyleContext, targetFilterStyleContext);
    console.log('✅ Copied FilterStyleContext.tsx to sub-app');
  } else {
    console.warn('⚠️  FilterStyleContext.tsx not found in main frontend, skipping...');
  }
}

/**
 * Generate hooks files
 */
function generateHooksFiles(frontendDir, variables) {
  const hooksDir = path.join(frontendDir, 'src', 'hooks');
  fs.mkdirSync(hooksDir, { recursive: true });

  // Copy useIconFilterStyle hook from the main frontend
  const sourceIconFilterHook = path.join(__dirname, '..', 'frontend', 'src', 'hooks', 'useIconFilterStyle.ts');
  const targetIconFilterHook = path.join(hooksDir, 'useIconFilterStyle.ts');
  
  if (fs.existsSync(sourceIconFilterHook)) {
    fs.copyFileSync(sourceIconFilterHook, targetIconFilterHook);
    console.log('✅ Copied useIconFilterStyle.ts to sub-app');
  } else {
    console.warn('⚠️  useIconFilterStyle.ts not found in main frontend, skipping...');
  }
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
    'CSSLoader.tsx.template',
    'AppLayout.tsx.template'
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
 * Generate authentication components
 */
function generateAuthComponents(frontendDir, variables) {
  const authDir = path.join(frontendDir, 'src', 'components', 'auth');
  fs.mkdirSync(authDir, { recursive: true });

  // Generate LocalAuthWrapper
  const authWrapperTemplate = path.join(__dirname, 'templates', 'frontend', 'src', 'components', 'auth', 'LocalAuthWrapper.tsx.template');
  if (fs.existsSync(authWrapperTemplate)) {
    const authWrapperContent = loadAndProcessTemplate(authWrapperTemplate, variables);
    const authWrapperPath = path.join(authDir, 'LocalAuthWrapper.tsx');
    fs.writeFileSync(authWrapperPath, authWrapperContent);
  }

  // Generate LocalProtectedRoute
  const protectedRouteTemplate = path.join(__dirname, 'templates', 'frontend', 'src', 'components', 'auth', 'LocalProtectedRoute.tsx.template');
  if (fs.existsSync(protectedRouteTemplate)) {
    const protectedRouteContent = loadAndProcessTemplate(protectedRouteTemplate, variables);
    const protectedRoutePath = path.join(authDir, 'LocalProtectedRoute.tsx');
    fs.writeFileSync(protectedRoutePath, protectedRouteContent);
  }

  // Verify that both files were created
  const authWrapperPath = path.join(authDir, 'LocalAuthWrapper.tsx');
  const protectedRoutePath = path.join(authDir, 'LocalProtectedRoute.tsx');
  
  if (!fs.existsSync(authWrapperPath)) {
    console.error('❌ Failed to create LocalAuthWrapper.tsx');
  }
  if (!fs.existsSync(protectedRoutePath)) {
    console.error('❌ Failed to create LocalProtectedRoute.tsx');
  }

  console.log('✅ Generated authentication components');
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
  
  // Copy additional API files that sub-apps need
  copyApiFiles(frontendDir, variables);
}

/**
 * Copy necessary API files from main frontend to sub-app
 */
function copyApiFiles(frontendDir, variables) {
  const apiDir = path.join(frontendDir, 'src', 'api');
  const sourceApiDir = path.join(__dirname, '..', 'frontend', 'src', 'api');
  
  // Files to copy from main frontend API
  const filesToCopy = [
    'subAppAuth.ts',
    'meterConnection.ts',
    'exportModules.ts'
  ];
  
  filesToCopy.forEach(fileName => {
    const sourcePath = path.join(sourceApiDir, fileName);
    const destPath = path.join(apiDir, fileName);
    
    if (fs.existsSync(sourcePath)) {
      try {
        // Read the source file
        let content = fs.readFileSync(sourcePath, 'utf8');
        
        // Update the BACKEND_URL import for sub-apps
        if (fileName === 'subAppAuth.ts') {
          content = content.replace(
            "import BACKEND_URL from '../config';",
            "const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:" + variables.backendPort + "';"
          );
        }
        
        fs.writeFileSync(destPath, content);
        console.log('✅ Copied ' + fileName + ' to sub-app API folder');
      } catch (error) {
        console.log('⚠️  Warning: Could not copy ' + fileName + ': ' + error.message);
      }
    } else {
      console.log('⚠️  Warning: Source file ' + fileName + ' not found');
    }
  });
}

module.exports = { generateFrontend }; 