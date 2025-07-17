import express from 'express';
import {
    getAllRoles,
    getRoleStats,
    addRole,
    getRoleById,
    updateRole,
    deleteRole,
    assignPermissionsToRole
} from '../controllers/roleController.js';

const router = express.Router();

router.get('/stats', getRoleStats);
router.get('/', getAllRoles);
router.get('/:id', getRoleById);
router.post('/', addRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);
router.patch('/:id/permissions', assignPermissionsToRole);

export default router; 