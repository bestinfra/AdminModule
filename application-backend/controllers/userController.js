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