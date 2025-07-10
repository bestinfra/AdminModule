import express from 'express';
import {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    verifyToken
} from '../controllers/authController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes (require authentication)
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.get('/verify-token', authenticateToken, verifyToken);

// Admin only routes
router.get('/users', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try {
        // This would get all users (admin only)
        const UserDB = (await import('../models/UserDB.js')).default;
        const users = await UserDB.getAllUsers();

        res.json({
            success: true,
            data: { users }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get users'
        });
    }
});

export default router; 