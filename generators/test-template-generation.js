const fs = require('fs');
const path = require('path');
const { loadAndProcessTemplate } = require('./utils/templateProcessor');

// Test variables
const testVariables = {
  appName: 'TestApp',
  companyName: 'Test Company',
  modules: ['tickets', 'users'],
  modulesArray: JSON.stringify(['tickets', 'users'])
};

console.log('🧪 Testing template generation...\n');

// Test LocalAuthWrapper template
console.log('1. Testing LocalAuthWrapper template...');
const authWrapperTemplate = path.join(__dirname, 'templates', 'frontend', 'src', 'components', 'auth', 'LocalAuthWrapper.tsx.template');
if (fs.existsSync(authWrapperTemplate)) {
  try {
    const content = loadAndProcessTemplate(authWrapperTemplate, testVariables);
    console.log('✅ LocalAuthWrapper template processed successfully');
    console.log('   - Contains default export:', content.includes('export default AuthProvider'));
    console.log('   - Contains appName replacement:', content.includes('TestApp'));
  } catch (error) {
    console.error('❌ LocalAuthWrapper template failed:', error.message);
  }
} else {
  console.error('❌ LocalAuthWrapper template not found');
}

console.log('');

// Test LocalProtectedRoute template
console.log('2. Testing LocalProtectedRoute template...');
const protectedRouteTemplate = path.join(__dirname, 'templates', 'frontend', 'src', 'components', 'auth', 'LocalProtectedRoute.tsx.template');
if (fs.existsSync(protectedRouteTemplate)) {
  try {
    const content = loadAndProcessTemplate(protectedRouteTemplate, testVariables);
    console.log('✅ LocalProtectedRoute template processed successfully');
    console.log('   - Contains default export:', content.includes('export default ProtectedRoute'));
  } catch (error) {
    console.error('❌ LocalProtectedRoute template failed:', error.message);
  }
} else {
  console.error('❌ LocalProtectedRoute template not found');
}

console.log('');

// Test App.tsx template
console.log('3. Testing App.tsx template...');
const appTemplate = path.join(__dirname, 'templates', 'frontend', 'src', 'App.tsx.template');
if (fs.existsSync(appTemplate)) {
  try {
    const content = loadAndProcessTemplate(appTemplate, testVariables);
    console.log('✅ App.tsx template processed successfully');
    console.log('   - Contains lazy imports:', content.includes('React.lazy(() => import'));
    console.log('   - Contains error handling:', content.includes('.catch(error =>'));
    console.log('   - Contains appName replacement:', content.includes('TestApp'));
  } catch (error) {
    console.error('❌ App.tsx template failed:', error.message);
  }
} else {
  console.error('❌ App.tsx template not found');
}

console.log('\n🎉 Template generation test completed!'); 