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
        try {
            
            const requiredFields = ['username', 'email', 'password', 'firstName', 'lastName'];
            for (const field of requiredFields) {
                if (!userData[field]) {
                    throw new Error(`${field} is required`);
                }
            }

            const existingUsername = await prisma.users.findUnique({
                where: { username: userData.username }
            });
            if (existingUsername) {
                throw new Error('Username already exists');
            }

            const existingEmail = await prisma.users.findUnique({
                where: { email: userData.email }
            });
            if (existingEmail) {
                throw new Error('Email already exists');
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

            const userCreateData = {
                username: userData.username,
                email: userData.email,
                password: hashedPassword,
                firstName: userData.firstName,
                lastName: userData.lastName,
                phone: userData.phone || null,
                profileImage: userData.profileImage || null,
                isActive: userData.isActive !== undefined ? userData.isActive : true,
                isLocked: userData.isLocked !== undefined ? userData.isLocked : false,
                accessLevel: userData.accessLevel || 'NORMAL',
                departmentId: userData.departmentId || null
            };

            // Create user with role if provided
            let newUser;
            if (userData.roleId) {
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
                // Create user without role
                newUser = await prisma.users.create({
                    data: userCreateData,
                    include: {
                        roles: true,
                        departments: true
                    }
                });
            }
            
            return newUser;
        } catch (error) {
            console.error(' UserDB.addUser: Database error:', error);
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
}

export default UserDB; 