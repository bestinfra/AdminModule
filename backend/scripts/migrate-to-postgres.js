import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function migrateUsersFromJson() {
    try {
        // Path to the JSON file
        const jsonFilePath = path.join(__dirname, '../data/users.json');

        // Check if JSON file exists
        if (!fs.existsSync(jsonFilePath)) {
            return;
        }

        // Read JSON file
        const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
        const users = JSON.parse(jsonData);

        if (!Array.isArray(users) || users.length === 0) {
            return;
        }

        for (const user of users) {
            try {
                // Check if user already exists in PostgreSQL
                const existingUser = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: user.email },
                            { username: user.username }
                        ]
                    }
                });

                if (existingUser) {
                    continue;
                }

                // Create user in PostgreSQL
                await prisma.user.create({
                    data: {
                        username: user.username,
                        email: user.email,
                        password: user.password, // Already hashed from JSON
                        role: user.role || 'user',
                        createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
                        updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date()
                    }
                });

            } catch (userError) {
                // Skip failed migrations
            }
        }

    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
}

// Run the migration
migrateUsersFromJson()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 