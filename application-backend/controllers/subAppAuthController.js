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
        console.log(`   🔍 Parsing JSON value: "${str}"`);
        
        if (str.startsWith('{') && str.endsWith('}')) {
            // PostgreSQL array format: {1,2,4}
            const result = str.slice(1, -1).split(',').map(id => parseInt(id.trim()));
            console.log(`   ✅ Parsed PostgreSQL format: ${result}`);
            return result;
        } else if (str.includes(',') && !str.startsWith('[') && !str.startsWith('{')) {
            // PostgreSQL array format without braces: 1,2,4
            const result = str.split(',').map(id => parseInt(id.trim()));
            console.log(`   ✅ Parsed comma-separated format: ${result}`);
            return result;
        } else {
            // Standard JSON format: [1,2,4]
            const result = JSON.parse(str);
            console.log(`   ✅ Parsed standard JSON format: ${result}`);
            return result;
        }
    } catch (error) {
        console.error(`❌ Error parsing JSON value: "${jsonValue}"`, error.message);
        return [];
    }
};

// Generate JWT Token for sub-apps with roles and permissions
const generateSubAppToken = (userId, appId = null, userRoles = [], userPermissions = []) => {
    return jwt.sign({ 
        userId, 
        appId,
        type: 'sub-app',
        roles: userRoles,
        permissions: userPermissions
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

        // Find user by email or username with roles and permissions
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
                }
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
                if (rolePerm.permissionId) {
                    // permissionId is stored as PostgreSQL JSON format like {1,2,4}
                    const permissionIds = parsePostgresJson(rolePerm.permissionId);
                    if (Array.isArray(permissionIds)) {
                        permissionIds.forEach(permId => {
                            // We'll fetch permission names separately
                            console.log(`   🔍 Found permission ID: ${permId}`);
                        });
                    }
                }
            });
        }
        
        // Fetch permission names from permission IDs
        if (user.roles?.role_permissions) {
            const allPermissionIds = [];
            user.roles.role_permissions.forEach(rolePerm => {
                if (rolePerm.permissionId) {
                    const permissionIds = parsePostgresJson(rolePerm.permissionId);
                    if (Array.isArray(permissionIds)) {
                        allPermissionIds.push(...permissionIds);
                    }
                }
            });
            
            // Remove duplicates
            const uniquePermissionIds = [...new Set(allPermissionIds)];
            console.log(`   📋 Unique permission IDs: ${uniquePermissionIds.join(', ')}`);
            
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
                console.log(`   📋 Permission names: ${permissions.map(p => p.name).join(', ')}`);
            }
        }
        
        // Check if user has permissions
        if (userPermissions.length === 0) {
            console.log(`⚠️ Warning: User ${user.username} has NO permissions in JWT token`);
            console.log(`   📋 This user will see ALL menu items in the sidebar`);
        } else {
            console.log(`✅ User ${user.username} has ${userPermissions.length} permissions`);
        }
        
        // Generate sub-app specific token with roles and permissions
        console.log(`🎫 Generating JWT token for user ${user.username}...`);
        console.log(`   📋 Token payload:`, {
            userId: user.id,
            appId: appId,
            roles: userRoles,
            permissions: userPermissions
        });
        
        const token = generateSubAppToken(user.id, appId, userRoles, userPermissions);
        console.log(`   ✅ JWT token generated successfully`);
        console.log(`   📏 Token length: ${token.length} characters`);

        // Map accessLevel to role (fallback)
        const accessLevelToRole = {
            'RESTRICTED': 'accountant',
            'NORMAL': 'accountant',
            'ELEVATED': 'moderator',
            'ADMIN': 'admin',
            'SUPER_ADMIN': 'admin'
        };
        
        const userRole = userRoles.length > 0 ? userRoles[0] : (accessLevelToRole[user.accessLevel] || 'accountant');
        
        console.log(`📤 Sending login response for user ${user.username}...`);
        console.log(`   📋 Response data:`, {
            userId: user.id,
            username: user.username,
            role: userRole,
            rolesCount: userRoles.length,
            permissionsCount: userPermissions.length,
            hasToken: !!token
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
                    accessLevel: user.accessLevel
                },
                token,
                appId
            }
        });
        
        console.log(`✅ Login response sent successfully for user ${user.username}`);

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
        const user = await prisma.users.findFirst({
            where: { id: req.user.userId },
            include: {
                roles: {
                    include: {
                        role_permissions: true
                    }
                }
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
                    // permissionId is stored as PostgreSQL JSON format like {1,2,4}
                    const permissionIds = parsePostgresJson(rolePerm.permissionId);
                    if (Array.isArray(permissionIds)) {
                        permissionIds.forEach(permId => {
                            // We'll fetch permission names separately
                            console.log(`   🔍 Found permission ID: ${permId}`);
                        });
                    }
                }
            });
        }
        
        // Fetch permission names from permission IDs
        if (user.roles?.role_permissions) {
            const allPermissionIds = [];
            user.roles.role_permissions.forEach(rolePerm => {
                if (rolePerm.permissionId) {
                    const permissionIds = parsePostgresJson(rolePerm.permissionId);
                    if (Array.isArray(permissionIds)) {
                        allPermissionIds.push(...permissionIds);
                    }
                }
            });
            
            // Remove duplicates
            const uniquePermissionIds = [...new Set(allPermissionIds)];
            console.log(`   📋 Unique permission IDs: ${uniquePermissionIds.join(', ')}`);
            
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
                console.log(`   📋 Permission names: ${permissions.map(p => p.name).join(', ')}`);
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
                    accessLevel: user.accessLevel
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

// Get sub-app user profile
export const getSubAppProfile = async (req, res) => {
    try {
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