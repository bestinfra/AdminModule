import { adminDb, meterDb, checkDatabaseHealth } from '../config/database.js';

async function testConnections() {
    try {
        console.log('Testing database connections...');
        
        // Check database health
        const isHealthy = await checkDatabaseHealth();
        
        if (isHealthy) {
            console.log('✅ Both databases are connected and healthy!');
            
            // Test queries
            console.log('\nTesting basic queries:');
            
            // Test admin database
            const adminUsers = await adminDb.user.count();
            console.log(`Admin DB - Total users: ${adminUsers}`);
            
            // Test meter database
            const meterCount = await meterDb.meter.count();
            console.log(`Meter DB - Total meters: ${meterCount}`);
            
        } else {
            console.log('❌ Database health check failed');
        }
    } catch (error) {
        console.error('Error testing connections:', error);
    } finally {
        // Disconnect from both databases
        await adminDb.$disconnect();
        await meterDb.$disconnect();
    }
}

testConnections(); 