import UserDB from '../models/UserDB.js';

export const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        
        // Get user's location from req.user (populated by middleware)
        const userLocationId = req.user?.locationId;
        
        const result = await UserDB.getAllUsers(page, limit, userLocationId, search);
        
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
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(result.total / limit),
                totalCount: result.total,
                limit: limit,
                hasNextPage: page < Math.ceil(result.total / limit),
                hasPrevPage: page > 1
            },
            message: 'Users retrieved successfully',
            userLocation: userLocationId,
            filteredByLocation: !!userLocationId
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
        // Get user's location from req.user (populated by middleware)
        const userLocationId = req.user?.locationId;
        
        const stats = await UserDB.getUserStats(userLocationId);
        
        res.json({
            success: true,
            data: stats,
            userLocation: userLocationId,
            filteredByLocation: !!userLocationId
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
    console.log('🚀 === ADD USER API CALL STARTED ===');
    console.log('📋 Request Headers:', req.headers);
    console.log('📋 Request Body:', req.body);
    console.log('📋 Validated Data:', req.validatedData);
    console.log('👤 User from cookies:', req.user);
    
    // Additional debugging for roleId
    console.log('🎭 === ROLE ID DEBUG ===');
    console.log('📋 roleId from request body:', {
        value: req.body.roleId,
        type: typeof req.body.roleId,
        truthy: !!req.body.roleId,
        stringified: JSON.stringify(req.body.roleId)
    });
    console.log('📋 roleId from validated data:', {
        value: req.validatedData.roleId,
        type: typeof req.validatedData.roleId,
        truthy: !!req.validatedData.roleId,
        stringified: JSON.stringify(req.validatedData.roleId)
    });
    
    // Check if roleId is being sent at all
    console.log('🔍 === COMPLETE REQUEST BODY ANALYSIS ===');
    console.log('📋 All request body keys:', Object.keys(req.body));
    console.log('📋 All request body values:', Object.values(req.body));
    console.log('📋 Request body types:', Object.entries(req.body).map(([key, value]) => ({
        key,
        value,
        type: typeof value,
        truthy: !!value
    })));
    
    // Check if the role field is being sent instead of roleId
    console.log('🎭 === ROLE FIELD CHECK ===');
    console.log('📋 role field from request body:', {
        value: req.body.role,
        type: typeof req.body.role,
        truthy: !!req.body.role
    });
    console.log('📋 role field from validated data:', {
        value: req.validatedData.role,
        type: typeof req.validatedData.role,
        truthy: !!req.validatedData.role
    });
    
    try {
        // Use validated data from middleware
        const userData = req.validatedData;
        console.log('✅ Validation passed, proceeding with user creation');
        console.log('📊 User data to be created:', { ...userData, password: '[HIDDEN]' });

        console.log('🏗️ Calling UserDB.addUser...');
        const newUser = await UserDB.addUser(userData);
        console.log('✅ User created successfully in database');
        console.log('📊 New user data:', { ...newUser, password: '[HIDDEN]' });
        
        console.log('📤 Sending success response...');
        res.status(201).json({
            success: true,
            data: newUser,
            message: 'User created successfully'
        });
        console.log('🎉 === ADD USER API CALL COMPLETED SUCCESSFULLY ===');
    } catch (error) {
        console.error('💥 === ADD USER API CALL FAILED ===');
        console.error('❌ Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        if (error.message.includes('already exists')) {
            console.log('🔄 Sending 409 conflict response');
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        console.log('🔄 Sending 500 error response');
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

// Get all roles for dropdown
export const getAllRoles = async (req, res) => {
    try {
        const roles = await UserDB.getAllRoles();
        
        res.json({
            success: true,
            data: roles,
            message: 'Roles retrieved successfully'
        });
    } catch (error) {
        console.error('getAllRoles: Error fetching roles:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch roles',
            error: error.message
        });
    }
};

// Get all locations for dropdown
export const getAllLocations = async (req, res) => {
    try {
        const locations = await UserDB.getAllLocations();
        
        res.json({
            success: true,
            data: locations,
            message: 'Locations retrieved successfully'
        });
    } catch (error) {
        console.error('getAllLocations: Error fetching locations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch locations',
            error: error.message
        });
    }
}; 