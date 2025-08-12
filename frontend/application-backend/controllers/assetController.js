import AssetDB from '../models/AssetDB.js';

export const getAllAssets = async (req, res) => {
    try {
        const assets = await AssetDB.getAllAssets();
        // Map to clean structure
        const mappedAssets = assets.map(asset => ({
            id: asset.id,
            name: asset.name,
            code: asset.code,
            type: asset.locationType?.name || null,
            parentId: asset.parentId,
            createdAt: asset.createdAt,
            updatedAt: asset.updatedAt,
        }));
        res.json({
            success: true,
            data: mappedAssets,
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

export const addAsset = async (req, res) => {
    try {
        // Use validated data from middleware
        const assetData = req.validatedData;
        
        const result = await AssetDB.addAsset(assetData);
        res.json({
            success: true,
            data: result,
            message: result.message
        });
    } catch (error) {
        console.error('Error adding asset:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add asset',
            error: error.message
        });
    }
};

export const bulkUploadAssets = async (req, res) => {
    try {
        // Use validated data from middleware
        const { assets } = req.validatedData;

        const result = await AssetDB.bulkUploadAssets(assets);
        res.json({
            success: true,
            data: result,
            message: result.message
        });
    } catch (error) {
        console.error('Error bulk uploading assets:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to bulk upload assets',
            error: error.message
        });
    }
}; 