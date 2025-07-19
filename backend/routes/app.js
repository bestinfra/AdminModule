import express from 'express';
import {
    createApp,
    getAllApps,
    getAppById,
    updateApp,
    deleteApp,
    publishApp,
    unpublishApp,
    getAppCustomColors,
    updateAppCustomColors
} from '../controllers/appController.js';

const router = express.Router();

// Create app
router.post('/', createApp);

// Get all apps
router.get('/', getAllApps);

// Get app by ID
router.get('/:id', getAppById);

// Update app
router.put('/:id', updateApp);

// Delete app
router.delete('/:id', deleteApp);

// Publish app
router.post('/:id/publish', publishApp);

// Unpublish app
router.post('/:id/unpublish', unpublishApp);

// Get app custom colors
router.get('/:id/colors', getAppCustomColors);

// Update app custom colors
router.put('/:id/colors', updateAppCustomColors);

export default router; 