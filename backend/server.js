import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import authRoutes from './routes/auth.js';
import appRoutes from './routes/app.js';
import UserDB from './models/UserDB.js';
import dotenv from 'dotenv';
import emailRoutes from './routes/email.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Authentication routes
app.use('/api/auth', authRoutes);

// App management routes
app.use('/api/apps', appRoutes);
app.use('/api', emailRoutes);
app.use('/email', emailRoutes);
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'App creation server is running' });
});

app.listen(PORT, async () => {
  console.log(`AdminModule server running on port ${PORT}`);
  
  // Check database connection
  const isDbConnected = await UserDB.checkConnection();
  if (isDbConnected) {
    console.log('PostgreSQL database ready');
  } else {
    console.log('Database connection failed. Please check your DATABASE_URL environment variable.');
  }
}); 