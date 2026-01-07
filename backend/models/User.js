import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersFilePath = path.join(__dirname, '../data/users.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize users file if it doesn't exist
if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([]), 'utf8');
}

class User {
    constructor(id, username, email, password, role = 'user') {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    // Get all users
    static getAllUsers() {
        try {
            const data = fs.readFileSync(usersFilePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading users file:', error);
            return [];
        }
    }

    // Save users to file
    static saveUsers(users) {
        try {
            fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
            return true;
        } catch (error) {
            console.error('Error saving users file:', error);
            return false;
        }
    }

    // Find user by email
    static findByEmail(email) {
        const users = this.getAllUsers();
        return users.find(user => user.email === email);
    }

    // Find user by username
    static findByUsername(username) {
        const users = this.getAllUsers();
        return users.find(user => user.username === username);
    }

    // Find user by ID
    static findById(id) {
        const users = this.getAllUsers();
        return users.find(user => user.id === id);
    }

    // Create new user
    static async create(userData) {
        try {
            const users = this.getAllUsers();
            
            // Check if user already exists
            const existingUser = users.find(user => 
                user.email === userData.email || user.username === userData.username
            );
            
            if (existingUser) {
                throw new Error('User already exists with this email or username');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            // Generate ID
            const id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

            const newUser = new User(
                id,
                userData.username,
                userData.email,
                hashedPassword,
                userData.role || 'user'
            );

            users.push(newUser);
            
            if (this.saveUsers(users)) {
                // Return user without password
                const { password, ...userWithoutPassword } = newUser;
                return userWithoutPassword;
            } else {
                throw new Error('Failed to save user');
            }
        } catch (error) {
            throw error;
        }
    }

    // Validate password
    static async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Update user
    static async updateUser(id, updateData) {
        try {
            const users = this.getAllUsers();
            const userIndex = users.findIndex(user => user.id === id);
            
            if (userIndex === -1) {
                throw new Error('User not found');
            }

            // If password is being updated, hash it
            if (updateData.password) {
                updateData.password = await bcrypt.hash(updateData.password, 10);
            }

            users[userIndex] = {
                ...users[userIndex],
                ...updateData,
                updatedAt: new Date().toISOString()
            };

            if (this.saveUsers(users)) {
                const { password, ...userWithoutPassword } = users[userIndex];
                return userWithoutPassword;
            } else {
                throw new Error('Failed to update user');
            }
        } catch (error) {
            throw error;
        }
    }

    // Delete user
    static deleteUser(id) {
        try {
            const users = this.getAllUsers();
            const filteredUsers = users.filter(user => user.id !== id);
            
            if (users.length === filteredUsers.length) {
                throw new Error('User not found');
            }

            return this.saveUsers(filteredUsers);
        } catch (error) {
            throw error;
        }
    }
}

export default User; 