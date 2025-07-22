import { PrismaClient } from '@prisma/client';
import { getDateInYMDFormat } from '../utils/utils.js';

const prisma = new PrismaClient();

class MeterDB {
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
                    },
                    readings: {
                        orderBy: { readingDate: 'desc' },
                        take: 1
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
            const existingMeterBySerial = await this.findBySerialNumber(meterData.serialNumber);
            
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
                    installationDate: new Date(getDateInYMDFormat(new Date(meterData.installationDate))),
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


    static async getMeterStats() {
        try {
            const totalMeters = await prisma.meter.count();
            const makes = await prisma.meter.groupBy({
                by: ['manufacturer'],
                _count: { manufacturer: true }
            });
            const types = await prisma.meter.groupBy({
                by: ['type'],
                _count: { type: true }
            });
            const connectionTypes = await prisma.meter.findMany({
                select: {
                    consumer: {
                        select: { connectionType: true }
                    }
                }
            });
            const connTypeCounts = {};
            connectionTypes.forEach(m => {
                const ct = m.consumer?.connectionType;
                if (ct) connTypeCounts[ct] = (connTypeCounts[ct] || 0) + 1;
            });

            return {
                totalMeters,
                makes: makes.map(m => ({ manufacturer: m.manufacturer, count: m._count.manufacturer })),
                types: types.map(t => ({ type: t.type, count: t._count.type })),
                connectionTypes: connTypeCounts
            };
        } catch (error) {
            console.error('MeterDB.getMeterStats: Database error:', error);
            throw error;
        }
    }

    static async getMeterView(meterId) {
        try {
            const meter = await prisma.meter.findUnique({
                where: { id: parseInt(meterId) },
                include: {
                    config: true,
                    consumer: {
                        include: {
                            location: true
                        }
                    },
                    location: true,
                    dtr: true,
                    readings: {
                        orderBy: { readingDate: 'desc' },
                        take: 10
                    }
                }
            });
            if (!meter) throw new Error('Meter not found');
            return meter;
        } catch (error) {
            console.error(' MeterDB.getMeterView: Database error:', error);
            throw error;
        }
    }

    static async getMetersTable(page = 1, limit = 10, filters = {}) {
        try {
            const skip = (page - 1) * limit;
            const whereClause = {};
            if (filters.meterNumber) {
                whereClause.meterNumber = { contains: filters.meterNumber, mode: 'insensitive' };
            }
            if (filters.serialNumber) {
                whereClause.serialNumber = { contains: filters.serialNumber, mode: 'insensitive' };
            }
            if (filters.manufacturer) {
                whereClause.manufacturer = { contains: filters.manufacturer, mode: 'insensitive' };
            }
            if (filters.type) {
                whereClause.type = filters.type;
            }
            if (filters.status) {
                whereClause.status = filters.status;
            }
            if (filters.consumerNumber) {
                whereClause.consumer = {
                    consumerNumber: { contains: filters.consumerNumber, mode: 'insensitive' }
                };
            }
            const totalCount = await prisma.meter.count({ where: whereClause });

            const meters = await prisma.meter.findMany({
                where: whereClause,
                include: {
                    consumer: {
                        select: {
                            consumerNumber: true,
                            name: true,
                            primaryPhone: true,
                            email: true
                        }
                    },
                    location: {
                        select: {
                            name: true,
                            code: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            });

            const totalPages = Math.ceil(totalCount / limit);

            const result = {
                data: meters,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                    limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            };
            return result;
        } catch (error) {
            console.error(' MeterDB.getMetersTable: Database error:', error);
            throw error;
        }
    }
}

export default MeterDB; 