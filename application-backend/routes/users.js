import express from 'express';
import {
    getAllUsers,
    getUserStats,
    addUser,
    getUserById,
    updateUser,
    deleteUser,
    assignRolesToUser
} from '../controllers/userController.js';

const router = express.Router();

router.get('/stats', getUserStats);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', addUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/roles', assignRolesToUser);

export default router; 