import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pkg from '../../generators/createAppOptimized.js';
const { createAppProjectOptimized: createAppProject } = pkg;
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

// Helper function to map frontend category names to enum values
function mapCategoryToEnum(category) {
    if (!category) return 'CUSTOM';
    
    const categoryMap = {
        'utility-management': 'UTILITY_MANAGEMENT',
        'billing-system': 'BILLING_SYSTEM',
        'customer-portal': 'CUSTOMER_PORTAL',
        'admin-panel': 'ADMIN_PANEL',
        'reporting-system': 'REPORTING_SYSTEM',
        'analytics-platform': 'ANALYTICS_PLATFORM',
        'integration-service': 'INTEGRATION_SERVICE',
        'custom': 'CUSTOM'
    };
    
    return categoryMap[category.toLowerCase()] || 'CUSTOM';
}

// Helper function to map frontend project type names to enum values
function mapProjectTypeToEnum(projectType) {
    if (!projectType) return 'NEW_PROJECT';
    
    const projectTypeMap = {
        'new-project': 'NEW_PROJECT',
        'migration': 'MIGRATION',
        'upgrade': 'UPGRADE',
        'customization': 'CUSTOMIZATION'
    };
    
    return projectTypeMap[projectType.toLowerCase()] || 'NEW_PROJECT';
}

// Helper function to map frontend ownership type names to enum values
function mapOwnershipTypeToEnum(ownershipType) {
    if (!ownershipType) return 'PRIVATE';
    
    const ownershipTypeMap = {
        'private': 'PRIVATE',
        'public': 'PUBLIC',
        'government': 'GOVERNMENT',
        'corporate': 'CORPORATE'
    };
    
    return ownershipTypeMap[ownershipType.toLowerCase()] || 'PRIVATE';
}

// Helper function to map frontend metering types to valid enum values
function mapMeteringTypeToEnum(meteringType) {
    if (!meteringType) return 'ELECTRICITY';
    
    const meteringTypeMap = {
        'single-phase': 'ELECTRICITY',
        'three-phase': 'ELECTRICITY',
        'electricity': 'ELECTRICITY',
        'water': 'WATER',
        'gas': 'GAS',
        'solar': 'SOLAR',
        'wind': 'WIND',
        'hydro': 'HYDRO',
        'thermal': 'THERMAL',
        'smart-meter': 'SMART_METER',
        'smart_meter': 'SMART_METER'
    };
    
    return meteringTypeMap[meteringType.toLowerCase()] || 'ELECTRICITY';
}

// =====================================
// APP MANAGEMENT
// =====================================

