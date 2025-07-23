import express from 'express';
import meters from './meters.js';
import consumers from './consumers.js';
import assets from './assets.js';
import users from './users.js';
import roles from './roles.js';
import billing from './billing.js';
import dashboard from './dashboard.js';
import tickets from './tickets.js';
import dtrs from './dtrs.js';
//import email from './email.js';

const router = express.Router();

// Define all route groups
router.use('/meters', meters);
router.use('/consumers', consumers);
router.use('/assets', assets);
router.use('/users', users);
router.use('/roles', roles);
router.use('/billing', billing);
router.use('/dashboard', dashboard);
router.use('/tickets', tickets);
router.use('/dtrs', dtrs);
//router.use('/email', email);

// Health check endpoint
router.get('/health', (req, res) => res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Application Backend API is running'
}));

export default router; 