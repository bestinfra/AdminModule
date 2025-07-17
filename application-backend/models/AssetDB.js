import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class AssetDB {
    static async getAllAssets() {
        try {
            const assets = await prisma.location.findMany({
                include: {
                    locationType: true
                },
                orderBy: { createdAt: 'desc' }
            });
            return assets;
        } catch (error) {
            console.error('Error getting all assets:', error);
            throw error;
        }
    }
}

export default AssetDB; 