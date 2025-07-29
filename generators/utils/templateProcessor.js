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
    // Only replace if the key matches valid variable name pattern
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      const replacement = value !== undefined && value !== null ? String(value) : '';
      processedContent = processedContent.replace(placeholder, replacement);
    }
  });
  
  // Remove any remaining template placeholders that weren't replaced
  // But be careful not to remove JSX expressions like {{ from: location }}
  processedContent = processedContent.replace(/\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g, '');
  
  // Clean up any lines that are now empty after placeholder removal
  processedContent = processedContent
    .split('\n')
    .filter(line => line.trim() !== '')
    .join('\n');
  
  // Remove empty lines and clean up the output
  processedContent = processedContent
    .replace(/^\s*[\r\n]/gm, '') // Remove empty lines
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Replace multiple empty lines with double line breaks
    .replace(/^\s+$/gm, '') // Remove lines that are only whitespace
    .trim(); // Remove leading/trailing whitespace
  
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
 * @param {Array<string>} excludeFiles - Optional array of template files to exclude from copying
 */
function copyTemplateDirectory(sourceDir, destDir, variables, excludeFiles = []) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const items = fs.readdirSync(sourceDir);

  items.forEach((item) => {
    const sourcePath = path.join(sourceDir, item);
    const destPath = path.join(destDir, item);

    if (fs.statSync(sourcePath).isDirectory()) {
      // Recursively copy directories
      copyTemplateDirectory(sourcePath, destPath, variables, excludeFiles);
    } else {
      // Check if this file should be excluded
      if (excludeFiles.includes(item)) {
        console.log(`Skipping excluded template: ${item}`);
        return;
      }
      
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