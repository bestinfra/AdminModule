import jwt from 'jsonwebtoken';
import UserDB from '../models/UserDB.js';

// JWT Secret (should match the one in authController)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Authentication middleware
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        console.log('Auth header:', authHeader);
        console.log('Token:', token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded token:', decoded);
        
        // Check if user exists
        const user = await UserDB.findById(decoded.userId);
        console.log('Found user:', user);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token - user not found'
            });
        }

        // Add user info to request
        req.user = {
            userId: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        console.log('User info added to request:', req.user);
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired'
            });
        } else {
            console.error('Authentication error:', error);
            return res.status(500).json({
                success: false,
                message: 'Authentication failed'
            });
        }
    }
};

// Role-based authorization middleware
export const authorizeRole = (roles) => {
    // Ensure roles is an array
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    return (req, res, next) => {
        console.log('Checking role authorization:');
        console.log('Required roles:', allowedRoles);
        console.log('User role:', req.user?.role);
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            console.log('Role authorization failed');
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
            });
        }

        console.log('Role authorization successful');
        next();
    };
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await UserDB.findById(decoded.userId);
            
            if (user) {
                req.user = {
                    userId: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                };
            }
        }

        next();
    } catch (error) {
        // Don't fail on optional auth, just continue without user
        next();
    }
}; 