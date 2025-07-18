import express from 'express';
import { getAllMeters, getMeterById, createMeter, updateMeter, deleteMeter, getMeterStats, getMeterView } from '../controllers/meterController.js';
import { validateMeterData, createMeterSchema } from '../validations/meterValidation.js';

const router = express.Router();

router.get('/', getAllMeters);
router.get('/stats', getMeterStats);
router.get('/:id', getMeterById);
router.get('/:id/view', getMeterView);
router.post('/', validateMeterData(createMeterSchema), createMeter);
router.put('/:id', updateMeter);
router.delete('/:id', deleteMeter);

export default router; 