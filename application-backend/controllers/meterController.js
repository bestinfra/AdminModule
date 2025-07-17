import MeterDB from '../models/MeterDB.js';

// Get all meters
export const getAllMeters = async (req, res) => {
    try {
        const meters = await MeterDB.getAllMeters();
        
        res.json({
            success: true,
            data: meters,
            message: 'Meters retrieved successfully'
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
        const {
            meterNumber,
            serialNumber,
            manufacturer,
            model,
            type,
            phase,
            consumerId,
            locationId,
            installationDate,
            dtrId
        } = req.body;

        if (!meterNumber || !serialNumber || !manufacturer || !model || !type || !phase || !consumerId || !locationId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const meterData = {
            meterNumber,
            serialNumber,
            manufacturer,
            model,
            type,
            phase,
            consumerId,
            locationId,
            installationDate,
            dtrId
        };

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
            data: stats
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

