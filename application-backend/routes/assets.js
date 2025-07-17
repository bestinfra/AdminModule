import express from 'express';
import { getAllAssets } from '../controllers/assetController.js';

const router = express.Router();

router.get('/', getAllAssets);

export default router; 