import express from 'express';
import { getPostpaidBillingStats, getPostpaidBillingTable } from '../controllers/billingController.js';

const router = express.Router();

router.get('/postpaid/stats', getPostpaidBillingStats);
router.get('/postpaid/table', getPostpaidBillingTable);

export default router; 