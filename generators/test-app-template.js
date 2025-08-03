const fs = require('fs');
const path = require('path');
const { loadAndProcessTemplate } = require('./utils/templateProcessor');

// Test the App.tsx template generation
function testAppTemplate() {
  console.log('🧪 Testing App.tsx template generation...\n');

  // Test data with both dashboard modules to trigger the duplicate import scenario
  const testVariables = {
    appName: 'TestApp',
    modules: ['consumer_dashboard', 'dtr_dashboard', 'consumer', 'tickets'],
    imports: 'import Dashboard from \'@/pages/Dashboard\';\nimport DTRDashboard from \'@/pages/DTRDashboard\';\nimport Consumers from \'@/pages/Consumers\';\nimport Tickets from \'@/pages/Tickets\';\n'
  };

  try {
    const templatePath = path.join(__dirname, 'templates', 'frontend', 'src', 'App.tsx.template');
    console.log('📁 Template path:', templatePath);
    console.log('📄 Template exists:', fs.existsSync(templatePath));
    
    const content = loadAndProcessTemplate(templatePath, testVariables);
    console.log('📝 Content length:', content.length);
    console.log('📝 First 500 chars:', content.substring(0, 500));
    
    // Check for duplicate imports
    const importLines = content.split('\n').filter(line => line.trim().startsWith('import'));
    const importNames = importLines.map(line => {
      const match = line.match(/import\s+(\w+)\s+from/);
      return match ? match[1] : null;
    }).filter(Boolean);

    console.log('📋 Generated imports:');
    importLines.forEach((line, index) => {
      console.log(`  ${index + 1}. ${line.trim()}`);
    });

    console.log('\n🔍 Checking for duplicates...');
    const duplicates = importNames.filter((name, index) => importNames.indexOf(name) !== index);
    
    if (duplicates.length > 0) {
      console.log('❌ Found duplicate imports:', duplicates);
      return false;
    } else {
      console.log('✅ No duplicate imports found!');
      return true;
    }

  } catch (error) {
    console.error('❌ Error testing App.tsx template:', error);
    return false;
  }
}

// Run the test
const success = testAppTemplate();
console.log(`\n${success ? '✅' : '❌'} App.tsx template test ${success ? 'passed' : 'failed'}`); 