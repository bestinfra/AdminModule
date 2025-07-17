import ConsumerDB from '../models/ConsumerDB.js';

export const getAllConsumers = async (req, res) => {
    try {
        console.log('🔍 getAllConsumers: Starting to fetch consumers from database...');
        const consumers = await ConsumerDB.getAllConsumers();
        console.log('📊 getAllConsumers: Raw consumers data from DB:', consumers);
        console.log('📊 getAllConsumers: Number of consumers found:', consumers.length);
        
        res.json({
            success: true,
            data: consumers,
            message: 'Consumers retrieved successfully'
        });
        console.log('✅ getAllConsumers: Response sent to frontend');
    } catch (error) {
        console.error('❌ getAllConsumers: Error fetching consumers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch consumers',
            error: error.message
        });
    }
}; 