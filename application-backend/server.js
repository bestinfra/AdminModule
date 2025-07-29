import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import meters from './routes/meters.js';
import consumers from './routes/consumers.js';
import assets from './routes/assets.js';
import users from './routes/users.js';
import roles from './routes/roles.js';
import billing from './routes/billing.js';
import dashboard from './routes/dashboard.js';
import tickets from './routes/tickets.js';
import dtrs from './routes/dtrs.js';
import apiRoutes from './routes/apiRoutes.js';
import subAppAuthRoutes from './routes/subAppAuth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const prisma = new PrismaClient();

const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
};
console.log(corsOptions);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

app.use('/api', apiRoutes);

// Sub-app authentication routes
app.use('/api/sub-app/auth', subAppAuthRoutes);

app.get('/api/health', (req, res) => res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Application Backend API is running'
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
