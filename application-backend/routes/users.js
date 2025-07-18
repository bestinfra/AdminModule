import express from 'express';
import { getAllUsers, getUserStats, addUser, getUserById, updateUser, deleteUser, assignRolesToUser } from '../controllers/userController.js';
import { validateUserData, addUserSchema, assignRolesSchema } from '../validations/userValidation.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/stats', getUserStats);
router.get('/:id', getUserById);
router.post('/', validateUserData(addUserSchema), addUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/:id/assign-roles', validateUserData(assignRolesSchema), assignRolesToUser);

export default router; 