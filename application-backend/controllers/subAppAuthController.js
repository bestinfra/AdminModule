import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// JWT Secret (In production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Helper function to parse PostgreSQL JSON format
const parsePostgresJson = (jsonValue) => {
    try {
        const str = jsonValue.toString().trim();
        
        if (str.startsWith('{') && str.endsWith('}')) {
            // PostgreSQL array format: {1,2,4}
            const result = str.slice(1, -1).split(',').map(id => parseInt(id.trim()));
            return result;
        } else if (str.includes(',') && !str.startsWith('[') && !str.startsWith('{')) {
            // PostgreSQL array format without braces: 1,2,4
            const result = str.split(',').map(id => parseInt(id.trim()));
            return result;
        } else {
            // Standard JSON format: [1,2,4]
            const result = JSON.parse(str);
            return result;
        }
    } catch (error) {
        return [];
    }
};

// Generate JWT Token for sub-apps with roles, permissions, and location
const generateSubAppToken = (userId, appId = null, userRoles = [], userPermissions = [], locationId = null) => {
    return jwt.sign({ 
        userId, 
        appId,
        type: 'sub-app',
        roles: userRoles,
        permissions: userPermissions,
        locationId
    }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Sub-app login
export const subAppLogin = async (req, res) => {
    try {
        const { identifier, password, appId } = req.body;

        // Validate required fields
        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username/email and password are required'
            });
        }

        // Find user by email or username with roles, permissions, and location
        let user = await prisma.users.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
            },
            include: {
                roles: {
                    include: {
                        role_permissions: true
                    }
                },
                locations: true
            }
        });

        if (!user) {

            return res.status(401).json({
                success: false,
                message: 'Invalid username/email or password'
            });
        }



        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Check if user is locked
        if (user.isLocked && user.lockoutUntil && user.lockoutUntil > new Date()) {
            return res.status(401).json({
                success: false,
                message: 'Account is temporarily locked'
            });
        }

        // Reset failed login attempts on successful login
        await prisma.users.update({
            where: { id: user.id },
            data: {
                failedLoginAttempts: 0,
                lockoutUntil: null,
                lastLoginAt: new Date()
            }
        });

        // Extract user roles and permissions
        const userRoles = user.roles ? [user.roles.name] : [];
        const userPermissions = [];


        
        // Extract permissions from role_permissions
        if (user.roles?.role_permissions) {
            user.roles.role_permissions.forEach(rolePerm => {
                if (rolePerm.permissionId === null || rolePerm.permissionId === undefined) {
                    return;
                }
                try {
                    const parsed = parsePostgresJson(rolePerm.permissionId);
                    const idsArray = Array.isArray(parsed)
                        ? parsed
                        : (typeof parsed === 'number' && !Number.isNaN(parsed))
                            ? [parsed]
                            : [];
                } catch (e) {
                    // Failed parsing permissionId for rolePerm
                }
            });
        }
        
        // Fetch permission names from permission IDs
        if (user.roles?.role_permissions) {
            const allPermissionIds = [];
            user.roles.role_permissions.forEach(rolePerm => {
                if (rolePerm.permissionId !== null && rolePerm.permissionId !== undefined) {
                    const parsed = parsePostgresJson(rolePerm.permissionId);
                    const idsArray = Array.isArray(parsed)
                        ? parsed
                        : (typeof parsed === 'number' && !Number.isNaN(parsed))
                            ? [parsed]
                            : [];
                    allPermissionIds.push(...idsArray);
                }
            });
            
            // Remove duplicates
            const uniquePermissionIds = [...new Set(allPermissionIds)];
            
            // Fetch permission names from the permissions table
            if (uniquePermissionIds.length > 0) {
                const permissions = await prisma.permissions.findMany({
                    where: {
                        id: {
                            in: uniquePermissionIds
                        }
                    }
                });
                userPermissions.push(...permissions.map(p => p.name));
            }
        }
        

        
        // Generate sub-app specific token with roles, permissions, and location
        const token = generateSubAppToken(user.id, appId, userRoles, userPermissions, user.locationId);

        // Map accessLevel to role (fallback)
        const accessLevelToRole = {
            'RESTRICTED': 'accountant',
            'NORMAL': 'accountant',
            'ELEVATED': 'moderator',
            'ADMIN': 'admin',
            'SUPER_ADMIN': 'admin'
        };
        
        const userRole = userRoles.length > 0 ? userRoles[0] : (accessLevelToRole[user.accessLevel] || 'accountant');
        

        
        // Store user details in cookies for easy access in controllers
        const userDetailsCookie = {
            userId: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: userRole,
            roles: userRoles,
            permissions: userPermissions,
            accessLevel: user.accessLevel,
            locationId: user.locationId,
            appId: appId
        };
        
        res.cookie('userDetails', JSON.stringify(userDetailsCookie), {
            httpOnly: false, // Allow JavaScript access
            secure: false, // Allow HTTP in development
            sameSite: 'none', // Most permissive for cross-origin
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            path: '/'
        });
        
        // Store token in cookie
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: false, // Allow HTTP in development
            sameSite: 'none', // Most permissive for cross-origin
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            path: '/'
        });
        
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: userRole,
                    roles: userRoles,
                    permissions: userPermissions,
                    accessLevel: user.accessLevel,
                    locationId: user.locationId,
                    location: user.locations ? {
                        id: user.locations.id,
                        name: user.locations.name,
                        code: user.locations.code,
                        address: user.locations.address
                    } : null
                },
                token,
                appId
            }
        });
        


    } catch (error) {
        console.error('Sub-app login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
};

// Verify sub-app token
export const verifySubAppToken = async (req, res) => {
    try {

        
        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        
        const user = await prisma.users.findFirst({
            where: { id: req.user.userId },
            include: {
                roles: {
                    include: {
                        role_permissions: true
                    }
                },
                locations: true
            }
        });
        
        if (!user) {
    
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }



        // Extract user roles and permissions
        const userRoles = user.roles ? [user.roles.name] : [];
        const userPermissions = [];
        
        // Extract permissions from role_permissions
        if (user.roles?.role_permissions) {
            user.roles.role_permissions.forEach(rolePerm => {
                if (rolePerm.permissionId) {
                    const parsed = parsePostgresJson(rolePerm.permissionId);
                    const idsArray = Array.isArray(parsed)
                        ? parsed
                        : (typeof parsed === 'number' && !Number.isNaN(parsed))
                            ? [parsed]
                            : [];
                }
            });
        }
        
        // Fetch permission names from permission IDs
        if (user.roles?.role_permissions) {
            const allPermissionIds = [];
            user.roles.role_permissions.forEach(rolePerm => {
                if (rolePerm.permissionId) {
                    const parsed = parsePostgresJson(rolePerm.permissionId);
                    const idsArray = Array.isArray(parsed)
                        ? parsed
                        : (typeof parsed === 'number' && !Number.isNaN(parsed))
                            ? [parsed]
                            : [];
                    allPermissionIds.push(...idsArray);
                }
            });
            const uniquePermissionIds = [...new Set(allPermissionIds)];
            if (uniquePermissionIds.length > 0) {
                const permissions = await prisma.permissions.findMany({
                    where: { id: { in: uniquePermissionIds } }
                });
                userPermissions.push(...permissions.map(p => p.name));
            }
        }
        
        // Map accessLevel to role (fallback)
        const accessLevelToRole = {
            'RESTRICTED': 'accountant',
            'NORMAL': 'accountant',
            'ELEVATED': 'moderator',
            'ADMIN': 'admin',
            'SUPER_ADMIN': 'admin'
        };
        
        const userRole = userRoles.length > 0 ? userRoles[0] : (accessLevelToRole[user.accessLevel] || 'accountant');

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: userRole,
                    roles: userRoles,
                    permissions: userPermissions,
                    accessLevel: user.accessLevel,
                    locationId: user.locationId,
                    location: user.locations ? {
                        id: user.locations.id,
                        name: user.locations.name,
                        code: user.locations.code,
                        address: user.locations.address
                    } : null
                },
                appId: req.user.appId
            }
        });

    } catch (error) {
        console.error('Sub-app token verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Token verification failed'
        });
    }
};

// Logout function to clear cookies
export const logout = async (req, res) => {
    try {
        // Clear all authentication cookies
        res.clearCookie('accessToken', { path: '/' });
        res.clearCookie('token', { path: '/' });
        

        
        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed'
        });
    }
};

// Get sub-app user profile
export const getSubAppProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        
        const user = await prisma.users.findUnique({
            where: { id: req.user.userId }
        });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    accessLevel: user.accessLevel
                }
            }
        });

    } catch (error) {
        console.error('Sub-app profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile'
        });
    }
}; 