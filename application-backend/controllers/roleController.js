import RoleDB from '../models/RoleDB.js';

export const getAllRoles = async (req, res) => {
    try {
        const roles = await RoleDB.getAllRoles();
        res.json({
            success: true,
            data: roles,
            message: 'Roles retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch roles',
            error: error.message
        });
    }
}; 