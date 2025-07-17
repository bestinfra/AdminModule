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

export const addRole = async (req, res) => {
    try {
        const roleData = req.body;

        if (!roleData.name) {
            return res.status(400).json({
                success: false,
                message: 'Role name is required'
            });
        }

        const nameRegex = /^[a-zA-Z0-9\s]+$/;
        if (!nameRegex.test(roleData.name)) {
            return res.status(400).json({
                success: false,
                message: 'Role name can only contain letters, numbers, and spaces'
            });
        }

        if (roleData.name.length < 2 || roleData.name.length > 50) {
            return res.status(400).json({
                success: false,
                message: 'Role name must be between 2 and 50 characters'
            });
        }

        const newRole = await RoleDB.addRole(roleData);
        
        res.status(201).json({
            success: true,
            data: newRole,
            message: 'Role created successfully'
        });
    } catch (error) {
        console.error(' addRole: Error creating role:', error);
        
        // Handle specific error cases
        if (error.message.includes('already exists')) {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create role',
            error: error.message
        });
    }
};

export const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await RoleDB.getRoleById(parseInt(id));
        
        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        res.json({
            success: true,
            data: role
        });
    } catch (error) {
        console.error(' getRoleById: Error fetching role:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch role',
            error: error.message
        });
    }
};

export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const roleData = req.body;

        if (roleData.name) {
            const nameRegex = /^[a-zA-Z0-9\s]+$/;
            if (!nameRegex.test(roleData.name)) {
                return res.status(400).json({
                    success: false,
                    message: 'Role name can only contain letters, numbers, and spaces'
                });
            }

            if (roleData.name.length < 2 || roleData.name.length > 50) {
                return res.status(400).json({
                    success: false,
                    message: 'Role name must be between 2 and 50 characters'
                });
            }
        }

        const updatedRole = await RoleDB.updateRole(parseInt(id), roleData);
        
        res.json({
            success: true,
            data: updatedRole,
            message: 'Role updated successfully'
        });
    } catch (error) {
        console.error(' updateRole: Error updating role:', error);
        
        if (error.message.includes('already exists')) {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update role',
            error: error.message
        });
    }
};

export const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        await RoleDB.deleteRole(parseInt(id));
        
        res.json({
            success: true,
            message: 'Role deleted successfully'
        });
    } catch (error) {
        console.error(' deleteRole: Error deleting role:', error);
        
        if (error.message.includes('assigned to users')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to delete role',
            error: error.message
        });
    }
};

export const assignPermissionsToRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { permissionIds } = req.body;

        if (!permissionIds || !Array.isArray(permissionIds)) {
            return res.status(400).json({
                success: false,
                message: 'permissionIds array is required'
            });
        }

        const updatedRole = await RoleDB.assignPermissionsToRole(parseInt(id), permissionIds);
        
        res.json({
            success: true,
            data: updatedRole,
            message: 'Permissions assigned successfully'
        });
    } catch (error) {
        console.error(' assignPermissionsToRole: Error assigning permissions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to assign permissions',
            error: error.message
        });
    }
};

export const getRoleStats = async (req, res) => {
    try {
        const stats = await RoleDB.getRoleStats();
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error(' getRoleStats: Error fetching role stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch role statistics',
            error: error.message
        });
    }
}; 