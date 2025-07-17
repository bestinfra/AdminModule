import express from 'express';
import { getAllRoles } from '../controllers/roleController.js';

const router = express.Router();

// Get all roles
router.get('/', getAllRoles);

export default router; 