export const createApp = async (req, res) => {
    try {
        // Ensure there's a default user for app creation
        let defaultUserId = 1;
        const defaultUser = await prisma.adminUsers.findUnique({
            where: { id: 1 }
        });
        
        if (!defaultUser) {
            // Create a default user if none exists
            const newUser = await prisma.adminUsers.create({
                data: {
                    username: 'system',
                    email: 'system@admin.com',
                    password: 'default-password-hash', // This should be hashed in production
                    firstName: 'System',
                    lastName: 'Admin',
                    role: 'SUPER_ADMIN'
                }
            });
            defaultUserId = newUser.id;
        }
        const {
            // App basics
            appName,
            subdomain,
            description,

            // Project Details
            applicationCategory,
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
            meteringType,
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

            // Modules
            modules,
            
            // New Accounts
            newAccounts
        } = req.body;

        // Map frontend field names to backend expectations
        const name = appName; // Frontend sends appName, backend expects name

        // Validate required fields
        const missingFields = [];
        if (!name) missingFields.push('appName');
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
            // Create app files first (outside transaction to avoid timeout)
            let projectPath;
            let projectFolderName;
            
            try {
                projectPath = createAppProject(req.body);
                projectFolderName = projectPath.split('/').pop();
            } catch (folderError) {
                console.error('Error creating app folder:', folderError);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create app folder structure'
                });
            }

            // Create app and related records in a transaction
            const app = await prisma.$transaction(async (prisma) => {
                
                // Create main app record
                const app = await prisma.generatedApps.create({
                    data: {
                        name,
                        subdomain,
                        description,
                        category: mapCategoryToEnum(applicationCategory?.[0]) || 'CUSTOM',
                        projectType: mapProjectTypeToEnum(projectType) || 'NEW_PROJECT',
                        ownershipType: mapOwnershipTypeToEnum(ownershipType) || 'PRIVATE',
                        addressLine,
                        country,
                        state,
                        city,
                        timezone: timezone || 'UTC',
                        currency: currency || 'USD',
                        enableDarkMode: enableDarkMode || false,
                        enableMultiLanguage: enableMultiLanguage || false,
                        billingMode: billingMode ? billingMode.toUpperCase() : null,
                        meteringTypes: Array.isArray(meteringType) ? meteringType.map(type => mapMeteringTypeToEnum(type)) : (meteringType ? [mapMeteringTypeToEnum(meteringType)] : []),
                        tariffPlans: Array.isArray(tariffPlans) ? tariffPlans : (tariffPlans ? [tariffPlans] : []),
                        createdById: req.user?.userId || defaultUserId, // Use default user if no auth
                        organizationId: req.user?.organizationId || null
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
                    appFavicon
                }
            });

            // Create custom colors
            const customColors = [];

            // Add all custom colors if they exist
            const colorMappings = {
                primaryColor: 'primary',
                secondaryColor: 'secondary',
                textPrimaryColor: 'textPrimary',
                textSecondaryColor: 'textSecondary',
                backgroundColor: 'background',
                borderColor: 'border',
                shadowColor: 'shadow',
                iconColor: 'icon',
                gradientColor: 'gradient'
            };

            // Add colors to customColors array
            Object.entries(colorMappings).forEach(([fieldName, colorKey]) => {
                if (req.body[fieldName]) {
                    customColors.push({
                        colorKey,
                        colorValue: req.body[fieldName],
                        colorName: `${colorKey.charAt(0).toUpperCase() + colorKey.slice(1)} Color`
                    });
                }
            });

            // Save custom colors to database
            if (customColors.length > 0) {
                await Promise.all(
                    customColors.map(color =>
                        prisma.appCustomColors.create({
                            data: {
                                appId: app.id,
                                colorKey: color.colorKey,
                                colorValue: color.colorValue,
                                colorName: color.colorName,
                                isActive: true
                            }
                        })
                    )
                );
            }

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
                    let modulesToCreate = [...modules];
                    if (modules.includes('user_management_default') && !modules.includes('role_management')) {
                        modulesToCreate.push('role_management');
                    }
                    
                    await Promise.all(
                        modulesToCreate.map(moduleName =>
                            prisma.appEnabledModules.create({
                                data: {
                                    appId: app.id,
                                    moduleKey: moduleName,
                                    moduleName: moduleName,
                                    isEnabled: true,
                                    config: {}
                                }
                            })
                        )
                    );
                }

                // Log activity
                await prisma.appAuditLogs.create({
                    data: {
                        appId: app.id,
                        userId: req.user?.userId || defaultUserId, // Use default user if no auth
                        action: 'CREATE',
                        resource: 'apps',
                        resourceId: app.id,
                        details: { appName: name, subdomain },
                        ipAddress: req.ip
                    }
                });

                return app;
            });

            res.status(201).json({
                success: true,
                message: `App "${app.name}" created successfully!`,
                data: app,
                projectPath: projectPath,
                projectFolderName: projectFolderName,
                newAccountsCount: newAccounts ? newAccounts.length : 0,
                modulesCount: modules ? modules.length : 0,
                nextSteps: [
                    `cd generated-apps/${projectFolderName}`,
                    'npm install',
                    'npm run dev'
                ]
            });

        } catch (innerError) {
            // If database creation fails, clean up the generated files
            if (projectPath && fs.existsSync(projectPath)) {
                try {
                    fs.rmSync(projectPath, { recursive: true, force: true });
                    console.log(`Cleaned up folder: ${projectPath}`);
                } catch (cleanupError) {
                    console.error('Error cleaning up folder:', cleanupError);
                }
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
        if (req.user?.role !== 'SUPER_ADMIN') {
            where.OR = [
                        { createdById: req.user?.userId || 1 },
        { managedById: req.user?.userId || 1 },
                { organizationId: req.user?.organizationId || null }
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
                            appLogo: true
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
        console.log('getAppById called with id:', id);

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
                customColors: {
                    where: { isActive: true },
                    orderBy: { colorKey: 'asc' }
                },
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
        if (req.user?.role !== 'SUPER_ADMIN' && 
                    existingApp.createdById !== (req.user?.userId || 1) &&
        existingApp.managedById !== (req.user?.userId || 1)) {
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
                userId: req.user?.userId || 1,
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
        if (req.user?.role !== 'SUPER_ADMIN' && 
            app.createdById !== (req.user?.userId || 1)) {
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
                userId: req.user?.userId || 1,
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
                userId: req.user?.userId || 1,
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
                userId: req.user?.userId || 1,
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
                userId: req.user?.userId || 1,
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

// =====================================
// CUSTOM COLORS MANAGEMENT
// =====================================

export const getAppCustomColors = async (req, res) => {
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

        // Get custom colors
        const customColors = await prisma.appCustomColors.findMany({
            where: { 
                appId: parseInt(id),
                isActive: true 
            },
            orderBy: { colorKey: 'asc' }
        });

        res.json({
            success: true,
            data: customColors
        });

    } catch (error) {
        console.error('Get app custom colors error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const updateAppCustomColors = async (req, res) => {
    try {
        const { id } = req.params;
        const { colors } = req.body; // Array of { colorKey, colorValue, colorName }

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

        // Update colors in transaction
        await prisma.$transaction(async (prisma) => {
            // Delete existing colors
            await prisma.appCustomColors.deleteMany({
                where: { appId: parseInt(id) }
            });

            // Create new colors
            if (colors && colors.length > 0) {
                await Promise.all(
                    colors.map(color =>
                        prisma.appCustomColors.create({
                            data: {
                                appId: parseInt(id),
                                colorKey: color.colorKey,
                                colorValue: color.colorValue,
                                colorName: color.colorName || `${color.colorKey} Color`,
                                isActive: true
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
                userId: req.user?.userId || 1,
                action: 'UPDATE',
                resource: 'app_custom_colors',
                resourceId: app.id,
                details: { colorsCount: colors?.length || 0 },
                ipAddress: req.ip
            }
        });

        res.json({
            success: true,
            message: 'Custom colors updated successfully'
        });

    } catch (error) {
        console.error('Update app custom colors error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

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

        // Handle custom colors update
        const customColors = [];
        
        // Map custom color fields to color keys
        const colorMappings = {
            customPrimaryColor: 'customPrimary',
            customSecondaryColor: 'customSecondary',
            customTextPrimaryColor: 'customTextPrimary',
            customTextSecondaryColor: 'customTextSecondary',
            customBackgroundColor: 'customBackground',
            customBorderColor: 'customBorder',
            customShadowColor: 'customShadow',
            customIconColor: 'customIcon',
            customGradientColor: 'customGradient'
        };

        // Extract custom colors from request body
        Object.entries(colorMappings).forEach(([fieldName, colorKey]) => {
            if (req.body[fieldName]) {
                customColors.push({
                    colorKey,
                    colorValue: req.body[fieldName],
                    colorName: `${colorKey.charAt(0).toUpperCase() + colorKey.slice(1)} Color`
                });
            }
        });

        // Update custom colors in database
        if (customColors.length > 0) {
            await Promise.all(
                customColors.map(async (color) => {
                    await prisma.appCustomColors.upsert({
                        where: {
                            appId_colorKey: {
                                appId: parseInt(id),
                                colorKey: color.colorKey
                            }
                        },
                        update: {
                            colorValue: color.colorValue,
                            colorName: color.colorName,
                            isActive: true,
                            updatedAt: new Date()
                        },
                        create: {
                            appId: parseInt(id),
                            colorKey: color.colorKey,
                            colorValue: color.colorValue,
                            colorName: color.colorName,
                            isActive: true
                        }
                    });
                })
            );
        }

        // Log activity
        await prisma.appAuditLogs.create({
            data: {
                appId: app.id,
                userId: req.user?.userId || 1,
                action: 'UPDATE',
                resource: 'app_branding',
                resourceId: app.id,
                details: { 
                    updatedFields: Object.keys(brandingData),
                    customColorsCount: customColors.length
                },
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

// =====================================
// SUPER ADMIN DASHBOARD ENDPOINTS
// =====================================

export const getSuperAdminDashboardStats = async (req, res) => {
    try {
        // Get total sub-apps count from generated-apps folder
        const generatedAppsPath = join(__dirname, '../../generated-apps');
        let totalSubApps = 0;
        let generatedAppsList = [];
        
        try {
            if (fs.existsSync(generatedAppsPath)) {
                const folders = fs.readdirSync(generatedAppsPath, { withFileTypes: true });
                generatedAppsList = folders
                    .filter(dirent => dirent.isDirectory())
                    .map(dirent => dirent.name);
                totalSubApps = generatedAppsList.length;
            }
        } catch (folderError) {
            console.error('Error reading generated-apps folder:', folderError);
            // Fallback to database count
            totalSubApps = await prisma.generatedApps.count();
        }

        // Get sub-apps created this month
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const subAppsThisMonth = await prisma.generatedApps.count({
            where: {
                createdAt: {
                    gte: firstDayOfMonth
                }
            }
        });

        // Get sub-apps created last month for comparison
        const firstDayLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        const subAppsLastMonth = await prisma.generatedApps.count({
            where: {
                createdAt: {
                    gte: firstDayLastMonth,
                    lte: lastDayLastMonth
                }
            }
        });

        // Calculate percentage change
        const percentageChange = subAppsLastMonth > 0 
            ? ((subAppsThisMonth - subAppsLastMonth) / subAppsLastMonth) * 100 
            : 0;

        // Get active users count
        const activeUsers = await prisma.adminUsers.count({
            where: {
                isActive: true
            }
        });

        // Estimate daily logins based on active users
        const dailyLogins = Math.floor(activeUsers * 3.8);

        // Get issues count (apps with inactive or suspended status)
        const issuesCount = await prisma.generatedApps.count({
            where: {
                OR: [
                    { status: 'INACTIVE' },
                    { status: 'SUSPENDED' }
                ]
            }
        });

        // Get recent apps for the dashboard with pagination support
        const { page = 1, limit = 6 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Get total count for pagination
        const totalApps = await prisma.generatedApps.count();
        
        const recentApps = await prisma.generatedApps.findMany({
            take: parseInt(limit),
            skip: skip,
            include: {
                createdBy: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                appBranding: {
                    select: {
                        companyName: true,
                        appLogo: true
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
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Get daily login trends data (grouped by app)
        const dailyLoginTrends = await prisma.generatedApps.groupBy({
            by: ['name'],
            _count: {
                id: true
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            },
            take: 5
        });

        // Transform daily login trends for pie chart
        const dailyLoginTrendsData = dailyLoginTrends.map(app => ({
            name: app.name,
            value: app._count.id * 10 // Multiply by 10 for better visualization
        }));

        // Transform app usage data for bar chart
        const appUsageData = {
            xAxisData: dailyLoginTrends.map(app => app.name),
            seriesData: [
                {
                    name: 'Active Users',
                    data: dailyLoginTrends.map(app => app._count.id * 25) // Estimate active users
                },
                {
                    name: 'Sessions',
                    data: dailyLoginTrends.map(app => app._count.id * 35) // Estimate sessions
                }
            ]
        };

        res.json({
            success: true,
            data: {
                kpiCards: {
                    totalSubApps: {
                        value: totalSubApps.toString(),
                        thisMonth: subAppsThisMonth,
                        percentageChange: percentageChange.toFixed(1)
                    },
                    activeUsers: {
                        value: activeUsers.toString(),
                        percentageChange: 8.2 // This could be calculated from historical data
                    },
                    dailyLogins: {
                        value: dailyLogins.toLocaleString(),
                        percentageChange: 15.3 // This could be calculated from historical data
                    },
                    issues: {
                        value: issuesCount.toString(),
                        percentageChange: -5 // This could be calculated from historical data
                    }
                },
                charts: {
                    dailyLoginTrends: dailyLoginTrendsData,
                    appUsageDistribution: appUsageData
                },
                recentApps: recentApps.map(app => ({
                    appIcon: app.appBranding?.appLogo || '/images/default-app-icon.png',
                    appName: app.name,
                    appId: app.id.toString(),
                    subdomain: app.subdomain,
                    health: app.status === 'ACTIVE' ? 'Live' : 'Offline',
                    status: app.status,
                    created: app.createdAt.toLocaleDateString(),
                    updated: app.updatedAt.toLocaleDateString(),
                    company: app.appBranding?.companyName || 'Unknown Company',
                    website: app.appBranding?.companyWebsite || 'N/A',
                    category: app.category,
                    modules: app.appModules.map(module => ({
                        name: module.moduleName,
                        icon: `/icons/${module.moduleKey}.svg`
                    })),
                    connectedApis: [
                        { name: 'Payment Gateway', status: 'connected' },
                        { name: 'Inventory System', status: app.status === 'ACTIVE' ? 'connected' : 'error' },
                        { name: 'Analytics API', status: 'connected' }
                    ],
                    meters: {
                        total: Math.floor(Math.random() * 2000) + 500,
                        active: Math.floor(Math.random() * 1800) + 400,
                        inactive: Math.floor(Math.random() * 200) + 50
                    },
                    tickets: {
                        count: Math.floor(Math.random() * 20) + 1,
                        icon: '/icons/tickets.svg'
                    }
                })),
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalApps / parseInt(limit)),
                    totalApps: totalApps,
                    appsPerPage: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Get SuperAdmin dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}; 