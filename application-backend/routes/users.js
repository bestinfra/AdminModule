import express from 'express';
import { getAllUsers } from '../controllers/userController.js';

const router = express.Router();

// Get all users
router.get('/', getAllUsers);

export default router; 