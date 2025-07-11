import { PrismaClient as AdminPrisma } from '@prisma/client';
import { PrismaClient as MeterPrisma } from '../prisma/generated/meter-client';
import dotenv from 'dotenv';
import path from 'path';

// Load environment configurations
dotenv.config(); // Load main .env
dotenv.config({ path: path.join(process.cwd(), '.env.meter') }); // Load meter .env

// Database configuration
const config = {
    admin: {
        url: process.env.DATABASE_URL,
        pool: {
            max: parseInt(process.env.DB_POOL_SIZE || '10'),
            timeout: parseInt(process.env.DB_CONNECT_TIMEOUT || '30')
        }
    },
    meter: {
        url: process.env.METER_DATABASE_URL,
        pool: {
            max: parseInt(process.env.METER_DB_POOL_SIZE || '10'),
            timeout: parseInt(process.env.METER_DB_CONNECT_TIMEOUT || '30')
        }
    }
};

// Prisma client options
const prismaOptions = {
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty'
};

// Create Prisma clients
export const adminDb = new AdminPrisma({
    ...prismaOptions,
    datasources: {
        db: {
            url: config.admin.url
        }
    }
});

export const meterDb = new MeterPrisma({
    ...prismaOptions,
    datasources: {
        db: {
            url: config.meter.url
        }
    }
});

// Database connection management
export const connectDatabases = async () => {
    try {
        // Connect to admin database
        await adminDb.$connect();
        console.log('Connected to admin database');

        // Connect to meter database
        await meterDb.$connect();
        console.log('Connected to meter database');

        return true;
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

// Database disconnection
export const disconnectDatabases = async () => {
    try {
        await adminDb.$disconnect();
        await meterDb.$disconnect();
        console.log('Disconnected from all databases');
    } catch (error) {
        console.error('Database disconnection error:', error);
        throw error;
    }
};

// Health check function
export const checkDatabaseHealth = async () => {
    try {
        // Check admin database
        await adminDb.$queryRaw`SELECT 1`;
        console.log('Admin database is healthy');

        // Check meter database
        await meterDb.$queryRaw`SELECT 1`;
        console.log('Meter database is healthy');

        return true;
    } catch (error) {
        console.error('Database health check failed:', error);
        return false;
    }
};

export default {
    config,
    adminDb,
    meterDb,
    connectDatabases,
    disconnectDatabases,
    checkDatabaseHealth
}; 