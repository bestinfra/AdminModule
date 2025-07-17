import express from 'express';
import { getAllAssets } from '../controllers/assetController.js';

const router = express.Router();

// Get all assets
router.get('/', getAllAssets);

export default router; 