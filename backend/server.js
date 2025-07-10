import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import authRoutes from './routes/auth.js';
import { createDefaultAdmin } from './utils/seedAdmin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Authentication routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'App creation server is running' });
});

// App creation endpoint
app.post('/api/create-app', async (req, res) => {
  try {
    const formData = req.body;
    
    // Validate required fields
    if (!formData.appName && !formData.subdomain) {
      return res.status(400).json({ 
        error: 'App name or subdomain is required' 
      });
    }

    // Import the createAppProject function dynamically - fixed path to parent directory
    const { createAppProject } = await import('../createApp.cjs');

    // Create the app project
    const projectPath = createAppProject(formData);
    
    // Extract the project folder name from the path
    const projectFolderName = projectPath.split('/').pop();
    
    res.json({
      success: true,
      message: `App "${projectFolderName}" created successfully!`,
      projectPath: projectPath,
      projectFolderName: projectFolderName,
      nextSteps: [
        `cd generated-apps/${projectFolderName}`,
        'npm install',
        'npm run dev'
      ]
    });
    
  } catch (error) {
    console.error('Error creating app:', error);
    res.status(500).json({
      error: 'Failed to create app',
      details: error.message
    });
  }
});

// Get list of generated apps
app.get('/api/generated-apps', (req, res) => {
  try {
    // Updated path to point to parent directory's generated-apps folder
    const generatedAppsDir = join(__dirname, '../generated-apps');
    
    if (!fs.existsSync(generatedAppsDir)) {
      return res.json({ apps: [] });
    }
    
    const apps = fs.readdirSync(generatedAppsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => ({
        name: dirent.name,
        path: join(generatedAppsDir, dirent.name),
        created: fs.statSync(join(generatedAppsDir, dirent.name)).birthtime
      }));
    
    res.json({ apps });
  } catch (error) {
    console.error('Error reading generated apps:', error);
    res.status(500).json({
      error: 'Failed to read generated apps',
      details: error.message
    });
  }
});

app.listen(PORT, async () => {
  console.log(`🚀 AdminModule server running on port ${PORT}`);
  console.log(`📁 Generated apps will be created in: ${join(__dirname, '../generated-apps')}`);
  
  // Create default admin user
  await createDefaultAdmin();
}); 