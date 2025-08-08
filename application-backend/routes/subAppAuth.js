import express from 'express';
import {
    subAppLogin,
    verifySubAppToken,
    getSubAppProfile
} from '../controllers/subAppAuthController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', subAppLogin);

// Protected routes
router.get('/verify-token', authenticateToken, verifySubAppToken);
router.get('/profile', authenticateToken, getSubAppProfile);

export default router; 