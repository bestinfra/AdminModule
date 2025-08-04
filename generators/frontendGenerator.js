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
  
  // Dashboard submenu case variables - smart logic
  const dashboardCaseModules = [];
  if (modules.includes('consumer_dashboard')) dashboardCaseModules.push('consumer_dashboard');
  if (modules.includes('dtr_dashboard')) dashboardCaseModules.push('dtr_dashboard');
  
  // Old case-based variables removed - now using simplified pageTitles object

  // Old route variables removed - now using simplified routes array
   
  variables.meterDetailsRoute = modules.includes('meter_management') ? 
    '<Route path="/meter-details/:meterSlNo" element={<MeterDetails />} />' : '';

  // Add feeders route for DTR dashboard navigation
  variables.feedersRoute = modules.includes('dtr_dashboard') ? 
    '<Route path="/dtr/:dtrId" element={<Feeders />} />' : '';
  
  variables.ticketViewRoute = modules.includes('tickets') ? 
    '<Route path="/tickets/:ticketId" element={<TicketView />} />' : '';
  
 // Dashboard submenu routes - always create routes for selected sub-dashboards
 variables.consumerDashboardRoute = modules.includes('consumer_dashboard') ? 
   '<Route path="/consumer-dashboard" element={<Dashboard />} />' : '';

 variables.dtrDashboardRoute = modules.includes('dtr_dashboard') ? 
   '<Route path="/dtr-dashboard" element={<DTRDashboard />} />' : '';

  // Smart dashboard route and import logic
  const dashboardModules = [];
  if (modules.includes('consumer_dashboard')) dashboardModules.push('consumer_dashboard');
  if (modules.includes('dtr_dashboard')) dashboardModules.push('dtr_dashboard');
  
  if (dashboardModules.length === 0) {
    // No dashboard modules - use default
    variables.dashboardRoute = `<Route path="/" element={<Dashboard />} />
                      <Route path="/dashboard" element={<Dashboard />} />`;
    variables.dashboardError = `<li>/ - Dashboard</li>
                                <li>/dashboard - Dashboard</li>`;
  } else if (dashboardModules.length === 1) {
    // Single dashboard - make it the main dashboard
    const singleModule = dashboardModules[0];
    if (singleModule === 'consumer_dashboard') {
      variables.dashboardRoute = `<Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />`;
      variables.dashboardError = `<li>/ - Dashboard</li>
                                  <li>/dashboard - Dashboard</li>`;
    } else if (singleModule === 'dtr_dashboard') {
      variables.dashboardRoute = `<Route path="/" element={<DTRDashboard />} />
                        <Route path="/dashboard" element={<DTRDashboard />} />`;
      variables.dashboardError = `<li>/ - DTRDashboard</li>
                                  <li>/dashboard - DTRDashboard</li>`;
    }
  } else {
    // Multiple dashboards - create main dashboard with sub-routes
    variables.dashboardRoute = `<Route path="/" element={<Dashboard />} />
                      <Route path="/dashboard" element={<Dashboard />} />`;
    variables.dashboardError = `<li>/ - Dashboard</li>
                                <li>/dashboard - Dashboard</li>`;
  }
  

  

  
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

  // Generate all imports
  variables.imports = '';
  
  // Dashboard imports - smart import logic
  const dashboardImportModules = [];
  if (modules.includes('consumer_dashboard')) dashboardImportModules.push('consumer_dashboard');
  if (modules.includes('dtr_dashboard')) dashboardImportModules.push('dtr_dashboard');
  
  if (dashboardImportModules.length === 0) {
    // No dashboard modules - use default dashboard
    if (modules.includes('dashboard')) {
      variables.imports += 'import Dashboard from \'@/pages/Dashboard\';\n';
    }
  } else if (dashboardImportModules.length === 1) {
    // Single dashboard module - import the specific dashboard
    const singleModule = dashboardImportModules[0];
    if (singleModule === 'consumer_dashboard') {
      variables.imports += 'import Dashboard from \'@/pages/Dashboard\';\n';
    } else if (singleModule === 'dtr_dashboard') {
      variables.imports += 'import DTRDashboard from \'@/pages/DTRDashboard\';\n';
    }
  } else {
    // Multiple dashboard modules - import both
    variables.imports += 'import Dashboard from \'@/pages/Dashboard\';\n';
    variables.imports += 'import DTRDashboard from \'@/pages/DTRDashboard\';\n';
  }
  
  // Consumer imports
  if (modules.includes('consumer')) {
    variables.imports += 'import Consumers from \'@/pages/Consumers\';\n';
  }
  if (modules.includes('consumer_view')) {
    variables.imports += 'import ConsumerView from \'@/pages/ConsumerView\';\n';
  }
  
  // User management imports
  if (modules.includes('user_management_default') || modules.includes('users')) {
    variables.imports += 'import Users from \'@/pages/Users\';\n';
  }
  if (modules.includes('role_management')) {
    variables.imports += 'import RoleManagement from \'@/pages/RoleManagement\';\n';
  }
  
  // Meter management imports
  if (modules.includes('meter_management') || modules.includes('meter_list')) {
    variables.imports += 'import Meters from \'@/pages/Meters\';\n';
    variables.imports += 'import MeterDetails from \'@/pages/MeterDetails\';\n';
  }
  
  // Asset management imports
  if (modules.includes('asset_management')) {
    variables.imports += 'import AssetManagement from \'@/pages/AssetManagement\';\n';
  }
  
  // Ticket imports
  if (modules.includes('tickets')) {
    variables.imports += 'import Tickets from \'@/pages/Tickets\';\n';
    variables.imports += 'import TicketView from \'@/pages/TicketView\';\n';
  }
  
  // Bill imports
  if (modules.includes('prepaid')) {
    variables.imports += 'import Prepaid from \'@/pages/Prepaid\';\n';
  }
  if (modules.includes('postpaid')) {
    variables.imports += 'import Postpaid from \'@/pages/Postpaid\';\n';
  }
  
  // DTR imports
  if (modules.includes('dtr_dashboard')) {
    variables.imports += 'import Feeders from \'@/pages/Feeders\';\n';
  }

  // Generate all routes
  variables.routes = [];
  variables.pageTitles = [];
  
  // Dashboard routes - smart route generation
  const dashboardRouteModules = [];
  if (modules.includes('consumer_dashboard')) dashboardRouteModules.push('consumer_dashboard');
  if (modules.includes('dtr_dashboard')) dashboardRouteModules.push('dtr_dashboard');
  
  if (dashboardRouteModules.length === 0) {
    // No dashboard modules - don't add any dashboard routes
  } else if (dashboardRouteModules.length === 1) {
    // Single dashboard module - make it the main dashboard
    const singleModule = dashboardRouteModules[0];
    if (singleModule === 'consumer_dashboard') {
      variables.routes.push('            <Route path="/" element={<Dashboard />} />');
      variables.pageTitles.push('    \'/\': \'Consumer Dashboard\'');
    } else if (singleModule === 'dtr_dashboard') {
      variables.routes.push('            <Route path="/" element={<DTRDashboard />} />');
      variables.pageTitles.push('    \'/\': \'DTR Dashboard\'');
    }
  } else {
    // Multiple dashboard modules - Consumer Dashboard is default, DTR Dashboard gets its own route
    variables.routes.push('            <Route path="/" element={<Dashboard />} />');
    variables.routes.push('            <Route path="/dtr-dashboard" element={<DTRDashboard />} />');
    variables.pageTitles.push('    \'/\': \'Consumer Dashboard\'');
    variables.pageTitles.push('    \'/dtr-dashboard\': \'DTR Dashboard\'');
  }
  
  // Consumer routes
  if (modules.includes('consumer')) {
    variables.routes.push('            <Route path="/consumers" element={<Consumers />} />');
    variables.pageTitles.push('    \'/consumers\': \'Consumers\'');
  }
  if (modules.includes('consumer_view')) {
    variables.routes.push('            <Route path="/consumer/:consumerId" element={<ConsumerView />} />');
  }
  
  // Bills routes
  if (modules.includes('prepaid')) {
    variables.routes.push('            <Route path="/bills/prepaid" element={<Prepaid />} />');
    variables.pageTitles.push('    \'/bills/prepaid\': \'Prepaid Bills\'');
  }
  if (modules.includes('postpaid')) {
    variables.routes.push('            <Route path="/bills/postpaid" element={<Postpaid />} />');
    variables.pageTitles.push('    \'/bills/postpaid\': \'Postpaid Bills\'');
  }
  
  // Asset management routes
  if (modules.includes('asset_management')) {
    variables.routes.push('            <Route path="/asset-management" element={<AssetManagement />} />');
    variables.pageTitles.push('    \'/asset-management\': \'Asset Management\'');
  }
  
  // Meter management routes
  if (modules.includes('meter_management') || modules.includes('meter_list')) {
    variables.routes.push('            <Route path="/meters" element={<Meters />} />');
    variables.pageTitles.push('    \'/meters\': \'Meters\'');
    variables.routes.push('            <Route path="/meter-details/:meterSlNo" element={<MeterDetails />} />');
    variables.pageTitles.push('    \'/meter-details/:meterSlNo\': \'Meter Details\'');
  }
  
  // Tickets routes
  if (modules.includes('tickets')) {
    variables.routes.push('            <Route path="/all-tickets" element={<Tickets />} />');
    variables.pageTitles.push('    \'/all-tickets\': \'All Tickets\'');
    variables.routes.push('            <Route path="/tickets/:ticketId" element={<TicketView />} />');
    variables.pageTitles.push('    \'/tickets/:ticketId\': \'Ticket View\'');
  }
  
  // User management routes
  if (modules.includes('user_management_default') || modules.includes('users')) {
    variables.routes.push('            <Route path="/users" element={<Users />} />');
    variables.pageTitles.push('    \'/users\': \'Users\'');
  }
  if (modules.includes('role_management')) {
    variables.routes.push('            <Route path="/role-management" element={<RoleManagement />} />');
    variables.pageTitles.push('    \'/role-management\': \'Role Management\'');
  }
  
  // DTR routes
  if (modules.includes('dtr_dashboard')) {
    variables.routes.push('            <Route path="/dtr/:dtrId" element={<Feeders />} />');
    variables.pageTitles.push('    \'/dtr/:dtrId\': \'Feeders\'');
  }

  // Convert arrays to template strings
  variables.routes = variables.routes.join('\n');
  variables.pageTitles = variables.pageTitles.join(',\n');
  
  // Generate menu items for sidebar
  variables.menuItems = '';
  
  // Dashboard menu items - smart submenu logic
  const dashboardSubmenus = [];
  if (modules.includes('consumer_dashboard')) {
    dashboardSubmenus.push({
      title: 'Consumer Dashboard',
      link: '/',
    });
  }
  if (modules.includes('dtr_dashboard')) {
    dashboardSubmenus.push({
      title: 'DTR Dashboard',
      link: '/dtr-dashboard',
    });
  }
  
  // Create smart dashboard menu
  if (dashboardSubmenus.length === 0) {
    // No dashboard modules selected - don't add dashboard menu
  } else if (dashboardSubmenus.length === 1) {
    // Single dashboard module - make it the main menu
    const singleDashboard = dashboardSubmenus[0];
    variables.menuItems += '    {\n';
    variables.menuItems += '      title: \'Dashboard\',\n'; // Always show as "Dashboard"
    variables.menuItems += '      icon: \'/icons/dashboard.svg\',\n';
    variables.menuItems += '      link: \'/\',\n'; // Always link to root path
    variables.menuItems += '    },\n';
  } else {
    // Multiple dashboard modules - create parent with submenus
    variables.menuItems += '    {\n';
    variables.menuItems += '      title: \'Dashboard\',\n';
    variables.menuItems += '      icon: \'/icons/dashboard.svg\',\n';
    variables.menuItems += '      hasSubmenu: true,\n';
    variables.menuItems += '      submenu: [\n';
    dashboardSubmenus.forEach(submenu => {
      variables.menuItems += '        {\n';
      variables.menuItems += `          title: '${submenu.title}',\n`;
      variables.menuItems += `          link: '${submenu.link}',\n`;
      variables.menuItems += '        },\n';
    });
    variables.menuItems += '      ],\n';
    variables.menuItems += '    },\n';
  }
  
  // Consumer menu items
  if (modules.includes('consumer')) {
    variables.menuItems += '    {\n';
    variables.menuItems += '      title: \'Consumers\',\n';
    variables.menuItems += '      icon: \'/icons/units.svg\',\n';
    variables.menuItems += '      link: \'/consumers\',\n';
    variables.menuItems += '    },\n';
  }
  
  // Bills menu items
  if (modules.includes('prepaid') && modules.includes('postpaid')) {
    variables.menuItems += '    {\n';
    variables.menuItems += '      title: \'Bills\',\n';
    variables.menuItems += '      icon: \'/icons/bills.svg\',\n';
    variables.menuItems += '      hasSubmenu: true,\n';
    variables.menuItems += '      submenu: [\n';
    variables.menuItems += '        {\n';
    variables.menuItems += '          title: \'Prepaid\',\n';
    variables.menuItems += '          link: \'/bills/prepaid\',\n';
    variables.menuItems += '        },\n';
    variables.menuItems += '        {\n';
    variables.menuItems += '          title: \'Postpaid\',\n';
    variables.menuItems += '          link: \'/bills/postpaid\',\n';
    variables.menuItems += '        },\n';
    variables.menuItems += '      ],\n';
    variables.menuItems += '    },\n';
  } else if (modules.includes('prepaid')) {
    variables.menuItems += '    {\n';
    variables.menuItems += '      title: \'Prepaid Bills\',\n';
    variables.menuItems += '      icon: \'/icons/bills.svg\',\n';
    variables.menuItems += '      link: \'/bills/prepaid\',\n';
    variables.menuItems += '    },\n';
  } else if (modules.includes('postpaid')) {
    variables.menuItems += '    {\n';
    variables.menuItems += '      title: \'Postpaid Bills\',\n';
    variables.menuItems += '      icon: \'/icons/bills.svg\',\n';
    variables.menuItems += '      link: \'/bills/postpaid\',\n';
    variables.menuItems += '    },\n';
  }
  
  // Asset management menu items
  if (modules.includes('asset_management')) {
    variables.menuItems += '    {\n';
    variables.menuItems += '      title: \'Assets\',\n';
    variables.menuItems += '      icon: \'/icons/workflow-setting-alt.svg\',\n';
    variables.menuItems += '      link: \'/asset-management\',\n';
    variables.menuItems += '    },\n';
  }
  
  // Meter management menu items
  if (modules.includes('meter_management') || modules.includes('meter_list')) {
    variables.menuItems += '    {\n';
    variables.menuItems += '      title: \'Meters\',\n';
    variables.menuItems += '      icon: \'/icons/meter-bolt.svg\',\n';
    variables.menuItems += '      link: \'/meters\',\n';
    variables.menuItems += '    },\n';
  }
  
  // Tickets menu items
  if (modules.includes('tickets')) {
    variables.menuItems += '    {\n';
    variables.menuItems += '      title: \'Tickets\',\n';
    variables.menuItems += '      icon: \'/icons/customer-service.svg\',\n';
    variables.menuItems += '      link: \'/all-tickets\',\n';
    variables.menuItems += '    },\n';
  }
  
  // User management menu items - smart submenu logic
  const userSubmenus = [];
  if (modules.includes('user_management_default') || modules.includes('users')) {
    userSubmenus.push({
      title: 'Users',
      link: '/users',
    });
  }
  if (modules.includes('role_management')) {
    userSubmenus.push({
      title: 'Role Management',
      link: '/role-management',
    });
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
  
  // Generate AppLayout component
  const appLayoutTemplate = path.join(__dirname, 'templates', 'frontend', 'src', 'components', 'AppLayout.tsx.template');
  const appLayoutContent = loadAndProcessTemplate(appLayoutTemplate, variables);
  
  // Ensure components directory exists
  const componentsDir = path.join(frontendDir, 'src', 'components');
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }
  
  // Write the AppLayout.tsx file
  fs.writeFileSync(path.join(componentsDir, 'AppLayout.tsx'), appLayoutContent);
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
  const sourceFilterStyleContext = path.join(__dirname, '..', 'frontend', 'src', 'contexts', 'FilterStyleContext.tsx');
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
}

module.exports = { generateFrontend }; 