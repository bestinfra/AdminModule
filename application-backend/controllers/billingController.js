import BillingDB from '../models/BillingDB.js';

export const getPostpaidBillingStats = async (req, res) => {
    try {
        const stats = await BillingDB.getPostpaidBillingStats();
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('getPostpaidBillingStats: Error fetching billing stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch billing statistics',
            error: error.message
        });
    }
};

export const getPostpaidBillingTable = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const filters = {
            status: req.query.status,
            consumerNumber: req.query.consumerNumber,
            billNumber: req.query.billNumber
        };

        const billingData = await BillingDB.getPostpaidBillingTable(page, limit, filters);
        
        res.json({
            success: true,
            data: billingData
        });
    } catch (error) {
        console.error('❌ getPostpaidBillingTable: Error fetching billing table:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch billing table',
            error: error.message
        });
    }
}; 