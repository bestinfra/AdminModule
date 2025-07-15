import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createAppProject } from '../../createApp.cjs';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

// Create a new app
export const createApp = async (req, res) => {
    try {
        const {
            // App basics
            appName,
            subdomain,
            description,

            // Configuration
            country,
            state,
            city,
            categories,
            modules,
            timezone,
            currency,
            enableDarkMode,
            enableMultiLanguage,

            // Admin details
            adminFirstName,
            adminLastName,
            adminEmail,
            adminPhone,
            adminRole,
            adminDepartment,
            adminAddress,

            // Branding
            companyName,
            companyWebsite,
            appLogo,
            appFavicon,
            primaryColor,
            contactEmail,
            contactPhone,
        } = req.body;
        // Validate required fields
        const missingFields = [];
        if (!appName) missingFields.push('appName');
        if (!subdomain) missingFields.push('subdomain');
        if (!country) missingFields.push('country');
        if (!state) missingFields.push('state');
        if (!adminEmail) missingFields.push('adminEmail');
        if (!companyName) missingFields.push('companyName');

        if (missingFields.length > 0) {
            console.log('Missing fields:', missingFields);
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Check if app name already exists
        const existingApp = await prisma.app.findFirst({
            where: {
                OR: [
                    { name: appName },
                    { subdomain: subdomain }
                ]
            }
        });

        if (existingApp) {
            return res.status(400).json({
                success: false,
                message: existingApp.name === appName 
                    ? `An app with the name "${appName}" already exists. Please choose a different name.`
                    : `The subdomain "${subdomain}" is already taken. Please choose a different subdomain.`
            });
        }

        // Get the super admin user
        const superAdmin = await prisma.user.findFirst({
            where: {
                username: 'superadmin'
            }
        });

        if (!superAdmin) {
            return res.status(500).json({
                success: false,
                message: 'Super admin user not found. Please ensure the database is properly seeded.'
            });
        }

        try {
            // Create app files first
            const projectPath = createAppProject(req.body);
            const projectFolderName = projectPath.split('/').pop();

            // Create app and related records in a transaction
            const app = await prisma.$transaction(async (prisma) => {
                // Create main app record
                const app = await prisma.app.create({
                    data: {
                        name: appName,
                        subdomain,
                        description,
                        createdById: superAdmin.id, // Use the super admin's ID
                    }
                });

                // Create app configuration
                await prisma.appConfig.create({
                    data: {
                        appId: app.id,
                        country,
                        state,
                        city: city || '', // Make city optional
                        categories: categories || [],
                        modules: modules || [],
                        timezone: timezone || 'UTC',
                        currency: currency || 'USD',
                        enableDarkMode: enableDarkMode || false,
                        enableMultiLanguage: enableMultiLanguage || false,
                    }
                });

                // Create admin configuration
                await prisma.adminConfig.create({
                    data: {
                        appId: app.id,
                        firstName: adminFirstName || '',
                        lastName: adminLastName || '',
                        email: adminEmail || '',
                        phone: adminPhone || '',
                        role: adminRole || 'admin',
                        department: adminDepartment,
                        address: adminAddress,
                    }
                });

                // Create branding configuration
                await prisma.appBranding.create({
                    data: {
                        appId: app.id,
                        companyName,
                        companyWebsite,
                        appLogo,
                        appFavicon,
                        primaryColor,
                        contactEmail: contactEmail || adminEmail || '',
                        contactPhone: contactPhone || adminPhone || '',
                    }
                });

                return app;
            });

            res.status(201).json({
                success: true,
                message: `App "${projectFolderName}" created successfully!`,
                data: app,
                projectPath: projectPath,
                projectFolderName: projectFolderName,
                nextSteps: [
                    `cd generated-apps/${projectFolderName}`,
                    'npm install',
                    'npm run dev'
                ]
            });

        } catch (innerError) {
            // If database creation fails, clean up the generated files
            const projectFolderName = appName?.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'my-admin-app';
            const projectPath = join(__dirname, '..', '..', 'generated-apps', projectFolderName);
            if (fs.existsSync(projectPath)) {
                fs.rmSync(projectPath, { recursive: true, force: true });
            }
            console.error('Detailed error:', innerError);
            throw new Error(`Failed to create app: ${innerError.message}`);
        }

    } catch (error) {
        console.error('Error creating app:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create app'
        });
    }
};

