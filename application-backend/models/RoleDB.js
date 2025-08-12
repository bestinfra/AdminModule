import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class RoleDB {
    static async getAllRoles() {
        try {
            const roles = await prisma.roles.findMany({
                include: {
                    users: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            isActive: true
                        }
                    },
                    role_permissions: {
                        include: {
                            permissions: true
                        }
                    }
                },
                orderBy: { id: 'asc' }
            });
            return roles;
        } catch (error) {
            console.error('Error getting all roles:', error);
            throw error;
        }
    }

    static async addRole(roleData) {
        try {
            if (!roleData.name) {
                throw new Error('Role name is required');
            }

            const existingRole = await prisma.roles.findUnique({
                where: { name: roleData.name }
            });
            if (existingRole) {
                throw new Error('Role name already exists');
            }

            let newRole;
            if (roleData.permissionIds && roleData.permissionIds.length > 0) {
                newRole = await prisma.roles.create({
                    data: {
                        name: roleData.name,
                        role_permissions: {
                            create: roleData.permissionIds.map(permissionId => ({
                                permissionId: parseInt(permissionId)
                            }))
                        }
                    },
                    include: {
                        users: {
                            select: {
                                id: true,
                                username: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                isActive: true
                            }
                        },
                        role_permissions: {
                            include: {
                                permissions: true
                            }
                        }
                    }
                });
            } else {
                newRole = await prisma.roles.create({
                    data: {
                        name: roleData.name
                    },
                    include: {
                        users: {
                            select: {
                                id: true,
                                username: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                isActive: true
                            }
                        },
                        role_permissions: {
                            include: {
                                permissions: true
                            }
                        }
                    }
                });
            }
            
            return newRole;
        } catch (error) {
            console.error(' RoleDB.addRole: Database error:', error);
            throw error;
        }
    }

    static async getRoleById(roleId) {
        try {
            return await prisma.roles.findUnique({
                where: { id: roleId },
                include: {
                    users: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            isActive: true
                        }
                    },
                    role_permissions: {
                        include: {
                            permissions: true
                        }
                    }
                }
            });
        } catch (error) {
            console.error(' RoleDB.getRoleById: Database error:', error);
            throw error;
        }
    }

    static async updateRole(roleId, roleData) {
        try {
            if (roleData.name) {
                const existingRole = await prisma.roles.findFirst({
                    where: {
                        name: roleData.name,
                        id: { not: roleId }
                    }
                });
                if (existingRole) {
                    throw new Error('Role name already exists');
                }
            }

            return await prisma.roles.update({
                where: { id: roleId },
                data: roleData,
                include: {
                    users: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            isActive: true
                        }
                    },
                    role_permissions: {
                        include: {
                            permissions: true
                        }
                    }
                }
            });
        } catch (error) {
            console.error(' RoleDB.updateRole: Database error:', error);
            throw error;
        }
    }

    static async deleteRole(roleId) {
        try {
            const usersWithRole = await prisma.users.findMany({
                where: { roleId }
            });

            if (usersWithRole.length > 0) {
                throw new Error('Cannot delete role that is assigned to users');
            }

            return await prisma.roles.delete({
                where: { id: roleId }
            });
        } catch (error) {
            console.error(' RoleDB.deleteRole: Database error:', error);
            throw error;
        }
    }

    static async assignPermissionsToRole(roleId, permissionIds) {
        try {
            await prisma.role_permissions.deleteMany({
                where: { roleId }
            });

            if (permissionIds && permissionIds.length > 0) {
                await prisma.role_permissions.createMany({
                    data: permissionIds.map(permissionId => ({
                        roleId,
                        permissionId: parseInt(permissionId)
                    }))
                });
            }

            return await this.getRoleById(roleId);
        } catch (error) {
            console.error(' RoleDB.assignPermissionsToRole: Database error:', error);
            throw error;
        }
    }

    static async getRoleStats() {
        try {
            
            const roles = await prisma.roles.findMany({
                include: {
                    users: true,
                    role_permissions: true
                }
            });

            const totalRoles = roles.length;
            const totalPermissions = await prisma.permissions.count();

            const roleUserCounts = {};
            roles.forEach(role => {
                roleUserCounts[role.name] = role.users.length;
            });

            const stats = {
                totalRoles,
                totalPermissions,
                roleUserCounts,
                roles: roles.map(role => ({
                    id: role.id,
                    name: role.name,
                    userCount: role.users.length,
                    permissionCount: role.role_permissions.length
                }))
            };
            
            return stats;
        } catch (error) {
            console.error(' RoleDB.getRoleStats: Database error:', error);
            throw error;
        }
    }
}

export default RoleDB; 