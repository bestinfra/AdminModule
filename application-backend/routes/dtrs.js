import express from 'express';
import { getDTRTable, getFeedersForDTR, getDTRAlerts, getDTRAlertsTrends, getDTRStats, getConsumptionStats, getFeederStats, getInstantaneousStats } from '../controllers/dtrController.js';

const router = express.Router();

router.get('/', getDTRTable);
router.get('/:dtrId', getFeedersForDTR);
router.get('/alerts', getDTRAlerts);
router.get('/alerts/trends', getDTRAlertsTrends);
router.get('/stats', getDTRStats);
router.get('/consumptionStats', getConsumptionStats);
router.get('/:dtrId/feederStats', getFeederStats);
router.get('/:meterId/instantaneousStats', getInstantaneousStats);

export default router; 