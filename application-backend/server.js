import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import meterRoutes from './routes/meters.js';
import consumerRoutes from './routes/consumers.js';
import assetRoutes from './routes/assets.js';
import userRoutes from './routes/users.js';
import roleRoutes from './routes/roles.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize Prisma client
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

app.use('/api/meters', meterRoutes);
app.use('/api/consumers', consumerRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/dashboard', dashboardRoutes);     
// Health check endpoint
app.get('/api/health', (req, res) => res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Priya Backend API is running'
}));

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        error: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// Database connection and server startup
async function startServer() {
    try {
        // Test database connection
        await prisma.$connect();
        console.log('✅ Connected to database successfully');
        
        app.listen(PORT, () => {
            console.log(`🚀 Backend running on port ${PORT}`);
            console.log(`📊 API Documentation: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down server...');
    await prisma.$disconnect();
    process.exit(0);
});

startServer();
