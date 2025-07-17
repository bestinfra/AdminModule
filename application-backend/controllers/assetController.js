import AssetDB from '../models/AssetDB.js';

export const getAllAssets = async (req, res) => {
    try {
        const assets = await AssetDB.getAllAssets();
        res.json({
            success: true,
            data: assets,
            message: 'Assets retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching assets:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch assets',
            error: error.message
        });
    }
}; 