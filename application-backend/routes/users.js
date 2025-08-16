import express from 'express';
import { getAllUsers, getUserStats, addUser, getUserById, updateUser, deleteUser, assignRolesToUser, getAllRoles, getAllLocations } from '../controllers/userController.js';
import { validateUserData, addUserSchema, assignRolesSchema } from '../validations/userValidation.js';
import { populateUserFromCookies } from '../utils/cookieUtils.js';


const router = express.Router();

router.use(populateUserFromCookies);

// Add logging middleware for addUser route
router.post('/', (req, res, next) => {
    console.log('🛣️ === ADD USER ROUTE HIT ===');
    console.log('📋 HTTP Method:', req.method);
    console.log('📋 Route Path:', req.path);
    console.log('📋 Request Body:', req.body);
    console.log('📋 Request Headers:', req.headers);
    console.log('📋 User from cookies:', req.user);
    console.log('🔄 Proceeding to validation middleware...');
    next();
}, validateUserData(addUserSchema), addUser);

router.get('/', getAllUsers);
router.get('/stats', getUserStats);
router.get('/roles', getAllRoles); // New endpoint for roles dropdown
router.get('/locations', getAllLocations); // New endpoint for locations dropdown
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/:id/assign-roles', validateUserData(assignRolesSchema), assignRolesToUser);

export default router; 