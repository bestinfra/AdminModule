import express from 'express';
import {
    getMeterStats,
    getMeterView,
    createMeter,
    getAllMeters
} from '../controllers/meterController.js';

const router = express.Router();

router.get('/stats', getMeterStats);
router.get('/table', getAllMeters);
router.post('/', createMeter);
router.get('/view/:id', getMeterView);

export default router; 