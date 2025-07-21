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
    primaryColor: primaryColor || '#163b7c',
    secondaryColor: secondaryColor || '#55b56c',
    textPrimaryColor: textPrimaryColor || '#262626',
    textSecondaryColor: textSecondaryColor || '#7e7e7e',
    backgroundColor: backgroundColor || '#f5f8fc',
    borderColor: borderColor || '#e9efff',
    shadowColor: shadowColor || '#dce4ef',
    iconColor: iconColor || '#476189',
    gradientColor: gradientColor || '#163b7c',
    modules: modules || [],
    backendPort: backendPort || 4000
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
  generateEnvFile(frontendDir, variables);
  generateApiUtils(frontendDir, variables);

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