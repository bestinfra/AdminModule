import DTRDB from '../models/DTRDB.js';

export const getDTRTable = async (req, res) => {
    try {
        const { page, pageSize, search, status, locationId } = req.query;
        const result = await DTRDB.getDTRTable({
            page: page ? parseInt(page) : 1,
            pageSize: pageSize ? parseInt(pageSize) : 20,
            search: search || '',
            status: status || undefined,
            locationId: locationId ? parseInt(locationId) : undefined
        });
        res.json({
            success: true,
            ...result,
            message: 'DTR table fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching DTR table:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch DTR table',
            error: error.message
        });
    }
};

export const getFeedersForDTR = async (req, res) => {
    try {
        const { dtrId } = req.params;
        const feeders = await DTRDB.getFeedersForDTR(dtrId);
        res.json({
            success: true,
            data: feeders,
            message: 'Feeders fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching feeders for DTR:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feeders for DTR',
            error: error.message
        });
    }
};

export const getDTRAlerts = async (req, res) => {
    try {
        const alerts = await DTRDB.getDTRAlerts();
        res.json({
            success: true,
            data: alerts,
            message: 'DTR alerts fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching DTR alerts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch DTR alerts',
            error: error.message
        });
    }
};

export const getDTRAlertsTrends = async (req, res) => {
    try {
        const trends = await DTRDB.getDTRAlertsTrends();
        res.json({
            success: true,
            data: trends,
            message: 'DTR alerts trends fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching DTR alerts trends:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch DTR alerts trends',
            error: error.message
        });
    }
};

export const getDTRStats = async (req, res) => {
    try {
        const stats = await DTRDB.getDTRStats();
        res.json({
            success: true,
            data: stats,
            message: 'DTR stats fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching DTR stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch DTR stats',
            error: error.message
        });
    }
};

export const getConsumptionStats = async (req, res) => {
    try {
        const stats = await DTRDB.getConsumptionStats();
        res.json({
            success: true,
            data: stats,
            message: 'Consumption stats fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching consumption stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch consumption stats',
            error: error.message
        });
    }
};

export const getFeederStats = async (req, res) => {
    try {
        const { dtrId } = req.params;
        const stats = await DTRDB.getFeederStats(dtrId);
        res.json({
            success: true,
            data: stats,
            message: 'Feeder stats fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching feeder stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feeder stats',
            error: error.message
        });
    }
};

export const getInstantaneousStats = async (req, res) => {
    try {
        const { meterId } = req.params;
        const stats = await DTRDB.getInstantaneousStats(meterId);
        res.json({
            success: true,
            data: stats,
            message: 'Instantaneous stats fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching instantaneous stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch instantaneous stats',
            error: error.message
        });
    }
}; 