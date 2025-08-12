const fs = require('fs');
const path = require('path');
const { copyTemplateDirectory, loadAndProcessTemplate, processTemplate } = require('./utils/templateProcessor');

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
  
  const variables = {
    appName: appName || 'Admin App',
    projectFolderName: appName?.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'my-admin-app',
    companyName: companyName || 'Company',
    adminFirstName: adminFirstName || 'Admin',
    adminLastName: adminLastName || 'User',
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

  const templateDir = path.join(__dirname, 'templates', 'frontend');
  copyTemplateDirectory(templateDir, frontendDir, variables, ['App.tsx.template']);

  generateAuthComponents(frontendDir, variables);
  
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

function generateAppComponent(frontendDir, variables) {
  const modules = variables.modules || [];
  const imports = [];
  
  const moduleConfig = [
    {
      name: 'dashboard',
      title: 'Dashboard',
      icon: '/icons/dashboard.svg',
      subModules: [
        { name: 'consumer_dashboard', component: 'ConsumerDashboard', route: '/consumer-dashboard', title: 'Consumer Dashboard' },
        { name: 'dtr_dashboard', component: 'DTRDashboard', route: '/dtr-dashboard', title: 'DTR Dashboard' },
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
      name: 'user_management_default',
      title: 'User Management',
      icon: '/icons/user.svg',
      subModules: [
        { name: 'users', component: 'Users', route: '/users', title: 'Users' },
        { name: 'user_detail', component: 'UserDetail', route: '/users/:userId', title: 'User Detail' },
        { name: 'add_user', component: 'AddUser', route: '/add-user', title: 'Add User' },
        { name: 'role_management', component: 'RoleManagement', route: '/role-management', title: 'Role Management' }
      ]
    },
    {
      name: 'asset_management',
      title: 'Asset Management',
      icon: '/icons/workflow-setting-alt.svg',
      subModules: [
        { name: 'asset_management', component: 'AssetManagement', route: '/asset-management', title: 'Assets' },
      ]
    },
    {
      name: 'meter_management',
      title: 'Meter Management',
      icon: '/icons/meter-bolt.svg',
      subModules: [
        { name: 'data_logger_master', component: 'DataLogger', route: '/data-logger', title: 'Data Logger' },
        { name: 'meter_list', component: 'MetersList', route: '/meters', title: 'Meter List' },
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
    },
    {
      name: 'consumer',
      title: 'Consumer Management',
      icon: '/icons/customer-service.svg',
      subModules: [
        { name: 'consumer', component: 'Consumers', route: '/consumers', title: 'Consumer Management' },
        { name: 'consumer_view', component: 'ConsumerView', route: '/consumers/:consumerId', title: 'Consumer View' }
      ]
    }
  ];

  const processedComponents = new Set(); 
  
  const allSubModules = [];
  moduleConfig.forEach(parentModule => {
    parentModule.subModules.forEach(subModule => {
      allSubModules.push(subModule);
    });
  });
  
  modules.forEach(selectedModule => {
    const subModule = allSubModules.find(sub => sub.name === selectedModule);
    if (subModule && !processedComponents.has(subModule.component)) {
      imports.push(`import ${subModule.component} from '@/pages/${subModule.component}';`);
      processedComponents.add(subModule.component);
    }
    
    if (selectedModule === 'meter_list') {
      const meterDetailsSubModule = allSubModules.find(sub => sub.name === 'meter_details');
      if (meterDetailsSubModule && !processedComponents.has(meterDetailsSubModule.component)) {
        imports.push(`import ${meterDetailsSubModule.component} from '@/pages/${meterDetailsSubModule.component}';`);
        processedComponents.add(meterDetailsSubModule.component);
      }
    }
    
    if (selectedModule === 'consumer') {
      const consumerViewSubModule = allSubModules.find(sub => sub.name === 'consumer_view');
      if (consumerViewSubModule && !processedComponents.has(consumerViewSubModule.component)) {
        imports.push(`import ${consumerViewSubModule.component} from '@/pages/${consumerViewSubModule.component}';`);
        processedComponents.add(consumerViewSubModule.component);
      }
    }
    
    if (selectedModule === 'users') {
      const userDetailSubModule = allSubModules.find(sub => sub.name === 'user_detail');
      if (userDetailSubModule && !processedComponents.has(userDetailSubModule.component)) {
        imports.push(`import ${userDetailSubModule.component} from '@/pages/${userDetailSubModule.component}';`);
        processedComponents.add(userDetailSubModule.component);
      }
      
      const addUserSubModule = allSubModules.find(sub => sub.name === 'add_user');
      if (addUserSubModule && !processedComponents.has(addUserSubModule.component)) {
        imports.push(`import ${addUserSubModule.component} from '@/pages/${addUserSubModule.component}';`);
        processedComponents.add(addUserSubModule.component);
      }
    }
    
    if (selectedModule === 'tickets') {
      const ticketViewSubModule = allSubModules.find(sub => sub.name === 'ticket_view');
      if (ticketViewSubModule && !processedComponents.has(ticketViewSubModule.component)) {
        imports.push(`import ${ticketViewSubModule.component} from '@/pages/${ticketViewSubModule.component}';`);
        processedComponents.add(ticketViewSubModule.component);
      }
      
      const addTicketSubModule = allSubModules.find(sub => sub.name === 'add_ticket');
      if (addTicketSubModule && !processedComponents.has(addTicketSubModule.component)) {
        imports.push(`import ${addTicketSubModule.component} from '@/pages/${addTicketSubModule.component}';`);
        processedComponents.add(addTicketSubModule.component);
      }
    }
  });
  
  if (!modules.includes('dashboard') && modules.length > 0) {
    imports.push('import { Navigate } from \'react-router-dom\';');
  }
  
  variables.imports = imports.join('\n');
  

  const routes = [];
  const processedRoutes = new Set(); 
  
  const dashboardSubModules = ['consumer_dashboard', 'dtr_dashboard'];
  const selectedDashboardModules = modules.filter(module => dashboardSubModules.includes(module));
  let mainDashboard = null;
  
  if (selectedDashboardModules.length === 1) {
    const selectedModule = selectedDashboardModules[0];
    const subModule = allSubModules.find(sub => sub.name === selectedModule);
    if (subModule) {
      mainDashboard = subModule.component;
      routes.push(`<Route path="/" element={<${mainDashboard} />} />`);
    }
  } else if (selectedDashboardModules.length > 1) {
    const firstSelectedModule = selectedDashboardModules[0];
    const subModule = allSubModules.find(sub => sub.name === firstSelectedModule);
    if (subModule) {
      mainDashboard = subModule.component;
      routes.push(`<Route path="/" element={<${mainDashboard} />} />`);
      routes.push(`<Route path="/dashboard" element={<${mainDashboard} />} />`);
    }
  }
  
  modules.forEach(selectedModule => {
    if (dashboardSubModules.includes(selectedModule)) {
      return;
    }
    
    const subModule = allSubModules.find(sub => sub.name === selectedModule);
    if (subModule) {
      const routeKey = `${subModule.route}-${subModule.component}`;
      if (!processedRoutes.has(routeKey)) {
        routes.push(`<Route path="${subModule.route}" element={<${subModule.component} />} />`);
        processedRoutes.add(routeKey);
      }
      
      if (selectedModule === 'meter_list') {
        const meterDetailsSubModule = allSubModules.find(sub => sub.name === 'meter_details');
        if (meterDetailsSubModule) {
          const detailsRouteKey = `${meterDetailsSubModule.route}-${meterDetailsSubModule.component}`;
          if (!processedRoutes.has(detailsRouteKey)) {
            routes.push(`<Route path="${meterDetailsSubModule.route}" element={<${meterDetailsSubModule.component} />} />`);
            processedRoutes.add(detailsRouteKey);
          }
        }
      }
      
      if (selectedModule === 'consumer') {
        const consumerViewSubModule = allSubModules.find(sub => sub.name === 'consumer_view');
        if (consumerViewSubModule) {
          const viewRouteKey = `${consumerViewSubModule.route}-${consumerViewSubModule.component}`;
          if (!processedRoutes.has(viewRouteKey)) {
            routes.push(`<Route path="${consumerViewSubModule.route}" element={<${consumerViewSubModule.component} />} />`);
            processedRoutes.add(viewRouteKey);
          }
        }
      }
      
      if (selectedModule === 'users') {
        const userDetailSubModule = allSubModules.find(sub => sub.name === 'user_detail');
        if (userDetailSubModule) {
          const detailRouteKey = `${userDetailSubModule.route}-${userDetailSubModule.component}`;
          if (!processedRoutes.has(detailRouteKey)) {
            routes.push(`<Route path="${userDetailSubModule.route}" element={<${userDetailSubModule.component} />} />`);
            processedRoutes.add(detailRouteKey);
          }
        }
        
        const addUserSubModule = allSubModules.find(sub => sub.name === 'add_user');
        if (addUserSubModule) {
          const addUserRouteKey = `${addUserSubModule.route}-${addUserSubModule.component}`;
          if (!processedRoutes.has(addUserRouteKey)) {
            routes.push(`<Route path="${addUserSubModule.route}" element={<${addUserSubModule.component} />} />`);
            processedRoutes.add(addUserRouteKey);
          }
        }
      }
      
      if (selectedModule === 'tickets') {
        const ticketViewSubModule = allSubModules.find(sub => sub.name === 'ticket_view');
        if (ticketViewSubModule) {
          const viewRouteKey = `${ticketViewSubModule.route}-${ticketViewSubModule.component}`;
          if (!processedRoutes.has(viewRouteKey)) {
            routes.push(`<Route path="${ticketViewSubModule.route}" element={<${ticketViewSubModule.component} />} />`);
            processedRoutes.add(viewRouteKey);
          }
        }
        
        const addTicketSubModule = allSubModules.find(sub => sub.name === 'add_ticket');
        if (addTicketSubModule) {
          const addTicketRouteKey = `${addTicketSubModule.route}-${addTicketSubModule.component}`;
          if (!processedRoutes.has(addTicketRouteKey)) {
            routes.push(`<Route path="${addTicketSubModule.route}" element={<${addTicketSubModule.component} />} />`);
            processedRoutes.add(addTicketRouteKey);
          }
        }
      }
    }
  });
  
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
  
  if (modules.length === 0) {
    routes.push('<Route path="/" element={<div className="flex items-center justify-center min-h-screen"><h1 className="text-2xl font-bold">Welcome to ' + variables.appName + '</h1></div>} />');
  }
  
  variables.routes = routes.join('\n              ');
  
  variables.appName = variables.appName || 'Admin App';
  variables.companyName = variables.companyName || 'Company';
  
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
      { path: '/users', title: 'Users' },
      { path: '/users/:userId', title: 'User Detail' },
      { path: '/add-user', title: 'Add User' }
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
    'data_logger_master': [
      { path: '/data-logger', title: 'Data Logger' }
    ],
    'meter_list': [
      { path: '/meters', title: 'Meter List' },
      { path: '/meter-details/:meterId', title: 'Meter Details' }
    ],
    'meter_details': [
      { path: '/meter-details/:meterId', title: 'Meter Details' }
    ],
    'add_meter': [
      { path: '/add-meter', title: 'Add Meter' }
    ],
    'consumer': [
      { path: '/consumers', title: 'Consumer Management' },
      { path: '/consumers/:consumerId', title: 'Consumer View' }
    ]
  };

  const pageTitles = [];
  const addedPaths = new Set();
  
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
  
  if (mainDashboard) {
    if (selectedDashboardModules.length === 1) {
      const selectedModule = selectedDashboardModules[0];
      const subModule = allSubModules.find(sub => sub.name === selectedModule);
      if (subModule) {
        pageTitles.push(`    '/': '${subModule.title}'`);
      }
    } else if (selectedDashboardModules.length > 1) {
      const firstSelectedModule = selectedDashboardModules[0];
      const subModule = allSubModules.find(sub => sub.name === firstSelectedModule);
      if (subModule) {
        pageTitles.push(`    '/': '${subModule.title}'`);
        pageTitles.push(`    '/dashboard': '${subModule.title}'`);
      }
    }
  }
  
  variables.pageTitles = pageTitles.join(',\n');
  
  variables.menuItems = '';
  
  const menuItems = [];
  
  if (selectedDashboardModules.length === 1) {
    const selectedModule = selectedDashboardModules[0];
    const subModule = allSubModules.find(sub => sub.name === selectedModule);
    if (subModule) {
      menuItems.push(`    { title: '${subModule.title}', icon: '/icons/dashboard.svg', link: '/' }`);
    }
  } else if (selectedDashboardModules.length > 1) {
    const firstSelectedModule = selectedDashboardModules[0];
    const subModule = allSubModules.find(sub => sub.name === firstSelectedModule);
    if (subModule) {
      menuItems.push(`    { title: '${subModule.title}', icon: '/icons/dashboard.svg', link: '/dashboard' }`);
    }
  }
  
  modules.forEach(selectedModule => {
    if (dashboardSubModules.includes(selectedModule)) {
      return;
    }
    
    const subModule = allSubModules.find(sub => sub.name === selectedModule);
    if (subModule) {
      const icon = getModuleIcon(selectedModule);
      menuItems.push(`    { title: '${subModule.title}', icon: '${icon}', link: '${subModule.route}' }`);
    } else {
      const parentModule = moduleConfig.find(m => m.name === selectedModule);
      if (parentModule && parentModule.subModules) {
        if (parentModule.subModules.length === 1) {
          const sub = parentModule.subModules[0];
          menuItems.push(`    { title: '${sub.title}', icon: '${parentModule.icon}', link: '${sub.route}' }`);
        } else {
          menuItems.push(`    {\n      title: '${parentModule.title}',\n      icon: '${parentModule.icon}',\n      hasSubmenu: true,\n      submenu: [\n`);
          parentModule.subModules.forEach(sub => {
            menuItems.push(`        {\n          title: '${sub.title}',\n          link: '${sub.route}',\n        },\n`);
          });
          menuItems.push(`      ],\n    },\n`);
        }
      }
    }
  });
  
  variables.menuItems = menuItems.join(',\n');
  
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

function getModuleIcon(moduleName) {
  const iconMap = {
    'users': '/icons/user.svg',
    'user_detail': '/icons/user.svg',
    'add_user': '/icons/user.svg',
    'role_management': '/icons/roles.svg',
    'prepaid': '/icons/bills.svg',
    'postpaid': '/icons/bills.svg',
    'tickets': '/icons/customer-service.svg',
    'ticket_view': '/icons/customer-service.svg',
    'asset_management': '/icons/workflow-setting-alt.svg',
    'data_logger_master': '/icons/meter-bolt.svg',
    'meter_list': '/icons/meter-bolt.svg',
    'meter_details': '/icons/meter-bolt.svg',
    'add_meter': '/icons/meter-bolt.svg',
    'consumer': '/icons/customer-service.svg',
    'consumer_view': '/icons/customer-service.svg',
    'consumer_dashboard': '/icons/dashboard.svg',
    'dtr_dashboard': '/icons/dashboard.svg'
  };
  
  return iconMap[moduleName] || '/icons/apps-icon.svg';
}

function generateContextFiles(frontendDir, variables) {
  const contextDir = path.join(frontendDir, 'src', 'context');
  fs.mkdirSync(contextDir, { recursive: true });

  const appContextTemplate = path.join(__dirname, 'templates', 'frontend', 'src', 'context', 'AppContext.tsx.template');
  const appContextContent = loadAndProcessTemplate(appContextTemplate, variables);
  const appContextPath = path.join(contextDir, 'AppContext.tsx');
  fs.writeFileSync(appContextPath, appContextContent);

  const contextsDir = path.join(frontendDir, 'src', 'contexts');
  fs.mkdirSync(contextsDir, { recursive: true });

  const sourceFilterStyleContext = path.join(__dirname, '..', 'frontend', 'src', 'contexts', 'FilterStyleContext.tsx', 'api');
  const targetFilterStyleContext = path.join(contextsDir, 'FilterStyleContext.tsx');
  
  if (fs.existsSync(sourceFilterStyleContext)) {
    fs.copyFileSync(sourceFilterStyleContext, targetFilterStyleContext);
    console.log('✅ Copied FilterStyleContext.tsx to sub-app');
  } else {
    console.warn('⚠️  FilterStyleContext.tsx not found in main frontend, skipping...');
  }
}

function generateHooksFiles(frontendDir, variables) {
  const hooksDir = path.join(frontendDir, 'src', 'hooks');
  fs.mkdirSync(hooksDir, { recursive: true });

  const sourceIconFilterHook = path.join(__dirname, '..', 'frontend', 'src', 'hooks', 'useIconFilterStyle.ts');
  const targetIconFilterHook = path.join(hooksDir, 'useIconFilterStyle.ts');
  
  if (fs.existsSync(sourceIconFilterHook)) {
    fs.copyFileSync(sourceIconFilterHook, targetIconFilterHook);
    console.log('✅ Copied useIconFilterStyle.ts to sub-app');
  } else {
    console.warn('⚠️  useIconFilterStyle.ts not found in main frontend, skipping...');
  }
}

function generateComponentFiles(frontendDir, variables) {
  const componentsDir = path.join(frontendDir, 'src', 'components');
  fs.mkdirSync(componentsDir, { recursive: true });

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

function generateTypeDefinitions(frontendDir, variables) {
  const typesDir = path.join(frontendDir, 'src', 'types');
  fs.mkdirSync(typesDir, { recursive: true });

  const federationTemplate = path.join(__dirname, 'templates', 'frontend', 'src', 'types', 'federation.d.ts.template');
  const federationContent = loadAndProcessTemplate(federationTemplate, variables);
  const federationPath = path.join(typesDir, 'federation.d.ts');
  fs.writeFileSync(federationPath, federationContent);
}

function generateThemeFile(frontendDir, variables) {
  const themeTemplate = path.join(__dirname, 'templates', 'frontend', 'src', 'Theme.jsx.template');
  const themeContent = loadAndProcessTemplate(themeTemplate, variables);
  const themePath = path.join(frontendDir, 'src', 'Theme.jsx');
  fs.writeFileSync(themePath, themeContent);
}

function generateReadme(frontendDir, variables) {
  const readmeTemplate = path.join(__dirname, 'templates', 'frontend', 'README.md.template');
  const readmeContent = loadAndProcessTemplate(readmeTemplate, variables);
  const readmePath = path.join(frontendDir, 'README.md');
  fs.writeFileSync(readmePath, readmeContent);
}

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

function generateAuthComponents(frontendDir, variables) {
  const authDir = path.join(frontendDir, 'src', 'components', 'auth');
  fs.mkdirSync(authDir, { recursive: true });

  const authWrapperTemplate = path.join(__dirname, 'templates', 'frontend', 'src', 'components', 'auth', 'LocalAuthWrapper.tsx.template');
  if (fs.existsSync(authWrapperTemplate)) {
    const authWrapperContent = loadAndProcessTemplate(authWrapperTemplate, variables);
    const authWrapperPath = path.join(authDir, 'LocalAuthWrapper.tsx');
    fs.writeFileSync(authWrapperPath, authWrapperContent);
  }

  const protectedRouteTemplate = path.join(__dirname, 'templates', 'frontend', 'src', 'components', 'auth', 'LocalProtectedRoute.tsx.template');
  if (fs.existsSync(protectedRouteTemplate)) {
    const protectedRouteContent = loadAndProcessTemplate(protectedRouteTemplate, variables);
    const protectedRoutePath = path.join(authDir, 'LocalProtectedRoute.tsx');
    fs.writeFileSync(protectedRoutePath, protectedRouteContent);
  }

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
  
  copyApiFiles(frontendDir, variables);
}

function copyApiFiles(frontendDir, variables) {
  const apiDir = path.join(frontendDir, 'src', 'api');
  const sourceApiDir = path.join(__dirname, '..', 'frontend', 'src', 'api');
  
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
        let content = fs.readFileSync(sourcePath, 'utf8');
        
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