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

        // Map the data to match frontend table columns exactly
        const mappedData = result.data.map(dtr => ({
            dtrId: dtr.dtrNumber || 'NA',
            dtrName: dtr.serialNumber || 'NA',
            feedersCount: dtr.feedersCount || 0,
            streetName: dtr.location?.name || 'NA',
            city: dtr.location?.city || 'NA',
            commStatus: dtr.status || 'NA'
        }));

        res.json({
            success: true,
            data: mappedData,
            total: result.total,
            page: result.page,
            pageSize: result.pageSize,
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
        
        // Map alerts to match frontend table columns exactly
        const mappedAlerts = alerts.map(alert => ({
            alert: alert.faultType || 'NA',
            date: alert.createdAt ? new Date(alert.createdAt).toLocaleString() : 'NA',
            status: alert.status || 'NA'
        }));

        res.json({
            success: true,
            data: mappedAlerts,
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
        
        // Map stats to match frontend card field names exactly
        const mappedStats = {
            totalDtrs: stats.totalDTRs || 0,
            totalLtFeeders: stats.totalLTFeeders || 0,
            totalFuseBlown: stats.totalFuseBlown || 0,
            fuseBlownPercentage: stats.percentTotalFuseBlown || 0,
            overloadedFeeders: stats.overloadedDTRs || 0,
            overloadedPercentage: stats.percentOverloadedFeeders || 0,
            underloadedFeeders: stats.underloadedDTRs || 0,
            underloadedPercentage: stats.percentUnderloadedFeeders || 0,
            ltSideFuseBlown: stats.ltFuseBlown || 0,
            unbalancedDtrs: stats.unbalancedDTRs || 0,
            unbalancedPercentage: stats.percentUnbalancedDTRs || 0,
            powerFailureFeeders: stats.powerFailureFeeders || 0,
            powerFailurePercentage: stats.percentPowerFailureFeeders || 0,
            htSideFuseBlown: stats.htFuseBlown || 0,
            activeDtrs: stats.activeDTRs || 0,
            activePercentage: stats.activeDTRs && stats.totalDTRs ? ((stats.activeDTRs / stats.totalDTRs) * 100).toFixed(2) : 0,
            inactiveDtrs: stats.inactiveDTRs || 0,
            inactivePercentage: stats.inactiveDTRs && stats.totalDTRs ? ((stats.inactiveDTRs / stats.totalDTRs) * 100).toFixed(2) : 0
        };

        res.json({
            success: true,
            data: mappedStats,
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
        
        // Map consumption stats to match frontend card field names exactly
        const mappedStats = {
            totalKwh: stats.totalKWh || '0',
            totalKvah: stats.totalKVAh || '0',
            totalKw: stats.totalKW || '0',
            totalKva: stats.totalKVA || '0'
        };

        res.json({
            success: true,
            data: mappedStats,
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