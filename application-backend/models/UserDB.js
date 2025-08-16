import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

class UserDB {
    static async getAllUsers(page = 1, limit = 10, locationId = null) {
        try {
            const skip = (page - 1) * limit;
            
            const whereClause = {};
            
            // If locationId is provided, filter users by location
            if (locationId) {
                whereClause.locationId = locationId;
            }
            
            const totalCount = await prisma.users.count({ where: whereClause });
            
            const users = await prisma.users.findMany({
                where: whereClause,
                include: {
                    roles: true,
                    departments: true
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            });
            
            const totalPages = Math.ceil(totalCount / limit);
            
            return {
                data: users,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                    limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            };
        } catch (error) {
            console.error('Error getting all users:', error);
            throw error;
        }
    }

    static async getUserStats(locationId = null) {
        try {
            const whereClause = {};
            
            // If locationId is provided, filter users by location
            if (locationId) {
                whereClause.locationId = locationId;
            }
            
            const users = await prisma.users.findMany({
                where: whereClause,
                include: {
                    roles: true
                }
            });

            const totalUsers = users.length;
            const activeUsers = users.filter(user => user.isActive).length;
            const inactiveUsers = users.filter(user => !user.isActive).length;

            const roleCounts = {};
            users.forEach(user => {
                if (user.roles) {
                    const roleName = user.roles.name;
                    roleCounts[roleName] = (roleCounts[roleName] || 0) + 1;
                }
            });

            const totalRoles = await prisma.roles.count();

            const stats = {
                totalUsers,
                activeUsers,
                inactiveUsers,
                totalAdmins: roleCounts['ADMIN'] || 0,
                totalAccountants: roleCounts['ACCOUNTANT'] || 0,
                totalModerators: roleCounts['MODERATOR'] || 0,
                totalRoles,
                roleBreakdown: roleCounts
            };
            
            return stats;
        } catch (error) {
            console.error(' UserDB.getUserStats: Database error:', error);
            throw error;
        }
    }

    static async addUser(userData) {
        console.log('🏗️ === USERDB.ADDUSER STARTED ===');
        console.log('📋 Received user data:', { ...userData, password: '[HIDDEN]' });
        
        try {
            console.log('🔍 Validating required fields...');
            const requiredFields = ['username', 'email', 'password', 'firstName'];
            for (const field of requiredFields) {
                if (!userData[field]) {
                    console.log(`❌ Missing required field: ${field}`);
                    throw new Error(`${field} is required`);
                }
                console.log(`✅ Required field ${field}: ${field === 'password' ? '[HIDDEN]' : userData[field]}`);
            }
            
            // Check optional fields
            console.log('🔍 Checking optional fields...');
            console.log(`📋 lastName: "${userData.lastName}" (type: ${typeof userData.lastName}, length: ${userData.lastName ? userData.lastName.length : 0})`);
            console.log(`📋 roleId: ${userData.roleId} (type: ${typeof userData.roleId})`);
            console.log(`📋 phone: ${userData.phone} (type: ${typeof userData.phone})`);
            
            console.log('✅ All required fields validated');

            console.log('🔍 Checking for existing username...');
            const existingUsername = await prisma.users.findUnique({
                where: { username: userData.username }
            });
            if (existingUsername) {
                console.log(`❌ Username already exists: ${userData.username}`);
                throw new Error('Username already exists');
            }
            console.log('✅ Username is unique');

            console.log('🔍 Checking for existing email...');
            const existingEmail = await prisma.users.findUnique({
                where: { email: userData.email }
            });
            if (existingEmail) {
                console.log(`❌ Email already exists: ${userData.email}`);
                throw new Error('Email already exists');
            }
            console.log('✅ Email is unique');

            console.log('🔐 Hashing password...');
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
            console.log('✅ Password hashed successfully');

            console.log('🏗️ Preparing user creation data...');
            console.log('🎭 Role ID details:', {
                originalRoleId: userData.roleId,
                roleIdType: typeof userData.roleId,
                roleIdParsed: userData.roleId ? parseInt(userData.roleId) : null,
                willIncludeRole: !!userData.roleId
            });
            
            // Check if roleId is actually being passed
            console.log('🔍 === ROLE ID VALIDATION ===');
            console.log('📋 userData.roleId value:', userData.roleId);
            console.log('📋 userData.roleId type:', typeof userData.roleId);
            console.log('📋 userData.roleId truthy:', !!userData.roleId);
            console.log('📋 userData.roleId === null:', userData.roleId === null);
            console.log('📋 userData.roleId === undefined:', userData.roleId === undefined);
            
            const userCreateData = {
                username: userData.username,
                email: userData.email,
                password: hashedPassword,
                firstName: userData.firstName,
                lastName: userData.lastName || '', // Ensure lastName is never undefined
                phone: userData.phone || null,
                profileImage: userData.profileImage || null,
                isActive: userData.isActive !== undefined ? userData.isActive : true,
                isLocked: userData.isLocked !== undefined ? userData.isLocked : false,
                accessLevel: userData.accessLevel || 'NORMAL',
                departmentId: userData.departmentId || null,
                locationId: userData.locationId, // Add locationId
                updatedAt: new Date() // Add updatedAt since it's required by schema
            };
            console.log(' User creation data prepared:', { ...userCreateData, password: '[HIDDEN]' });

            // Create user with role if provided
            let newUser;
            if (userData.roleId) {
                console.log(`🎭 Creating user with role ID: ${userData.roleId}`);
                console.log('📊 Final create data with role:', { ...userCreateData, roleId: userData.roleId, password: '[HIDDEN]' });
                newUser = await prisma.users.create({
                    data: {
                        ...userCreateData,
                        roleId: parseInt(userData.roleId)
                    },
                    include: {
                        roles: true,
                        departments: true
                    }
                });
            } else {
                console.log('👤 Creating user without role');
                console.log('📊 Final create data without role:', { ...userCreateData, password: '[HIDDEN]' });
                newUser = await prisma.users.create({
                    data: userCreateData,
                    include: {
                        roles: true,
                        departments: true
                    }
                });
            }
            
            console.log('✅ User created successfully in database');
            console.log('📊 New user details:', { ...newUser, password: '[HIDDEN]' });
            console.log('🎉 === USERDB.ADDUSER COMPLETED SUCCESSFULLY ===');
            
            return newUser;
        } catch (error) {
            console.error('💥 === USERDB.ADDUSER FAILED ===');
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name,
                code: error.code
            });
            
            // Handle specific Prisma errors
            if (error.code === 'P2002') {
                console.log('🔍 Unique constraint violation detected');
                if (error.message.includes('username')) {
                    throw new Error('Username already exists');
                } else if (error.message.includes('email')) {
                    throw new Error('Email already exists');
                } else if (error.message.includes('id')) {
                    console.log('⚠️ ID constraint violation - this might indicate a database sequence issue');
                    throw new Error('Database error: ID constraint violation. Please contact administrator.');
                } else {
                    throw new Error('A record with this information already exists');
                }
            } else if (error.code === 'P2003') {
                console.log('🔍 Foreign key constraint violation detected');
                throw new Error('Invalid reference data provided');
            }
            
            throw error;
        }
    }

    static async getUserById(userId) {
        try {
            return await prisma.users.findUnique({
                where: { id: userId },
                include: {
                    roles: true,
                    departments: true,
                    user_permissions: {
                        include: {
                            permissions: true
                        }
                    }
                }
            });
        } catch (error) {
            console.error(' UserDB.getUserById: Database error:', error);
            throw error;
        }
    }

    static async updateUser(userId, userData) {
        try {
            // If password is being updated, hash it
            if (userData.password) {
                const saltRounds = 10;
                userData.password = await bcrypt.hash(userData.password, saltRounds);
                userData.passwordChangedAt = new Date();
            }

            return await prisma.users.update({
                where: { id: userId },
                data: userData,
                include: {
                    roles: true,
                    departments: true
                }
            });
        } catch (error) {
            console.error(' UserDB.updateUser: Database error:', error);
            throw error;
        }
    }

    static async deleteUser(userId) {
        try {
            return await prisma.users.delete({
                where: { id: userId }
            });
        } catch (error) {
            console.error(' UserDB.deleteUser: Database error:', error);
            throw error;
        }
    }

    static async assignRolesToUser(userId, roleId) {
        try {
            // Assign single role (take the first one if multiple provided)
            const roleIdToAssign = roleId && roleId.length > 0 ? parseInt(roleId[0]) : null;
            
            await prisma.users.update({
                where: { id: userId },
                data: {
                    roleId: roleIdToAssign
                }
            });

            return await this.getUserById(userId);
        } catch (error) {
            console.error(' UserDB.assignRolesToUser: Database error:', error);
            throw error;
        }
    }

    // Get all roles for dropdown
    static async getAllRoles() {
        try {
            const roles = await prisma.roles.findMany({
                select: {
                    id: true,
                    name: true
                },
                orderBy: {
                    name: 'asc'
                }
            });
            return roles;
        } catch (error) {
            console.error(' UserDB.getAllRoles: Database error:', error);
            throw error;
        }
    }

    // Get all locations for dropdown
    static async getAllLocations() {
        try {
            const locations = await prisma.locations.findMany({
                select: {
                    id: true,
                    name: true
                },
                orderBy: {
                    name: 'asc'
                }
            });
            return locations;
        } catch (error) {
            console.error(' UserDB.getAllLocations: Database error:', error);
            throw error;
        }
    }
}

export default UserDB; 