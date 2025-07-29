import express from 'express';
import { getDTRTable, getFeedersForDTR, getDTRAlerts, getDTRAlertsTrends, getDTRStats, getConsumptionStats, getFeederStats, getInstantaneousStats, getConsolidatedDTRStats, getDTRConsumptionAnalytics, getDTRConsumptionStats } from '../controllers/dtrController.js';

const router = express.Router();

router.get('/', getDTRTable);
// router.get('/stats', getDTRStats);
// router.get('/consumptionStats', getConsumptionStats);
router.get('/stats', getConsolidatedDTRStats);
router.get('/alerts', getDTRAlerts);
router.get('/alerts/trends', getDTRAlertsTrends);
router.get('/:dtrId', getFeedersForDTR);
router.get('/:dtrId/feederStats', getFeederStats);
router.get('/:dtrId/consumptionAnalytics', getDTRConsumptionAnalytics);
router.get('/:dtrId/consumptionStats', getDTRConsumptionStats);
router.get('/:dtrId/instantaneousStats', getInstantaneousStats);

export default router; 