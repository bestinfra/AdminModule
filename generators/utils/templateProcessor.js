const fs = require('fs');
const path = require('path');

/**
 * Process a template file by replacing placeholders with actual values
 * @param {string} templateContent - The template content
 * @param {Object} variables - Variables to replace in the template
 * @returns {string} - Processed content
 */
function processTemplate(templateContent, variables) {
  let processedContent = templateContent;
  
  // Replace all {{variable}} placeholders with actual values
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    processedContent = processedContent.replace(placeholder, value || '');
  });
  
  return processedContent;
}

/**
 * Load and process a template file
 * @param {string} templatePath - Path to the template file
 * @param {Object} variables - Variables to replace in the template
 * @returns {string} - Processed content
 */
function loadAndProcessTemplate(templatePath, variables) {
  try {
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    return processTemplate(templateContent, variables);
  } catch (error) {
    console.error(`Error loading template ${templatePath}:`, error.message);
    throw error;
  }
}

/**
 * Copy template directory recursively with variable replacement
 * @param {string} sourceDir - Source template directory
 * @param {string} destDir - Destination directory
 * @param {Object} variables - Variables to replace in templates
 */
function copyTemplateDirectory(sourceDir, destDir, variables) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const items = fs.readdirSync(sourceDir);

  items.forEach((item) => {
    const sourcePath = path.join(sourceDir, item);
    const destPath = path.join(destDir, item);

    if (fs.statSync(sourcePath).isDirectory()) {
      // Recursively copy directories
      copyTemplateDirectory(sourcePath, destPath, variables);
    } else {
      // Process template files
      if (item.endsWith('.template')) {
        const processedContent = loadAndProcessTemplate(sourcePath, variables);
        const finalPath = destPath.replace('.template', '');
        fs.writeFileSync(finalPath, processedContent);
      } else {
        // Copy non-template files as-is
        fs.copyFileSync(sourcePath, destPath);
      }
    }
  });
}

module.exports = {
  processTemplate,
  loadAndProcessTemplate,
  copyTemplateDirectory
}; 