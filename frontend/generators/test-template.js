const { loadAndProcessTemplate } = require('./utils/templateProcessor');
const path = require('path');

// Test the template processor
function testTemplateProcessor() {
  console.log('Testing template processor...');
  
  // Test variables - simulate what would be passed from app creation
  const variables = {
    consumerRoute: '',
    consumerError: '',
    modulesArray: JSON.stringify(['dashboard', 'role_management', 'dtr']),
    appName: 'Test App',
    companyName: 'Test Company',
    userManagementCase: '',
    roleManagementCase: 'case \'/role-management\':\n        return \'Role Management\';',
    consumerCase: '',
    billsPrepaidCase: '',
    billsPostpaidCase: '',
    ticketsCase: '',
    assetManagementCase: '',
    meterManagementCase: '',
    dtrCase: 'case \'/dtr-dashboard\':\n        return \'DTR Dashboard\';',
    billsPrepaidRoute: '',
    billsPostpaidRoute: '',
    assetManagementRoute: '',
    meterManagementRoute: '',
    dataLoggerRoute: '',
    ticketsRoute: '',
    usersRoute: '',
    roleManagementRoute: '<Route path="/role-management" element={<RoleManagement />} />',
    dtrRoute: '<Route path="/dtr-dashboard" element={<Transformer />} />',
    billsPrepaidError: '',
    billsPostpaidError: '',
    assetManagementError: '',
    meterManagementError: '',
    dataLoggerError: '',
    ticketsError: '',
    usersError: '',
    roleManagementError: '<li>/role-management - Role Management</li>',
    dtrError: '<li>/dtr-dashboard - DTR Dashboard</li>'
  };
  
  console.log('Variables count:', Object.keys(variables).length);
  console.log('Sample variables:', {
    consumerRoute: variables.consumerRoute,
    consumerError: variables.consumerError,
    appName: variables.appName,
    companyName: variables.companyName
  });
  
  // Test template
  const templatePath = path.join(__dirname, 'templates', 'frontend', 'src', 'App.tsx.template');
  
  try {
    console.log('Loading template from:', templatePath);
    const result = loadAndProcessTemplate(templatePath, variables);
    
    // Check for unreplaced placeholders
    const placeholders = result.match(/{{[^}]+}}/g);
    if (placeholders && placeholders.length > 0) {
      console.error('❌ Unreplaced placeholders found:', placeholders.length);
      console.error('First few placeholders:', placeholders.slice(0, 5));
    } else {
      console.log('✅ All placeholders replaced successfully');
    }
    
    // Check specific placeholders
    if (result.includes('{{consumerRoute}}')) {
      console.error('❌ consumerRoute placeholder still exists');
    } else {
      console.log('✅ consumerRoute placeholder replaced');
    }
    
    if (result.includes('{{consumerError}}')) {
      console.error('❌ consumerError placeholder still exists');
    } else {
      console.log('✅ consumerError placeholder replaced');
    }
    
    if (result.includes('{{appName}}')) {
      console.error('❌ appName placeholder still exists');
    } else {
      console.log('✅ appName placeholder replaced');
    }
    
    if (result.includes('{{companyName}}')) {
      console.error('❌ companyName placeholder still exists');
    } else {
      console.log('✅ companyName placeholder replaced');
    }
    
    if (result.includes('{{dtrCase}}')) {
      console.error('❌ dtrCase placeholder still exists');
    } else {
      console.log('✅ dtrCase placeholder replaced');
    }
    
    if (result.includes('{{dtrRoute}}')) {
      console.error('❌ dtrRoute placeholder still exists');
    } else {
      console.log('✅ dtrRoute placeholder replaced');
    }
    
    if (result.includes('{{dtrError}}')) {
      console.error('❌ dtrError placeholder still exists');
    } else {
      console.log('✅ dtrError placeholder replaced');
    }
    
  } catch (error) {
    console.error('❌ Error testing template processor:', error.message);
  }
}

testTemplateProcessor(); 