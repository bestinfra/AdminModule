import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Check if superadmin exists
  const existingSuperAdmin = await prisma.adminUsers.findFirst({
    where: {
      OR: [
        { email: 'mainhost.bestinfra@gmail.com' },
        { username: 'superadmin' }
      ]
    }
  });
  if (existingSuperAdmin) {
    console.log('Super Admin user already exists, skipping seed');
    return;
  }

  // Create Organizations
  const organizations = await Promise.all([
    prisma.organizations.create({
      data: {
        name: 'TechCorp Solutions',
        type: 'COMPANY',
        description: 'Leading technology solutions provider',
        website: 'https://techcorp.com',
        email: 'admin@techcorp.com',
        phone: '+1-555-0123',
        address: '123 Tech Street',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '94105',
        settings: { timezone: 'America/Los_Angeles', currency: 'USD', language: 'en' }
      }
    }),
    prisma.organizations.create({
      data: {
        name: 'Government Utilities',
        type: 'GOVERNMENT',
        description: 'Municipal utility management',
        website: 'https://gov-utilities.gov',
        email: 'contact@gov-utilities.gov',
        phone: '+1-555-0456',
        address: '456 Government Ave',
        city: 'Washington',
        state: 'DC',
        country: 'USA',
        postalCode: '20001',
        settings: { timezone: 'America/New_York', currency: 'USD', language: 'en' }
      }
    })
  ]);

  // Create Roles
  const roles = await Promise.all([
    prisma.roles.create({ data: { name: 'Super Admin', description: 'Full system access', isSystem: true, isActive: true } }),
    prisma.roles.create({ data: { name: 'Admin', description: 'Administrative access', isSystem: true, isActive: true } }),
    prisma.roles.create({ data: { name: 'Manager', description: 'Management access', isSystem: true, isActive: true } }),
    prisma.roles.create({ data: { name: 'Operator', description: 'Operational access', isSystem: true, isActive: true } }),
    prisma.roles.create({ data: { name: 'Viewer', description: 'Read-only access', isSystem: true, isActive: true } })
  ]);

  // Create Permissions
  const permissions = await Promise.all([
    prisma.permissions.create({ data: { name: 'users.create', description: 'Create new users', resource: 'users', action: 'create' } }),
    prisma.permissions.create({ data: { name: 'users.read', description: 'View users', resource: 'users', action: 'read' } }),
    prisma.permissions.create({ data: { name: 'users.update', description: 'Update users', resource: 'users', action: 'update' } }),
    prisma.permissions.create({ data: { name: 'users.delete', description: 'Delete users', resource: 'users', action: 'delete' } }),
    prisma.permissions.create({ data: { name: 'apps.create', description: 'Create new apps', resource: 'apps', action: 'create' } }),
    prisma.permissions.create({ data: { name: 'apps.read', description: 'View apps', resource: 'apps', action: 'read' } }),
    prisma.permissions.create({ data: { name: 'apps.update', description: 'Update apps', resource: 'apps', action: 'update' } }),
    prisma.permissions.create({ data: { name: 'apps.delete', description: 'Delete apps', resource: 'apps', action: 'delete' } }),
    prisma.permissions.create({ data: { name: 'organizations.manage', description: 'Manage organizations', resource: 'organizations', action: 'manage' } }),
    prisma.permissions.create({ data: { name: 'system.settings', description: 'Manage system settings', resource: 'system', action: 'settings' } }),
    prisma.permissions.create({ data: { name: 'tickets.manage', description: 'Manage support tickets', resource: 'tickets', action: 'manage' } })
  ]);

  // Assign all permissions to Super Admin role
  const superAdminRole = roles.find(r => r.name === 'Super Admin');
  await Promise.all(
    permissions.map(permission =>
      prisma.rolePermissions.create({
        data: { roleId: superAdminRole.id, permissionId: permission.id }
      })
    )
  );

  // Create Super Admin user
  const hashedPassword = await bcrypt.hash('superadmin123', 10);
  const superAdmin = await prisma.adminUsers.create({
    data: {
      username: 'superadmin',
      email: 'mainhost.bestinfra@gmail.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      phone: '+1-555-0001',
      role: 'SUPER_ADMIN',
      permissions: ['*'],
      organizationId: organizations[0].id,
      isActive: true
    }
  });

  // Assign Super Admin role to user
  await prisma.userRoles.create({ data: { userId: superAdmin.id, roleId: superAdminRole.id } });

  console.log('Super Admin user created successfully');
  console.log('Username: superadmin');
  console.log('Email: mainhost.bestinfra@gmail.com');
  console.log('Password: superadmin123');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 