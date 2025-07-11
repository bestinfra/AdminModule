import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updateRoles() {
    try {
        // Update superadmin role
        await prisma.user.updateMany({
            where: {
                role: 'superadmin'
            },
            data: {
                role: 'SUPER_ADMIN'
            }
        });

        // Update admin role
        await prisma.user.updateMany({
            where: {
                role: 'admin'
            },
            data: {
                role: 'ADMIN'
            }
        });

        // Update user role
        await prisma.user.updateMany({
            where: {
                role: 'user'
            },
            data: {
                role: 'USER'
            }
        });
    } catch (error) {
        console.error('Error updating roles:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the update
updateRoles(); 