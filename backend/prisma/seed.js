import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    try {
        // Check if super admin user already exists
        const existingSuperAdmin = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: 'superadmin@superadmin.com' },
                    { username: 'superadmin' }
                ]
            }
        });

        if (existingSuperAdmin) {
            console.log('Super Admin user already exists, skipping seed');
            return;
        }

        // Hash the default password
        const hashedPassword = await bcrypt.hash('superadmin123', 10);

        // Create default super admin user
        await prisma.user.create({
            data: {
                username: 'superadmin',
                email: 'superadmin@superadmin.com',
                password: hashedPassword,
                role: 'SUPER_ADMIN'
            }
        });

        console.log('✅ Super admin user created successfully');
        console.log('👤 Username: superadmin');
        console.log('📧 Email: superadmin@superadmin.com');
        console.log('🔑 Password: superadmin123');

    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 