import express from 'express';
import { 
    getPostpaidBillingStats, 
    getPostpaidBillingTable, 
    generateMonthlyBills, 
    getTariffByCategory 
} from '../controllers/billingController.js';

const router = express.Router();

router.get('/postpaid/stats', getPostpaidBillingStats);
router.get('/postpaid/table', getPostpaidBillingTable);
router.post('/generate-monthly', generateMonthlyBills);
router.get('/tariff/:category/:type', getTariffByCategory);

export default router; 