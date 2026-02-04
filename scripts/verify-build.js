import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const distPath = join(process.cwd(), 'dist');
const assetsPath = join(distPath, 'assets');

console.log('🔍 Verifying build output...');

// Check if dist directory exists
if (!existsSync(distPath)) {
  console.error('❌ dist directory not found. Run "npm run build" first.');
  process.exit(1);
}

// Check if assets directory exists
if (!existsSync(assetsPath)) {
  console.error('❌ assets directory not found in dist.');
  process.exit(1);
}

// Look for CSS files
const cssFiles = [];
try {
  const assets = readFileSync(join(distPath, 'index.html'), 'utf8');
  const cssMatches = assets.match(/href="[^"]*\.css"/g);
  
  if (cssMatches) {
    cssMatches.forEach(match => {
      const cssPath = match.match(/href="([^"]*)"/)[1];
      cssFiles.push(cssPath);
    });
  }
} catch (error) {
  console.error('❌ Could not read index.html:', error.message);
  process.exit(1);
}

if (cssFiles.length > 0) {
  console.log('✅ CSS files found in build:');
  cssFiles.forEach(file => console.log(`   - ${file}`));
} else {
  console.warn('⚠️  No CSS files found in build output');
}

console.log('✅ Build verification complete!'); 