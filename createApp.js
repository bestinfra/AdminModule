#!/usr/bin/env node

/**
 * Simple wrapper for creating new sub-apps with database isolation
 * Usage: node createApp.js [app-name] [subdomain]
 */

const { createAppProjectOptimized } = require('./generators/createAppOptimized.js');

// Get command line arguments
const appName = process.argv[2] || "My App";
const subdomain = process.argv[3] || appName.toLowerCase().replace(/\s+/g, '-');

// Default configuration
const formData = {
  appName: appName,
  subdomain: subdomain,
  companyName: `${appName} Company`,
  adminFirstName: "Admin",
  adminLastName: "User",
  adminEmail: `admin@${subdomain}.com`,
  adminRole: "Administrator",
  primaryColor: "#3B82F6",
  secondaryColor: "#10B981",
  textPrimaryColor: "#262626",
  textSecondaryColor: "#7e7e7e",
  backgroundColor: "#f5f8fc",
  borderColor: "#e9efff",
  shadowColor: "#dce4ef",
  iconColor: "#476189",
  gradientColor: "#163b7c",
  timezone: "UTC",
  currency: "USD",
  modules: ["dashboard", "consumer_dashboard", "users", "tickets"],
};

console.log('🚀 Creating Multi-Tenant Sub-App');
console.log('================================\n');
console.log(`📱 App Name: ${formData.appName}`);
console.log(`🌐 Subdomain: ${formData.subdomain}`);
console.log(`🏢 Company: ${formData.companyName}`);
console.log(`👤 Admin: ${formData.adminFirstName} ${formData.adminLastName}`);
console.log(`📧 Email: ${formData.adminEmail}`);
console.log('');

console.log('This will automatically:');
console.log('  • Create the project structure');
console.log('  • Create a dedicated database');
console.log('  • Deploy the backend with database configuration');
console.log('  • Run Prisma migrations');
console.log('');

try {
  const projectPath = createAppProjectOptimized(formData);
  console.log(`\n🎉 App creation completed successfully!`);
  console.log(`📁 Project location: ${projectPath}`);
  console.log(`\n📋 Next steps:`);
  console.log(`   1. cd ${projectPath}`);
  console.log(`   2. npm install`);
  console.log(`   3. npm run dev`);
  console.log(`\n🌐 Backend will be available at the URL shown above`);
} catch (error) {
  console.error('❌ App creation failed:', error.message);
  process.exit(1);
} 