// Get all apps
export const getAllApps = async (req, res) => {
    try {
        const apps = await prisma.app.findMany({
            include: {
                createdBy: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
                configuration: true,
                branding: true,
                adminSettings: true
            }
        });

        res.json({
            success: true,
            data: apps
        });

    } catch (error) {
        console.error('Error fetching apps:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch apps'
        });
    }
};

// Get app by ID
export const getAppById = async (req, res) => {
    try {
        const { id } = req.params;

        const app = await prisma.app.findUnique({
            where: { id: parseInt(id) },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
                configuration: true,
                branding: true,
                adminSettings: true
            }
        });

        if (!app) {
            return res.status(404).json({
                success: false,
                message: 'App not found'
            });
        }

        res.json({
            success: true,
            data: app
        });

    } catch (error) {
        console.error('Error fetching app:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch app'
        });
    }
};

// Update app
export const updateApp = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            // App basics
            appName,
            subdomain,
            description,

            // Configuration
            country,
            state,
            city,
            categories,
            modules,
            timezone,
            currency,
            enableDarkMode,
            enableMultiLanguage,

            // Admin details
            adminFirstName,
            adminLastName,
            adminEmail,
            adminPhone,
            adminRole,
            adminDepartment,
            adminAddress,

            // Branding
            companyName,
            companyWebsite,
            appLogo,
            appFavicon,
            primaryColor,
            contactEmail,
            contactPhone,
        } = req.body;

        // Update app and related records in a transaction
        const app = await prisma.$transaction(async (prisma) => {
            // Update main app record
            const app = await prisma.app.update({
                where: { id: parseInt(id) },
                data: {
                    name: appName,
                    subdomain,
                    description,
                }
            });

            // Update app configuration
            if (app.configuration) {
                await prisma.appConfig.update({
                    where: { appId: app.id },
                    data: {
                        country,
                        state,
                        city,
                        categories,
                        modules,
                        timezone,
                        currency,
                        enableDarkMode,
                        enableMultiLanguage,
                    }
                });
            }

            // Update admin configuration
            if (app.adminSettings) {
                await prisma.adminConfig.update({
                    where: { appId: app.id },
                    data: {
                        firstName: adminFirstName,
                        lastName: adminLastName,
                        email: adminEmail,
                        phone: adminPhone,
                        role: adminRole,
                        department: adminDepartment,
                        address: adminAddress,
                    }
                });
            }

            // Update branding configuration
            if (app.branding) {
                await prisma.appBranding.update({
                    where: { appId: app.id },
                    data: {
                        companyName,
                        companyWebsite,
                        appLogo,
                        appFavicon,
                        primaryColor,
                        contactEmail,
                        contactPhone,
                    }
                });
            }

            return app;
        });

        res.json({
            success: true,
            message: 'App updated successfully',
            data: app
        });

    } catch (error) {
        console.error('Error updating app:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update app'
        });
    }
};

// Delete app
export const deleteApp = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete app and related records in a transaction
        await prisma.$transaction(async (prisma) => {
            const appId = parseInt(id);

            // Delete related records first
            await prisma.appConfig.deleteMany({ where: { appId } });
            await prisma.adminConfig.deleteMany({ where: { appId } });
            await prisma.appBranding.deleteMany({ where: { appId } });

            // Delete main app record
            await prisma.app.delete({ where: { id: appId } });
        });

        res.json({
            success: true,
            message: 'App deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting app:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete app'
        });
    }
};

// Publish app
export const publishApp = async (req, res) => {
    try {
        const { id } = req.params;

        const app = await prisma.app.update({
            where: { id: parseInt(id) },
            data: {
                isPublished: true,
                publishedAt: new Date()
            }
        });

        res.json({
            success: true,
            message: 'App published successfully',
            data: app
        });

    } catch (error) {
        console.error('Error publishing app:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to publish app'
        });
    }
};

// Unpublish app
export const unpublishApp = async (req, res) => {
    try {
        const { id } = req.params;

        const app = await prisma.app.update({
            where: { id: parseInt(id) },
            data: {
                isPublished: false,
                publishedAt: null
            }
        });

        res.json({
            success: true,
            message: 'App unpublished successfully',
            data: app
        });

    } catch (error) {
        console.error('Error unpublishing app:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to unpublish app'
        });
    }
}; 