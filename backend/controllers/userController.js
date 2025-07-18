import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// =====================================
// AUTHENTICATION
// =====================================

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find user
    const user = await prisma.adminUsers.findUnique({
      where: { username },
      include: {
        organization: true,
        userRoles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check if user is locked
    if (user.isLocked && user.lockoutUntil && user.lockoutUntil > new Date()) {
      return res.status(401).json({
        success: false,
        message: 'Account is temporarily locked'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      // Increment failed login attempts
      await prisma.adminUsers.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: user.failedLoginAttempts + 1,
          lockoutUntil: user.failedLoginAttempts >= 4 ? new Date(Date.now() + 15 * 60 * 1000) : null // 15 minutes lockout
        }
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset failed login attempts on successful login
    await prisma.adminUsers.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockoutUntil: null,
        lastLoginAt: new Date()
      }
    });

    // Create session
    const sessionId = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    
    await prisma.adminUserSessions.create({
      data: {
        userId: user.id,
        sessionId,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    });

    // Log successful login
    await prisma.adminLoginHistory.create({
      data: {
        userId: user.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        success: true
      }
    });

    // Prepare user data (exclude password)
    const { password: _, ...userData } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        sessionId,
        token: jwt.sign({ userId: user.id, sessionId }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' })
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (sessionId) {
      await prisma.adminUserSessions.updateMany({
        where: { sessionId },
        data: { isActive: false }
      });
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// =====================================
// USER MANAGEMENT
// =====================================

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, organizationId, status } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role) {
      where.role = role;
    }

    if (organizationId) {
      where.organizationId = parseInt(organizationId);
    }

    if (status !== undefined) {
      where.isActive = status === 'true';
    }

    const [users, total] = await Promise.all([
      prisma.adminUsers.findMany({
        where,
        include: {
          organization: true,
          userRoles: {
            include: {
              role: true
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.adminUsers.count({ where })
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.adminUsers.findUnique({
      where: { id: parseInt(id) },
      include: {
        organization: true,
        userRoles: {
          include: {
            role: true
          }
        },
        createdApps: {
          include: {
            appBranding: true
          }
        },
        managedApps: {
          include: {
            appBranding: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { password, ...userData } = user;

    res.json({
      success: true,
      data: userData
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
      organizationId,
      permissions
    } = req.body;

    // Validate required fields
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, password, first name, and last name are required'
      });
    }

    // Check if username or email already exists
    const existingUser = await prisma.adminUsers.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.username === username 
          ? 'Username already exists'
          : 'Email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.adminUsers.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: role || 'VIEWER',
        permissions: permissions || [],
        organizationId: organizationId ? parseInt(organizationId) : null
      },
      include: {
        organization: true
      }
    });

    // Log activity
    await prisma.adminActivityLogs.create({
      data: {
        userId: req.user.id,
        action: 'CREATE',
        resource: 'users',
        resourceId: user.id,
        details: { createdUser: username },
        ipAddress: req.ip
      }
    });

    const { password: _, ...userData } = user;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userData
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username,
      email,
      firstName,
      lastName,
      phone,
      role,
      organizationId,
      permissions,
      isActive
    } = req.body;

    // Check if user exists
    const existingUser = await prisma.adminUsers.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if username or email already exists (excluding current user)
    if (username || email) {
      const duplicateUser = await prisma.adminUsers.findFirst({
        where: {
          OR: [
            { username: username || existingUser.username },
            { email: email || existingUser.email }
          ],
          NOT: { id: parseInt(id) }
        }
      });

      if (duplicateUser) {
        return res.status(400).json({
          success: false,
          message: duplicateUser.username === (username || existingUser.username)
            ? 'Username already exists'
            : 'Email already exists'
        });
      }
    }

    // Update user
    const updatedUser = await prisma.adminUsers.update({
      where: { id: parseInt(id) },
      data: {
        username: username || existingUser.username,
        email: email || existingUser.email,
        firstName: firstName || existingUser.firstName,
        lastName: lastName || existingUser.lastName,
        phone: phone !== undefined ? phone : existingUser.phone,
        role: role || existingUser.role,
        permissions: permissions || existingUser.permissions,
        organizationId: organizationId ? parseInt(organizationId) : existingUser.organizationId,
        isActive: isActive !== undefined ? isActive : existingUser.isActive
      },
      include: {
        organization: true
      }
    });

    // Log activity
    await prisma.adminActivityLogs.create({
      data: {
        userId: req.user.id,
        action: 'UPDATE',
        resource: 'users',
        resourceId: updatedUser.id,
        details: { updatedUser: updatedUser.username },
        ipAddress: req.ip
      }
    });

    const { password, ...userData } = updatedUser;

    res.json({
      success: true,
      message: 'User updated successfully',
      data: userData
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await prisma.adminUsers.findUnique({
      where: { id: parseInt(id) }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting super admin
    if (user.role === 'SUPER_ADMIN') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete super admin user'
      });
    }

    // Soft delete user
    await prisma.adminUsers.update({
      where: { id: parseInt(id) },
      data: {
        deletedAt: new Date(),
        isActive: false
      }
    });

    // Log activity
    await prisma.adminActivityLogs.create({
      data: {
        userId: req.user.id,
        action: 'DELETE',
        resource: 'users',
        resourceId: user.id,
        details: { deletedUser: user.username },
        ipAddress: req.ip
      }
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// =====================================
// ROLES & PERMISSIONS
// =====================================

export const getAllRoles = async (req, res) => {
  try {
    const roles = await prisma.roles.findMany({
      include: {
        permissions: {
          include: {
            permission: true
          }
        },
        users: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: roles
    });

  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await prisma.permissions.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: permissions
    });

  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const assignRoleToUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    if (!userId || !roleId) {
      return res.status(400).json({
        success: false,
        message: 'User ID and Role ID are required'
      });
    }

    // Check if assignment already exists
    const existingAssignment = await prisma.userRoles.findUnique({
      where: {
        userId_roleId: {
          userId: parseInt(userId),
          roleId: parseInt(roleId)
        }
      }
    });

    if (existingAssignment) {
      return res.status(400).json({
        success: false,
        message: 'Role is already assigned to this user'
      });
    }

    // Create assignment
    await prisma.userRoles.create({
      data: {
        userId: parseInt(userId),
        roleId: parseInt(roleId)
      }
    });

    res.json({
      success: true,
      message: 'Role assigned successfully'
    });

  } catch (error) {
    console.error('Assign role error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const removeRoleFromUser = async (req, res) => {
  try {
    const { userId, roleId } = req.params;

    await prisma.userRoles.delete({
      where: {
        userId_roleId: {
          userId: parseInt(userId),
          roleId: parseInt(roleId)
        }
      }
    });

    res.json({
      success: true,
      message: 'Role removed successfully'
    });

  } catch (error) {
    console.error('Remove role error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 