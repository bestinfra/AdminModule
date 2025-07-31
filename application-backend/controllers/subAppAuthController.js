import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// JWT Secret (In production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Generate JWT Token for sub-apps
const generateSubAppToken = (userId, appId = null) => {
    return jwt.sign({ 
        userId, 
        appId,
        type: 'sub-app' 
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

        // Find user by email or username
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
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

        // // Validate password using bcrypt
        // const bcrypt = await import('bcrypt');
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        
        // if (!isPasswordValid) {
        //     // Increment failed login attempts
        //     await prisma.user.update({
        //         where: { id: user.id },
        //         data: {
        //             failedLoginAttempts: (user.failedLoginAttempts || 0) + 1,
        //             lockoutUntil: (user.failedLoginAttempts || 0) >= 4 ? new Date(Date.now() + 15 * 60 * 1000) : null // 15 minutes lockout
        //         }
        //     });

        //     return res.status(401).json({
        //         success: false,
        //         message: 'Invalid username/email or password'
        //     });
        // }

        // Reset failed login attempts on successful login
        await prisma.user.update({
            where: { id: user.id },
            data: {
                failedLoginAttempts: 0,
                lockoutUntil: null,
                lastLoginAt: new Date()
            }
        });

        // Generate sub-app specific token
        const token = generateSubAppToken(user.id, appId);

        // Map accessLevel to role
        const accessLevelToRole = {
            'RESTRICTED': 'accountant',
            'NORMAL': 'accountant',
            'ELEVATED': 'moderator',
            'ADMIN': 'admin',
            'SUPER_ADMIN': 'admin'
        };
        
        const userRole = accessLevelToRole[user.accessLevel] || 'accountant';
        
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
                    accessLevel: user.accessLevel
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
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId }
        });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Map accessLevel to role
        const accessLevelToRole = {
            'RESTRICTED': 'accountant',
            'NORMAL': 'accountant',
            'ELEVATED': 'moderator',
            'ADMIN': 'admin',
            'SUPER_ADMIN': 'admin'
        };
        
        const userRole = accessLevelToRole[user.accessLevel] || 'accountant';

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
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId }
        });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Map accessLevel to role
        const accessLevelToRole = {
            'RESTRICTED': 'accountant',
            'NORMAL': 'accountant',
            'ELEVATED': 'moderator',
            'ADMIN': 'admin',
            'SUPER_ADMIN': 'admin'
        };
        
        const userRole = accessLevelToRole[user.accessLevel] || 'accountant';

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
                    accessLevel: user.accessLevel,
                    createdAt: user.createdAt
                },
                appId: req.user.appId
            }
        });

    } catch (error) {
        console.error('Get sub-app profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user profile'
        });
    }
}; 