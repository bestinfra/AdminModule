const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Create default roles
    const roles = await Promise.all([
      prisma.role.create({
        data: {
          name: 'SUPER_ADMIN',
          description: 'Super Administrator',
          level: 1,
          isSystem: true,
          accessLevel: 'SUPER_ADMIN'
        }
      }),
      prisma.role.create({
        data: {
          name: 'ADMIN',
          description: 'Administrator',
          level: 2,
          isSystem: true,
          accessLevel: 'ADMIN'
        }
      }),
      prisma.role.create({
        data: {
          name: 'MANAGER',
          description: 'Manager',
          level: 3,
          isSystem: true,
          accessLevel: 'ELEVATED'
        }
      }),
      prisma.role.create({
        data: {
          name: 'USER',
          description: 'Regular User',
          level: 4,
          isSystem: true,
          accessLevel: 'NORMAL'
        }
      })
    ]);

    // Create default admin user
    const adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@example.com',
        password: '$2b$10$xxxxxxxxxxx', // Replace with properly hashed password
        firstName: 'System',
        lastName: 'Administrator',
        isActive: true,
        roles: {
          create: {
            roleId: roles[0].id, // SUPER_ADMIN role
            isPrimary: true,
            assignedBy: 1
          }
        }
      }
    });

    // Create default department
    const mainDepartment = await prisma.department.create({
      data: {
        name: 'Main Department',
        code: 'MAIN',
        description: 'Main Organization Department',
        isActive: true
      }
    });

    console.log('Database initialized successfully');
    console.log('Created roles:', roles);
    console.log('Created admin user:', adminUser);
    console.log('Created department:', mainDepartment);

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 