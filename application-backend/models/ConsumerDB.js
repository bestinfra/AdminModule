import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class ConsumerDB {
    static async getAllConsumers() {
        try {
            const consumers = await prisma.consumer.findMany({
                include: {
                    location: true,
                    meters: true
                },
                orderBy: { createdAt: 'desc' }
            });
            return consumers;
        } catch (error) {
            console.error('ConsumerDB.getAllConsumers: Database error:', error);
            throw error;
        }
    }

    static async getConsumerByNumber(consumerNumber) {
        try {
            return await prisma.consumer.findUnique({
                where: { consumerNumber },
                include: {
                    location: true,
                    meters: true,
                }
            });
        } catch (error) {
            console.error('ConsumerDB.getConsumerByNumber: Database error:', error);
            throw error;
        }
    }

    static async getDailyConsumption(meterId) {
        try {
            const consumptions = await prisma.consumption.findMany({
                where: { meterId },
                orderBy: { consumptionDate: 'asc' },
            });
            // Group by date (YYYY-MM-DD)
            const grouped = {};
            consumptions.forEach(c => {
                const date = c.consumptionDate.toISOString().split('T')[0];
                if (!grouped[date]) grouped[date] = 0;
                grouped[date] += Number(c.consumption);
            });
            return Object.entries(grouped).map(([date, sum]) => ({ date, sum }));
        } catch (error) {
            console.error('ConsumerDB.getDailyConsumption: Database error:', error);
            throw error;
        }
    }

    static async getMonthlyConsumption(meterId) {
        try {
            const consumptions = await prisma.consumption.findMany({
                where: { meterId },
                orderBy: { consumptionDate: 'asc' },
            });
            // Group by month (YYYY-MM)
            const grouped = {};
            consumptions.forEach(c => {
                const d = c.consumptionDate;
                const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                if (!grouped[month]) grouped[month] = 0;
                grouped[month] += Number(c.consumption);
            });
            return Object.entries(grouped).map(([month, sum]) => ({ month, sum }));
        } catch (error) {
            console.error('ConsumerDB.getMonthlyConsumption: Database error:', error);
            throw error;
        }
    }

    static async getPowerWidgets(meterSerial) {
        try {
            const meter = await prisma.meter.findUnique({
                where: { serialNumber: meterSerial },
                include: {
                    readings: {
                        orderBy: { readingDate: 'desc' },
                        take: 1 // Get the latest reading
                    }
                }
            });

            if (!meter) {
                throw new Error('Meter not found');
            }

            const lastCommDate = meter.readings && meter.readings.length > 0 
                ? meter.readings[0].readingDate 
                : null;

            const latestReading = meter.readings && meter.readings.length > 0 
                ? meter.readings[0] 
                : null;

            const power = latestReading ? {
                id: latestReading.id,
                meterId: latestReading.meterId,
                readingDate: latestReading.readingDate,
                readingType: latestReading.readingType,
                readingSource: latestReading.readingSource,
                
                kWh: latestReading.kWh || 0,
                kVAh: latestReading.kVAh || 0,
                kVARh: latestReading.kVARh || 0,
                
                powerFactor: latestReading.powerFactor || 0,
                averagePF: latestReading.averagePF || 0,
                minimumPF: latestReading.minimumPF || 0,
                
                voltageR: latestReading.voltageR || 0,
                voltageY: latestReading.voltageY || 0,
                voltageB: latestReading.voltageB || 0,
                averageVoltage: latestReading.averageVoltage || 0,
                
                currentR: latestReading.currentR || 0,
                currentY: latestReading.currentY || 0,
                currentB: latestReading.currentB || 0,
                averageCurrent: latestReading.averageCurrent || 0,
                
                isValid: latestReading.isValid,
                validatedBy: latestReading.validatedBy,
                validatedAt: latestReading.validatedAt,
                
                billId: latestReading.billId,
                
                createdAt: latestReading.createdAt,
                updatedAt: latestReading.updatedAt
            } : {};

            return {
                lastCommDate,
                power
            };
        } catch (error) {
            console.error('ConsumerDB.getPowerWidgets: Database error:', error);
            throw error;
        }
    }

    static async getConsumerHistory(consumerNumber) {
        try {
            const consumer = await prisma.consumer.findUnique({
                where: { consumerNumber },
                include: {
                    meters: {
                        include: {
                            config: true,
                            location: true,
                            dtr: true,
                            readings: {
                                orderBy: { readingDate: 'desc' },
                                take: 10
                            }
                        }
                    },
                    location: true,
                    bills: {
                        orderBy: { createdAt: 'desc' },
                        take: 10
                    },
                    notifications: {
                        orderBy: { createdAt: 'desc' },
                        take: 10
                    },
                    tickets: {
                        orderBy: { createdAt: 'desc' },
                        take: 10
                    }
                }
            });

            if (!consumer) {
                throw new Error('Consumer not found');
            }

            const consumerHistory = {
                consumer: {
                    id: consumer.id,
                    consumerNumber: consumer.consumerNumber,
                    name: consumer.name,
                    email: consumer.email,
                    primaryPhone: consumer.primaryPhone,
                    alternatePhone: consumer.alternatePhone,
                    idType: consumer.idType,
                    idNumber: consumer.idNumber,
                    connectionType: consumer.connectionType,
                    category: consumer.category,
                    sanctionedLoad: consumer.sanctionedLoad,
                    connectionDate: consumer.connectionDate,
                    billingCycle: consumer.billingCycle,
                    billDeliveryMode: consumer.billDeliveryMode,
                    defaultPaymentMethod: consumer.defaultPaymentMethod,
                    creditScore: consumer.creditScore,
                    createdAt: consumer.createdAt,
                    updatedAt: consumer.updatedAt,
                    location: consumer.location
                },
                meters: consumer.meters.map(meter => ({
                    id: meter.id,
                    meterNumber: meter.meterNumber,
                    serialNumber: meter.serialNumber,
                    manufacturer: meter.manufacturer,
                    model: meter.model,
                    type: meter.type,
                    phase: meter.phase,
                    status: meter.status,
                    isInUse: meter.isInUse,
                    installationDate: meter.installationDate,
                    lastMaintenanceDate: meter.lastMaintenanceDate,
                    decommissionDate: meter.decommissionDate,
                    config: meter.config,
                    location: meter.location,
                    dtr: meter.dtr,
                    readings: meter.readings
                })),
                bills: consumer.bills,
                notifications: consumer.notifications,
                tickets: consumer.tickets
            };

            return consumerHistory;
        } catch (error) {
            console.error('ConsumerDB.getConsumerHistory: Database error:', error);
            throw error;
        }
    }


}

export default ConsumerDB; 