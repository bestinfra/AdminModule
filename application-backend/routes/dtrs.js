import express from 'express';
import { getDTRTable, getFeedersForDTR, getDTRAlerts, getDTRAlertsTrends, getDTRStats, getConsumptionStats, getFeederStats, getInstantaneousStats, getConsolidatedDTRStats, getDTRConsumptionAnalytics, getIndividualDTRAlerts, getKVAMetrics } from '../controllers/dtrController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all DTR routes
router.use(authenticateToken);

router.get('/', getDTRTable);
// router.get('/stats', getDTRStats);
// router.get('/consumptionStats', getConsumptionStats);
router.get('/stats', getConsolidatedDTRStats);
router.get('/alerts', getDTRAlerts);
router.get('/alerts/trends', getDTRAlertsTrends);
router.get('/:dtrId', getFeedersForDTR);
router.get('/:dtrId/feederStats', getFeederStats);
router.get('/:dtrId/consumptionAnalytics', getDTRConsumptionAnalytics);
router.get('/:dtrId/instantaneousStats', getInstantaneousStats);
router.get('/:dtrId/alerts', getIndividualDTRAlerts);
router.get('/:dtrId/kvaMetrics', getKVAMetrics);

export default router; 