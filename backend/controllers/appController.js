import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createAppProject } from '../../createApp.cjs';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

// =====================================
// APP MANAGEMENT
// =====================================

export const createApp = async (req, res) => {
    try {
        const {
            // App basics
            name,
            subdomain,
            description,

            // Project Details
            category,
            projectType,
            ownershipType,

            // Location
            addressLine,
            country,
            state,
            city,

            // Configuration
            timezone,
            currency,
            enableDarkMode,
            enableMultiLanguage,

            // Billing & Metering
            billingMode,
            meteringTypes,
            tariffPlans,

            // Admin details
            adminFirstName,
            adminLastName,
            adminEmail,
            adminPhone,
            adminUsername,
            adminPassword,
            adminRole,
            adminDepartment,
            adminAddress,
            sendWelcomeEmail,

            // Branding
            companyName,
            companyWebsite,
            appDescription,
            contactEmail,
            contactPhone,
            appLogo,
            appFavicon,
            primaryColor,
            secondaryColor,

            // Modules
            modules
        } = req.body;

        // Validate required fields
        const missingFields = [];
        if (!name) missingFields.push('name');
        if (!subdomain) missingFields.push('subdomain');
        if (!country) missingFields.push('country');
        if (!state) missingFields.push('state');
        if (!adminEmail) missingFields.push('adminEmail');
        if (!companyName) missingFields.push('companyName');

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Check if app name or subdomain already exists
        const existingApp = await prisma.generatedApps.findFirst({
            where: {
                OR: [
                    { name },
                    { subdomain }
                ]
            }
        });

        if (existingApp) {
            return res.status(400).json({
                success: false,
                message: existingApp.name === name 
                    ? `An app with the name "${name}" already exists. Please choose a different name.`
                    : `The subdomain "${subdomain}" is already taken. Please choose a different subdomain.`
            });
        }

        try {
            // Create app files first
            const projectPath = createAppProject(req.body);
            const projectFolderName = projectPath.split('/').pop();

            // Create app and related records in a transaction
            const app = await prisma.$transaction(async (prisma) => {
                // Create main app record
                const app = await prisma.generatedApps.create({
                    data: {
                        name,
                        subdomain,
                        description,
                        category: category || 'CUSTOM',
                        projectType: projectType || 'NEW_PROJECT',
                        ownershipType: ownershipType || 'PRIVATE',
                        addressLine,
                        country,
                        state,
                        city,
                        timezone: timezone || 'UTC',
                        currency: currency || 'USD',
                        enableDarkMode: enableDarkMode || false,
                        enableMultiLanguage: enableMultiLanguage || false,
                        billingMode: billingMode || null,
                        meteringTypes: meteringTypes || [],
                        tariffPlans: tariffPlans || [],
                        createdById: req.user.id,
                        organizationId: req.user.organizationId
                    }
                });

                // Create branding settings
                await prisma.appBrandingSettings.create({
                    data: {
                        appId: app.id,
                        companyName,
                        companyWebsite,
                        appDescription,
                        contactEmail: contactEmail || adminEmail,
                        contactPhone: contactPhone || adminPhone,
                        appLogo,
                        appFavicon,
                        primaryColor,
                        secondaryColor
                    }
                });

                // Create admin settings
                await prisma.appAdminSettings.create({
                    data: {
                        appId: app.id,
                        firstName: adminFirstName || '',
                        lastName: adminLastName || '',
                        email: adminEmail,
                        phone: adminPhone,
                        username: adminUsername,
                        password: adminPassword,
                        role: adminRole || 'ADMIN',
                        department: adminDepartment,
                        address: adminAddress,
                        sendWelcomeEmail: sendWelcomeEmail !== undefined ? sendWelcomeEmail : true
                    }
                });

                // Create enabled modules
                if (modules && modules.length > 0) {
                    await Promise.all(
                        modules.map(module =>
                            prisma.appEnabledModules.create({
                                data: {
                                    appId: app.id,
                                    moduleKey: module.key,
                                    moduleName: module.name,
                                    isEnabled: true,
                                    config: module.config || {}
                                }
                            })
                        )
                    );
                }

                return app;
            });

            // Log activity
            await prisma.appAuditLogs.create({
                data: {
                    appId: app.id,
                    userId: req.user.id,
                    action: 'CREATE',
                    resource: 'apps',
                    resourceId: app.id,
                    details: { appName: name, subdomain },
                    ipAddress: req.ip
                }
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
            const projectFolderName = name?.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'my-admin-app';
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

export const getAllApps = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status, category, organizationId } = req.query;
        const skip = (page - 1) * limit;

        const where = {};
        
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { subdomain: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (status) {
            where.status = status;
        }

        if (category) {
            where.category = category;
        }

        if (organizationId) {
            where.organizationId = parseInt(organizationId);
        }

        // Filter by user permissions
        if (req.user.role !== 'SUPER_ADMIN') {
            where.OR = [
                { createdById: req.user.id },
                { managedById: req.user.id },
                { organizationId: req.user.organizationId }
            ];
        }

        const [apps, total] = await Promise.all([
            prisma.generatedApps.findMany({
                where,
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true
                        }
                    },
                    managedBy: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true
                        }
                    },
                    organization: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    appBranding: {
                        select: {
                            companyName: true,
                            appLogo: true,
                            primaryColor: true
                        }
                    },
                    appModules: {
                        where: { isEnabled: true },
                        select: {
                            moduleKey: true,
                            moduleName: true
                        }
                    }
                },
                skip: parseInt(skip),
                take: parseInt(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma.generatedApps.count({ where })
        ]);

        res.json({
            success: true,
            data: apps,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get apps error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const getAppById = async (req, res) => {
    try {
        const { id } = req.params;

        const app = await prisma.generatedApps.findUnique({
            where: { id: parseInt(id) },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true
                    }
                },
                managedBy: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true
                    }
                },
                organization: true,
                appBranding: true,
                appAdminSettings: true,
                appModules: true,
                appFiles: true,
                appNotifications: {
                    where: { isRead: false },
                    orderBy: { createdAt: 'desc' },
                    take: 5
                },
                appDeployments: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                }
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
        console.error('Get app error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const updateApp = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check if app exists
        const existingApp = await prisma.generatedApps.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingApp) {
            return res.status(404).json({
                success: false,
                message: 'App not found'
            });
        }

        // Check permissions
        if (req.user.role !== 'SUPER_ADMIN' && 
            existingApp.createdById !== req.user.id && 
            existingApp.managedById !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this app'
            });
        }

        // Update app
        const updatedApp = await prisma.generatedApps.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        // Log activity
        await prisma.appAuditLogs.create({
            data: {
                appId: updatedApp.id,
                userId: req.user.id,
                action: 'UPDATE',
                resource: 'apps',
                resourceId: updatedApp.id,
                details: { updatedFields: Object.keys(updateData) },
                ipAddress: req.ip
            }
        });

        res.json({
            success: true,
            message: 'App updated successfully',
            data: updatedApp
        });

    } catch (error) {
        console.error('Update app error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const deleteApp = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if app exists
        const app = await prisma.generatedApps.findUnique({
            where: { id: parseInt(id) }
        });

        if (!app) {
            return res.status(404).json({
                success: false,
                message: 'App not found'
            });
        }

        // Check permissions
        if (req.user.role !== 'SUPER_ADMIN' && 
            app.createdById !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this app'
            });
        }

        // Soft delete app
        await prisma.generatedApps.update({
            where: { id: parseInt(id) },
            data: {
                deletedAt: new Date(),
                status: 'ARCHIVED'
            }
        });

        // Log activity
        await prisma.appAuditLogs.create({
            data: {
                appId: app.id,
                userId: req.user.id,
                action: 'DELETE',
                resource: 'apps',
                resourceId: app.id,
                details: { appName: app.name },
                ipAddress: req.ip
            }
        });

        res.json({
            success: true,
            message: 'App deleted successfully'
        });

    } catch (error) {
        console.error('Delete app error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const publishApp = async (req, res) => {
    try {
        const { id } = req.params;

        const app = await prisma.generatedApps.findUnique({
            where: { id: parseInt(id) }
        });

        if (!app) {
            return res.status(404).json({
                success: false,
                message: 'App not found'
            });
        }

        // Update app status
        await prisma.generatedApps.update({
            where: { id: parseInt(id) },
            data: {
                status: 'ACTIVE',
                isPublished: true,
                publishedAt: new Date()
            }
        });

        // Log activity
        await prisma.appAuditLogs.create({
            data: {
                appId: app.id,
                userId: req.user.id,
                action: 'PUBLISH',
                resource: 'apps',
                resourceId: app.id,
                details: { appName: app.name },
                ipAddress: req.ip
            }
        });

        res.json({
            success: true,
            message: 'App published successfully'
        });

    } catch (error) {
        console.error('Publish app error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const unpublishApp = async (req, res) => {
    try {
        const { id } = req.params;

        const app = await prisma.generatedApps.findUnique({
            where: { id: parseInt(id) }
        });

        if (!app) {
            return res.status(404).json({
                success: false,
                message: 'App not found'
            });
        }

        // Update app status
        await prisma.generatedApps.update({
            where: { id: parseInt(id) },
            data: {
                status: 'INACTIVE',
                isPublished: false,
                publishedAt: null
            }
        });

        // Log activity
        await prisma.appAuditLogs.create({
            data: {
                appId: app.id,
                userId: req.user.id,
                action: 'UNPUBLISH',
                resource: 'apps',
                resourceId: app.id,
                details: { appName: app.name },
                ipAddress: req.ip
            }
        });

        res.json({
            success: true,
            message: 'App unpublished successfully'
        });

    } catch (error) {
        console.error('Unpublish app error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// =====================================
// APP MODULES MANAGEMENT
// =====================================

export const updateAppModules = async (req, res) => {
    try {
        const { id } = req.params;
        const { modules } = req.body;

        // Check if app exists
        const app = await prisma.generatedApps.findUnique({
            where: { id: parseInt(id) }
        });

        if (!app) {
            return res.status(404).json({
                success: false,
                message: 'App not found'
            });
        }

        // Update modules
        await prisma.$transaction(async (prisma) => {
            // Delete existing modules
            await prisma.appEnabledModules.deleteMany({
                where: { appId: parseInt(id) }
            });

            // Create new modules
            if (modules && modules.length > 0) {
                await Promise.all(
                    modules.map(module =>
                        prisma.appEnabledModules.create({
                            data: {
                                appId: parseInt(id),
                                moduleKey: module.key,
                                moduleName: module.name,
                                isEnabled: module.isEnabled !== undefined ? module.isEnabled : true,
                                config: module.config || {}
                            }
                        })
                    )
                );
            }
        });

        // Log activity
        await prisma.appAuditLogs.create({
            data: {
                appId: app.id,
                userId: req.user.id,
                action: 'UPDATE',
                resource: 'app_modules',
                resourceId: app.id,
                details: { modulesCount: modules?.length || 0 },
                ipAddress: req.ip
            }
        });

        res.json({
            success: true,
            message: 'App modules updated successfully'
        });

    } catch (error) {
        console.error('Update app modules error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// =====================================
// APP BRANDING MANAGEMENT
// =====================================

export const updateAppBranding = async (req, res) => {
    try {
        const { id } = req.params;
        const brandingData = req.body;

        // Check if app exists
        const app = await prisma.generatedApps.findUnique({
            where: { id: parseInt(id) }
        });

        if (!app) {
            return res.status(404).json({
                success: false,
                message: 'App not found'
            });
        }

        // Update or create branding settings
        await prisma.appBrandingSettings.upsert({
            where: { appId: parseInt(id) },
            update: brandingData,
            create: {
                appId: parseInt(id),
                ...brandingData
            }
        });

        // Log activity
        await prisma.appAuditLogs.create({
            data: {
                appId: app.id,
                userId: req.user.id,
                action: 'UPDATE',
                resource: 'app_branding',
                resourceId: app.id,
                details: { updatedFields: Object.keys(brandingData) },
                ipAddress: req.ip
            }
        });

        res.json({
            success: true,
            message: 'App branding updated successfully'
        });

    } catch (error) {
        console.error('Update app branding error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}; 