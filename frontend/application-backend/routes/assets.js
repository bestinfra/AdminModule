import express from 'express';
import { getAllAssets, addAsset, bulkUploadAssets } from '../controllers/assetController.js';
import { validateAssetData, addAssetSchema, bulkUploadAssetsSchema } from '../validations/assetValidation.js';

const router = express.Router();

router.get('/', getAllAssets);
router.post('/', validateAssetData(addAssetSchema), addAsset);
router.post('/bulk', validateAssetData(bulkUploadAssetsSchema), bulkUploadAssets);

export default router; 