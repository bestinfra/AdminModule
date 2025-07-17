import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class ConsumerDB {
    static async getAllConsumers() {
        try {
            console.log('🗄️ ConsumerDB.getAllConsumers: Executing Prisma query...');
            const consumers = await prisma.consumer.findMany({
                include: {
                    location: true,
                    meters: true
                },
                orderBy: { createdAt: 'desc' }
            });
            console.log('🗄️ ConsumerDB.getAllConsumers: Query completed successfully');
            console.log('🗄️ ConsumerDB.getAllConsumers: Consumers found:', consumers.length);
            return consumers;
        } catch (error) {
            console.error('❌ ConsumerDB.getAllConsumers: Database error:', error);
            throw error;
        }
    }
}

export default ConsumerDB; 