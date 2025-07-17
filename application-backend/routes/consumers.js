import express from 'express';
import { getAllConsumers, getConsumerByNumber, getPowerWidgets, getConsumerHistory } from '../controllers/consumerController.js';

const router = express.Router();

router.get('/', getAllConsumers);
router.get('/widgets', getPowerWidgets);
router.get('/history/:consumerNumber', getConsumerHistory);
router.get('/:consumerNumber', getConsumerByNumber);

export default router; 