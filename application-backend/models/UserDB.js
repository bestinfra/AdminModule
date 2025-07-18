import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

class UserDB {
    static async getAllUsers() {
        try {
            const users = await prisma.user.findMany({
                include: {
                    roles: {
                        include: {
                            role: true
                        }
                    },
                    department: true
                },
                orderBy: { createdAt: 'desc' }
            });
            return users;
        } catch (error) {
            console.error('Error getting all users:', error);
            throw error;
        }
    }

    static async getUserStats() {
        try {
            const users = await prisma.user.findMany({
                include: {
                    roles: {
                        include: {
                            role: true
                        }
                    }
                }
            });

            const totalUsers = users.length;
            const activeUsers = users.filter(user => user.isActive).length;
            const inactiveUsers = users.filter(user => !user.isActive).length;

            const roleCounts = {};
            users.forEach(user => {
                user.roles.forEach(userRole => {
                    const roleName = userRole.role.name;
                    roleCounts[roleName] = (roleCounts[roleName] || 0) + 1;
                });
            });

            const totalRoles = await prisma.role.count();

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

            const existingUsername = await prisma.user.findUnique({
                where: { username: userData.username }
            });
            if (existingUsername) {
                throw new Error('Username already exists');
            }

            const existingEmail = await prisma.user.findUnique({
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

            // Create user with roles if provided
            let newUser;
            if (userData.roleIds && userData.roleIds.length > 0) {
                newUser = await prisma.user.create({
                    data: {
                        ...userCreateData,
                        roles: {
                            create: userData.roleIds.map(roleId => ({
                                roleId: parseInt(roleId)
                            }))
                        }
                    },
                    include: {
                        roles: {
                            include: {
                                role: true
                            }
                        },
                        department: true
                    }
                });
            } else {
                // Create user without roles
                newUser = await prisma.user.create({
                    data: userCreateData,
                    include: {
                        roles: {
                            include: {
                                role: true
                            }
                        },
                        department: true
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
            return await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    roles: {
                        include: {
                            role: true
                        }
                    },
                    department: true,
                    permissions: {
                        include: {
                            permission: true
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

            return await prisma.user.update({
                where: { id: userId },
                data: userData,
                include: {
                    roles: {
                        include: {
                            role: true
                        }
                    },
                    department: true
                }
            });
        } catch (error) {
            console.error(' UserDB.updateUser: Database error:', error);
            throw error;
        }
    }

    static async deleteUser(userId) {
        try {
            return await prisma.user.delete({
                where: { id: userId }
            });
        } catch (error) {
            console.error(' UserDB.deleteUser: Database error:', error);
            throw error;
        }
    }

    static async assignRolesToUser(userId, roleIds) {
        try {
            await prisma.userRole.deleteMany({
                where: { userId }
            });

            if (roleIds && roleIds.length > 0) {
                await prisma.userRole.createMany({
                    data: roleIds.map(roleId => ({
                        userId,
                        roleId: parseInt(roleId)
                    }))
                });
            }

            return await this.getUserById(userId);
        } catch (error) {
            console.error(' UserDB.assignRolesToUser: Database error:', error);
            throw error;
        }
    }
}

export default UserDB; 