import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

// Load the meter database environment
dotenv.config({ path: path.join(process.cwd(), '.env.meter') });

const prisma = new PrismaClient();

async function setupMeterDatabase() {
    try {
        console.log('Starting meter management database setup...');

        // Create database if it doesn't exist
        // Note: This needs to be done manually in PostgreSQL
        console.log('Please create database manually using:');
        console.log('CREATE DATABASE meter_management_db;');

        // Apply schema
        console.log('To apply schema, run:');
        console.log('npx prisma db push --schema=./prisma/schema.meter.prisma');

        // Initialize basic data
        await initializeBasicData();

        console.log('Meter management database setup completed successfully!');
    } catch (error) {
        console.error('Error setting up meter management database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

async function initializeBasicData() {
    // Add any necessary initialization data here
    // This won't affect your superadmin_db
    console.log('Initializing basic data...');
}

setupMeterDatabase(); 