import MeterDB from '../models/MeterDB.js';

// Get all meters
export const getAllMeters = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const filters = {
            status: req.query.status && req.query.status !== 'all' ? req.query.status : undefined,
            type: req.query.type && req.query.type !== 'all' ? req.query.type : undefined,
            manufacturer: req.query.manufacturer && req.query.manufacturer !== 'all' ? req.query.manufacturer : undefined,
            location: req.query.location && req.query.location !== 'all' ? req.query.location : undefined,
        };
        const metersData = await MeterDB.getMetersTable(page, limit, filters);
        const formatted = metersData.data.map((m, idx) => {
            return {
                sNo: (page - 1) * limit + idx + 1,
                meterSerialNumber: m.meterNumber || 'NA',
                modemSerialNumber: m.serialNumber || 'NA',
                meterType: m.type || m.meterType || 'NA',
                meterMake: m.manufacturer || 'NA',
                consumerName: m.consumers?.name || 'NA',
                location: m.locations?.name || 'NA',
                installationDate: m.installationDate || m.createdAt || 'NA',
            };
        });
        res.json({
            success: true,
            data: formatted,
            pagination: metersData.pagination
        });
    } catch (error) {
        console.error('Error fetching meters:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch meters',
            error: error.message
        });
    }
};

export const getMeterById = async (req, res) => {
    try {
        const { id } = req.params;
        const meter = await MeterDB.findById(id);
        
        if (!meter) {
            return res.status(404).json({
                success: false,
                message: 'Meter not found'
            });
        }

        res.json({
            success: true,
            data: meter,
            message: 'Meter retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching meter:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch meter',
            error: error.message
        });
    }
};

export const createMeter = async (req, res) => {
    try {
        const meterData = req.validatedData;

        const newMeter = await MeterDB.create(meterData);

        res.status(201).json({
            success: true,
            data: newMeter,
            message: 'Meter created successfully'
        });
    } catch (error) {
        console.error('Error creating meter:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create meter'
        });
    }
};

export const updateMeter = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedMeter = await MeterDB.updateMeter(id, updateData);

        res.json({
            success: true,
            data: updatedMeter,
            message: 'Meter updated successfully'
        });
    } catch (error) {
        console.error('Error updating meter:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update meter',
            error: error.message
        });
    }
};

export const deleteMeter = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMeter = await MeterDB.deleteMeter(id);

        res.json({
            success: true,
            data: deletedMeter,
            message: 'Meter deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting meter:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete meter',
            error: error.message
        });
    }
}; 

export const getMeterStats = async (req, res) => {
    try {
        const stats = await MeterDB.getMeterStats();
        res.json({
            success: true,
            data: {
                totalMeters: stats.totalMeters,
                makes: stats.makes,
                types: stats.types,
                connectionTypes: stats.connectionTypes
            }
        });
    } catch (error) {
        console.error('❌ getMeterStats: Error fetching meter stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch meter statistics',
            error: error.message
        });
    }
};

export const getMeterView = async (req, res) => {
    try {
        const { id } = req.params;
        const meter = await MeterDB.getMeterView(id);
        if (!meter) {
            return res.status(404).json({
                success: false,
                message: 'Meter not found'
            });
        }
        res.json({
            success: true,
            data: meter
        });
    } catch (error) {
        console.error('❌ getMeterView: Error fetching meter:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch meter',
            error: error.message
        });
    }
}; 

export const getDataLoggersList = async (req, res) => {
    try {
        const dataLoggers = await MeterDB.getDataLoggersList();
        
        const formatted = dataLoggers.map((logger, idx) => ({
            sNo: idx + 1,
            modemId: logger.modem_id,
            modemSlNo: logger.modem_sl_no,
            hwVersion: logger.hw_version || 'NA',
            fwVersion: logger.fw_version || 'NA',
            mobile: logger.mobile || 'NA',
            deliveryDate: logger.delivery_date ? new Date(logger.delivery_date).toLocaleDateString() : 'NA',
            imei: logger.imei || 'NA',
            simno: logger.simno || 'NA',
            changedBy: logger.changed_by || 'NA',
            changedDatetime: logger.changed_datetime || 'NA',
            ip: logger.ip || 'NA',
            logTimestamp: logger.log_timestamp ? new Date(logger.log_timestamp).toLocaleString() : 'NA',
            simNo: logger.sim_no || 'NA',
            // Meter details
            meterId: logger.meter?.id,
            meterNumber: logger.meter?.meterNumber || 'NA',
            serialNumber: logger.meter?.serialNumber || 'NA',
            manufacturer: logger.meter?.manufacturer || 'NA',
            model: logger.meter?.model || 'NA',
            type: logger.meter?.type || 'NA',
            status: logger.meter?.status || 'NA',
            installationDate: logger.meter?.installationDate ? new Date(logger.meter.installationDate).toLocaleDateString() : 'NA',
            // Consumer details
            consumerNumber: logger.meter?.consumer?.consumerNumber || 'NA',
            consumerName: logger.meter?.consumer?.name || 'NA',
            consumerPhone: logger.meter?.consumer?.primaryPhone || 'NA',
            consumerEmail: logger.meter?.consumer?.email || 'NA',
            // Location details
            locationName: logger.meter?.location?.name || 'NA',
            locationCode: logger.meter?.location?.code || 'NA',
            locationAddress: logger.meter?.location?.address || 'NA'
        }));

        res.json({
            success: true,
            data: formatted,
            message: 'Data loggers retrieved successfully'
        });
    } catch (error) {
        console.error('❌ getDataLoggersList: Error fetching data loggers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch data loggers',
            error: error.message
        });
    }
}; 

export const getMeterHistory = async (req, res) => {
    try {
        const { id } = req.params;
        
        const meter = await MeterDB.getMeterHistory(id);
        
        if (!meter) {
            return res.status(404).json({
                success: false,
                message: 'Meter not found'
            });
        }

        // Format the data for the frontend table columns
        const formattedMeter = {
            slNo: 1,
            meterSlNo: meter.meterNumber || 'N/A',
            modemSlNo: meter.modem?.modem_sl_no || 'N/A',
            meterType: meter.type || 'N/A',
            meterMake: meter.manufacturer || 'N/A',
            consumerName: meter.consumer?.name || 'N/A',
            location: meter.location?.name || 'N/A',
            installationDate: meter.installationDate ? new Date(meter.installationDate).toLocaleDateString() : 'N/A'
        };

        res.json({
            success: true,
            data: formattedMeter,
            message: 'Meter details retrieved successfully'
        });
    } catch (error) {
        console.error('❌ getMeterHistory: Error fetching meter history:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch meter details',
            error: error.message
        });
    }
}; 

