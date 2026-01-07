import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

class UserDB {
    // Get all users
    static async getAllUsers() {
        try {
            const users = await prisma.adminUsers.findMany({
                select: {
                    id: true,
                    username: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
            return users;
        } catch (error) {
            console.error('Error getting all users:', error);
            throw error;
        }
    }

    // Find user by email
    static async findByEmail(email) {
        try {
            const user = await prisma.adminUsers.findUnique({
                where: { email }
            });
            return user;
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    // Find user by username
    static async findByUsername(username) {
        try {
            const user = await prisma.adminUsers.findUnique({
                where: { username }
            });
            return user;
        } catch (error) {
            console.error('Error finding user by username:', error);
            throw error;
        }
    }

    // Find user by ID
    static async findById(id) {
        try {
            const user = await prisma.adminUsers.findUnique({
                where: { id: parseInt(id) }
            });
            return user;
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    }

    // Create new user
    static async create(userData) {
        try {
            // Check if user already exists
            const existingUserByEmail = await this.findByEmail(userData.email);
            const existingUserByUsername = await this.findByUsername(userData.username);
            
            if (existingUserByEmail) {
                throw new Error('User already exists with this email');
            }
            
            if (existingUserByUsername) {
                throw new Error('User already exists with this username');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const newUser = await prisma.adminUsers.create({
                data: {
                    username: userData.username,
                    email: userData.email,
                    password: hashedPassword,
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    role: userData.role || 'VIEWER'
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            return newUser;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    // Validate password
    static async validatePassword(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            console.error('Error validating password:', error);
            throw error;
        }
    }

    // Update user
    static async updateUser(id, updateData) {
        try {
            // If password is being updated, hash it
            if (updateData.password) {
                updateData.password = await bcrypt.hash(updateData.password, 10);
            }

            const updatedUser = await prisma.adminUsers.update({
                where: { id: parseInt(id) },
                data: {
                    ...updateData,
                    updatedAt: new Date()
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            return updatedUser;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    // Delete user
    static async deleteUser(id) {
        try {
            await prisma.adminUsers.delete({
                where: { id: parseInt(id) }
            });
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    // Check database connection
    static async checkConnection() {
        try {
            await prisma.$connect();
            console.log('Database connected successfully');
            return true;
        } catch (error) {
            console.error('Database connection failed:', error);
            return false;
        }
    }

    // Disconnect from database
    static async disconnect() {
        try {
            await prisma.$disconnect();
        } catch (error) {
            console.error('Error disconnecting from database:', error);
        }
    }
}

export default UserDB; 