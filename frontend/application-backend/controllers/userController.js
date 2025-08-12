import UserDB from '../models/UserDB.js';

export const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const result = await UserDB.getAllUsers(page, limit);
        
        // Format the data for the frontend table
        const formatted = result.data.map((u, idx) => ({
            sNo: (page - 1) * limit + idx + 1,
            userId: u.userId || u.id,
            name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim(),
            email: u.email,
            phone: u.phone || u.phoneNumber || '-',
            role: u.roles?.name || '-',
            client: u.departments?.name || '-',
            lastActive: u.lastActive || '-',
            createdDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-',
        }));
        
        res.json({
            success: true,
            data: formatted,
            pagination: result.pagination,
            message: 'Users retrieved successfully'
        });
    } catch (error) {
        console.error('getAllUsers: Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
};

export const getUserStats = async (req, res) => {
    try {
        const stats = await UserDB.getUserStats();
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error(' getUserStats: Error fetching user stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user statistics',
            error: error.message
        });
    }
};

export const addUser = async (req, res) => {
    try {
        // Use validated data from middleware
        const userData = req.validatedData;

        const newUser = await UserDB.addUser(userData);
        
        res.status(201).json({
            success: true,
            data: newUser,
            message: 'User created successfully'
        });
    } catch (error) {
        console.error(' addUser: Error creating user:', error);
        
        if (error.message.includes('already exists')) {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create user',
            error: error.message
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserDB.getUserById(parseInt(id));
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(' getUserById: Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user',
            error: error.message
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userData = req.body;

        delete userData.id;
        delete userData.createdAt;
        delete userData.updatedAt;

        const updatedUser = await UserDB.updateUser(parseInt(id), userData);
        
        res.json({
            success: true,
            data: updatedUser,
            message: 'User updated successfully'
        });
    } catch (error) {
        console.error(' updateUser: Error updating user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user',
            error: error.message
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await UserDB.deleteUser(parseInt(id));
        
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error(' deleteUser: Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user',
            error: error.message
        });
    }
};

export const assignRolesToUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Use validated data from middleware
        const { roleId } = req.validatedData;

        const updatedUser = await UserDB.assignRolesToUser(parseInt(id), [roleId]);
        
        res.json({
            success: true,
            data: updatedUser,
            message: 'Role assigned successfully'
        });
    } catch (error) {
        console.error(' assignRolesToUser: Error assigning role:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to assign role',
            error: error.message
        });
    }
}; 