import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class MeterDB {
    // Get all meters
    static async getAllMeters() {
        try {
            const meters = await prisma.meter.findMany({
                include: {
                    consumer: {
                        select: {
                            id: true,
                            consumerNumber: true,
                            name: true,
                            email: true,
                            primaryPhone: true
                        }
                    },
                    location: {
                        select: {
                            id: true,
                            name: true,
                            code: true,
                            address: true
                        }
                    },
                    config: true,
                    dtr: {
                        select: {
                            id: true,
                            dtrNumber: true
                           
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
            return meters;
        } catch (error) {
            console.error('Error getting all meters:', error);
            throw error;
        }
    }

    // Find meter by ID
    static async findById(id) {
        try {
            const meter = await prisma.meter.findUnique({
                where: { id: parseInt(id) },
                include: {
                    consumer: {
                        select: {
                            id: true,
                            consumerNumber: true,
                            name: true,
                            email: true,
                            primaryPhone: true,
                            alternatePhone: true,
                            connectionType: true,
                            category: true,
                            sanctionedLoad: true,
                            connectionDate: true
                        }
                    },
                    location: {
                        select: {
                            id: true,
                            name: true,
                            code: true,
                            address: true,
                            pincode: true,
                            latitude: true,
                            longitude: true
                        }
                    },
                    config: true,
                    dtr: {
                        select: {
                            id: true,
                            dtrNumber: true,
                            capacity: true,
                            type: true
                        }
                    },
                    currentTransformers: true,
                    potentialTransformers: true
                }
            });
            return meter;
        } catch (error) {
            console.error('Error finding meter by ID:', error);
            throw error;
        }
    }

    // Find meter by meter number
    static async findByMeterNumber(meterNumber) {
        try {
            const meter = await prisma.meter.findUnique({
                where: { meterNumber }
            });
            return meter;
        } catch (error) {
            console.error('Error finding meter by meter number:', error);
            throw error;
        }
    }

    // Find meter by serial number
    static async findBySerialNumber(serialNumber) {
        try {
            const meter = await prisma.meter.findUnique({
                where: { serialNumber }
            });
            return meter;
        } catch (error) {
            console.error('Error finding meter by serial number:', error);
            throw error;
        }
    }

    // Create new meter
    static async create(meterData) {
        try {
            // Check if meter already exists
            const existingMeterByNumber = await this.findByMeterNumber(meterData.meterNumber);
            const existingMeterBySerial = await this.findBySerialNumber(meterData.serialNumber);
            
            if (existingMeterByNumber) {
                throw new Error('Meter already exists with this meter number');
            }
            
            if (existingMeterBySerial) {
                throw new Error('Meter already exists with this serial number');
            }

            const newMeter = await prisma.meter.create({
                data: {
                    meterNumber: meterData.meterNumber,
                    serialNumber: meterData.serialNumber,
                    manufacturer: meterData.manufacturer,
                    model: meterData.model,
                    type: meterData.type,
                    phase: parseInt(meterData.phase),
                    consumerId: parseInt(meterData.consumerId),
                    locationId: parseInt(meterData.locationId),
                    installationDate: new Date(meterData.installationDate),
                    dtrId: meterData.dtrId ? parseInt(meterData.dtrId) : null,
                    status: 'ACTIVE',
                    isInUse: true
                }
            });

            return newMeter;
        } catch (error) {
            console.error('Error creating meter:', error);
            throw error;
        }
    }

    // Update meter
    static async updateMeter(id, updateData) {
        try {
            const updatedMeter = await prisma.meter.update({
                where: { id: parseInt(id) },
                data: {
                    ...updateData,
                    updatedAt: new Date()
                }
            });

            return updatedMeter;
        } catch (error) {
            console.error('Error updating meter:', error);
            throw error;
        }
    }

    // Delete meter (soft delete)
    static async deleteMeter(id) {
        try {
            const deletedMeter = await prisma.meter.update({
                where: { id: parseInt(id) },
                data: {
                    status: 'DECOMMISSIONED',
                    isInUse: false,
                    decommissionDate: new Date()
                }
            });
            return deletedMeter;
        } catch (error) {
            console.error('Error deleting meter:', error);
            throw error;
        }
    }

    // Check database connection
    static async checkConnection() {
        try {
            await prisma.$connect();
            console.log('Database connected successfully');
            return true;
        } catch (error) {
            console.error('Database connection failed:', error);
            return false;
        }
    }

    // Disconnect from database
    static async disconnect() {
        try {
            await prisma.$disconnect();
        } catch (error) {
            console.error('Error disconnecting from database:', error);
        }
    }
}

export default MeterDB; 