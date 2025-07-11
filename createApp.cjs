const fs = require('fs');
const path = require('path');

function copyRecursive(src, dest) {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    // Read source directory
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            // Recursively copy directory
            copyRecursive(srcPath, destPath);
        } else {
            // Copy file
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function createAppProject(formData) {
    const { appName } = formData;
    const projectFolderName = appName.toLowerCase().replace(/\s+/g, '-');
    const projectPath = path.join(__dirname, 'generated-apps', projectFolderName);

    // Create project directory and copy assets silently
    if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath, { recursive: true });
    }
    if (!fs.existsSync(path.join(projectPath, 'public'))) {
        fs.mkdirSync(path.join(projectPath, 'public'), { recursive: true });
    }

    // Copy assets without logging
    const sourceFiles = {
        icons: ['frontend', 'public', 'icons'],
        images: ['frontend', 'public', 'images'],
        fonts: ['frontend', 'public', 'fonts'],
        styles: ['frontend', 'src', 'styles']
    };

    Object.entries(sourceFiles).forEach(([type, pathParts]) => {
        const sourceDir = path.join(__dirname, ...pathParts);
        const targetDir = type === 'styles' 
            ? path.join(projectPath, 'src', 'styles')
            : path.join(projectPath, 'public', type);

        if (fs.existsSync(sourceDir)) {
            try {
                copyRecursive(sourceDir, targetDir);
            } catch (error) {
                console.error(`Error copying ${type}:`, error);
                // Continue with other files even if one fails
            }
        }
    });

    // Only show essential information
    console.log(`✅ Project "${projectFolderName}" created successfully`);
    console.log('📁 Next steps:');
    console.log(`   1. cd generated-apps/${projectFolderName}`);
    console.log('   2. npm install');
    console.log('   3. npm run dev');

    return projectPath;
}

module.exports = {
    createAppProject
};

// If running directly, use example data
if (require.main === module) {
  const exampleFormData = {
    appName: "Example App",
    subdomain: "example-app",
    companyName: "Example Company",
    adminFirstName: "Admin",
    adminLastName: "User",
    adminEmail: "admin@example.com",
    adminRole: "Administrator",
    primaryColor: "#3B82F6",
    timezone: "UTC",
    currency: "USD",
    modules: ["dashboard", "user_management_default", "role_management"]
  };
  
  createAppProject(exampleFormData);
} 