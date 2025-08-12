import express from 'express';
import {
    subAppLogin,
    verifySubAppToken,
    getSubAppProfile,
    logout
} from '../controllers/subAppAuthController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', subAppLogin);

// Protected routes
router.get('/verify-token', authenticateToken, verifySubAppToken);
router.get('/profile', authenticateToken, getSubAppProfile);
router.post('/logout', authenticateToken, logout);

export default router; 