import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class RoleDB {
    static async getAllRoles() {
        try {
            const roles = await prisma.role.findMany({
               
            });
            return roles;
        } catch (error) {
            console.error('Error getting all roles:', error);
            throw error;
        }
    }
}

export default RoleDB; 