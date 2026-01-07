import User from '../models/User.js';

// Create default admin user
export const createDefaultAdmin = async () => {
    try {
        const adminEmail = 'admin@adminmodule.com';
        const existingAdmin = User.findByEmail(adminEmail);
        
        if (!existingAdmin) {
            await User.create({
                username: 'admin',
                email: adminEmail,
                password: 'admin123',
                role: 'admin'
            });
            console.log('✅ Default admin user created successfully');
            console.log('👤 Username: admin');
            console.log('📧 Email: admin@adminmodule.com');
            console.log('🔑 Password: admin123');
            console.log('💡 You can login with either username or email');
            console.log('⚠️  Please change the default password after first login');
        } else {
            console.log('ℹ️  Admin user already exists');
        }
    } catch (error) {
        console.error('❌ Error creating default admin user:', error.message);
    }
};

// Run immediately if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    createDefaultAdmin();
} 