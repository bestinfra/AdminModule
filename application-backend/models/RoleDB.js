import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class RoleDB {
    static async getAllRoles() {
        try {
            const roles = await prisma.role.findMany({
                include: {
                    users: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    isActive: true
                                }
                            }
                        }
                    },
                    permissions: {
                        include: {
                            permission: true
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

            const existingRole = await prisma.role.findUnique({
                where: { name: roleData.name }
            });
            if (existingRole) {
                throw new Error('Role name already exists');
            }

            let newRole;
            if (roleData.permissionIds && roleData.permissionIds.length > 0) {
                newRole = await prisma.role.create({
                    data: {
                        name: roleData.name,
                        permissions: {
                            create: roleData.permissionIds.map(permissionId => ({
                                permissionId: parseInt(permissionId)
                            }))
                        }
                    },
                    include: {
                        users: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        username: true,
                                        firstName: true,
                                        lastName: true,
                                        email: true,
                                        isActive: true
                                    }
                                }
                            }
                        },
                        permissions: {
                            include: {
                                permission: true
                            }
                        }
                    }
                });
            } else {
                newRole = await prisma.role.create({
                    data: {
                        name: roleData.name
                    },
                    include: {
                        users: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        username: true,
                                        firstName: true,
                                        lastName: true,
                                        email: true,
                                        isActive: true
                                    }
                                }
                            }
                        },
                        permissions: {
                            include: {
                                permission: true
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
            return await prisma.role.findUnique({
                where: { id: roleId },
                include: {
                    users: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    isActive: true
                                }
                            }
                        }
                    },
                    permissions: {
                        include: {
                            permission: true
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
                const existingRole = await prisma.role.findFirst({
                    where: {
                        name: roleData.name,
                        id: { not: roleId }
                    }
                });
                if (existingRole) {
                    throw new Error('Role name already exists');
                }
            }

            return await prisma.role.update({
                where: { id: roleId },
                data: roleData,
                include: {
                    users: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    isActive: true
                                }
                            }
                        }
                    },
                    permissions: {
                        include: {
                            permission: true
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
            const usersWithRole = await prisma.userRole.findMany({
                where: { roleId }
            });

            if (usersWithRole.length > 0) {
                throw new Error('Cannot delete role that is assigned to users');
            }

            return await prisma.role.delete({
                where: { id: roleId }
            });
        } catch (error) {
            console.error(' RoleDB.deleteRole: Database error:', error);
            throw error;
        }
    }

    static async assignPermissionsToRole(roleId, permissionIds) {
        try {
            await prisma.rolePermission.deleteMany({
                where: { roleId }
            });

            if (permissionIds && permissionIds.length > 0) {
                await prisma.rolePermission.createMany({
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
            
            const roles = await prisma.role.findMany({
                include: {
                    users: true,
                    permissions: true
                }
            });

            const totalRoles = roles.length;
            const totalPermissions = await prisma.permission.count();

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
                    permissionCount: role.permissions.length
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