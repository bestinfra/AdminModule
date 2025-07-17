import express from 'express';
import {
    getAllMeters,
    getMeterById,
    createMeter,
    updateMeter,
    deleteMeter
} from '../controllers/meterController.js';

const router = express.Router();

// Get all meters
router.get('/', getAllMeters);

// Get meter by ID
router.get('/:id', getMeterById);

// Create new meter
router.post('/', createMeter);

// Update meter
router.put('/:id', updateMeter);

// Delete meter
router.delete('/:id', deleteMeter);

export default router; 