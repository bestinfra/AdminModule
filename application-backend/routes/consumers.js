import express from 'express';
import { getAllConsumers } from '../controllers/consumerController.js';

const router = express.Router();

// Get all consumers
router.get('/', getAllConsumers);

export default router; 