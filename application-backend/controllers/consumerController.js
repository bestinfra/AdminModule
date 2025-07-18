import ConsumerDB from '../models/ConsumerDB.js';

export const getAllConsumers = async (req, res) => {
    try {
        const consumers = await ConsumerDB.getAllConsumers();
        res.json({
            success: true,
            data: consumers,
            message: 'Consumers retrieved successfully'
        });
    } catch (error) {
        console.error('getAllConsumers: Error fetching consumers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch consumers',
            error: error.message
        });
    }
};

export const getConsumerByNumber = async (req, res) => {
    try {
        const { consumerNumber } = req.params;
        const consumer = await ConsumerDB.getConsumerByNumber(consumerNumber);
        if (!consumer) {
            return res.status(404).json({ success: false, message: 'Consumer not found' });
        }
        
        const meter = consumer.meters && consumer.meters.length > 0 ? consumer.meters[0] : null;
        let dailyConsumption = [];
        let monthlyConsumption = [];
        if (meter) {
            dailyConsumption = await ConsumerDB.getDailyConsumption(meter.id);
            monthlyConsumption = await ConsumerDB.getMonthlyConsumption(meter.id);
        }
       
        res.json({
            success: true,
            consumer,
            meter,
            dailyConsumption,
            monthlyConsumption,
           
        });
    } catch (error) {
        console.error('getConsumerByNumber: Error fetching consumer details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch consumer details',
            error: error.message
        });
    }
};

export const getPowerWidgets = async (req, res) => {
    try {
        const { uid } = req.query; // meter serial number
        if (!uid) {
            return res.status(400).json({ success: false, message: 'Meter serial number is required' });
        }

        const powerData = await ConsumerDB.getPowerWidgets(uid);
        
        res.json({
            success: true,
            data: {
                last_comm_date: powerData.lastCommDate,
                power: powerData.power
            }
        });
    } catch (error) {
        console.error(' getPowerWidgets: Error fetching power data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch power data',
            error: error.message
        });
    }
};

export const getConsumerHistory = async (req, res) => {
    try {
        const { consumerNumber } = req.params;
        
        if (!consumerNumber) {
            return res.status(400).json({ success: false, message: 'Consumer number is required' });
        }

        const consumerHistory = await ConsumerDB.getConsumerHistory(consumerNumber);
        
        res.json({
            success: true,
            data: consumerHistory
        });
    } catch (error) {
        console.error(' getConsumerHistory: Error fetching consumer history:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch consumer history',
            error: error.message
        });
    }
}; 