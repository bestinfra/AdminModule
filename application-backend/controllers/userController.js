import UserDB from '../models/UserDB.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserDB.getAllUsers();
        res.json({
            success: true,
            data: users,
            message: 'Users retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching users:', error);
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
        const userData = req.body;

        const requiredFields = ['username', 'email', 'password', 'firstName', 'lastName'];
        for (const field of requiredFields) {
            if (!userData[field]) {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required`
                });
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        if (userData.password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

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
        const { roleIds } = req.body;

        if (!roleIds || !Array.isArray(roleIds)) {
            return res.status(400).json({
                success: false,
                message: 'roleIds array is required'
            });
        }

        const updatedUser = await UserDB.assignRolesToUser(parseInt(id), roleIds);
        
        res.json({
            success: true,
            data: updatedUser,
            message: 'Roles assigned successfully'
        });
    } catch (error) {
        console.error(' assignRolesToUser: Error assigning roles:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to assign roles',
            error: error.message
        });
    }
}; 