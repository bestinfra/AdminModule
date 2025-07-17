import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class UserDB {
    static async getAllUsers() {
        try {
            const users = await prisma.user.findMany({
                orderBy: { createdAt: 'desc' }
            });
            return users;
        } catch (error) {
            console.error('Error getting all users:', error);
            throw error;
        }
    }
}

export default UserDB; 