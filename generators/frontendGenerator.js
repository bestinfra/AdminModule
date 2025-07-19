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
    modules
  } = formData;

  const frontendDir = path.join(baseDir, 'frontend');
  
  // Create variables for template replacement
  const variables = {
    appName: appName || 'Admin App',
    projectFolderName: appName?.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'my-admin-app',
    companyName: companyName || 'Company',
    adminFirstName: adminFirstName || 'Admin',
    adminLastName: adminLastName || 'User',
    primaryColor: primaryColor || '#163b7c',
    secondaryColor: secondaryColor || '#55b56c',
    textPrimaryColor: textPrimaryColor || '#262626',
    textSecondaryColor: textSecondaryColor || '#7e7e7e',
    backgroundColor: backgroundColor || '#f5f8fc',
    borderColor: borderColor || '#e9efff',
    shadowColor: shadowColor || '#dce4ef',
    iconColor: iconColor || '#476189',
    gradientColor: gradientColor || '#163b7c',
    modules: modules || []
  };

  // Copy template directory
  const templateDir = path.join(__dirname, 'templates', 'frontend');
  copyTemplateDirectory(templateDir, frontendDir, variables);

  // Generate additional files that need complex logic
  generateAppComponent(frontendDir, variables);
  generateContextFiles(frontendDir, variables);
  generateComponentFiles(frontendDir, variables);
  generateTypeDefinitions(frontendDir, variables);
  generateThemeFile(frontendDir, variables);
  generateReadme(frontendDir, variables);

  console.log('Frontend generated successfully');
}

/**
 * Generate the main App.tsx component
 */
function generateAppComponent(frontendDir, variables) {
  const appTemplate = path.join(__dirname, 'templates', 'frontend', 'src', 'App.tsx.template');
  const appContent = loadAndProcessTemplate(appTemplate, variables);
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
    'Sidebar.tsx.template',
    'Header.tsx.template',
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

module.exports = { generateFrontend }; 