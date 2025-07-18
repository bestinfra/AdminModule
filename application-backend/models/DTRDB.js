import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class DTRDB {
    static async getDTRTable({ page = 1, pageSize = 20, search = '', status, locationId } = {}) {
        const skip = (page - 1) * pageSize;
        const where = {};

        if (search) {
            where.OR = [
                { dtrNumber: { contains: search, mode: 'insensitive' } },
                { serialNumber: { contains: search, mode: 'insensitive' } },
                { manufacturer: { contains: search, mode: 'insensitive' } },
                { model: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (status) {
            where.status = status;
        }
        if (locationId) {
            where.locationId = locationId;
        }

        const [total, data] = await Promise.all([
            prisma.dTR.count({ where }),
            prisma.dTR.findMany({
                where,
                include: {
                    location: true
                },
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return {
            data,
            total,
            page,
            pageSize
        };
    }

    static async getFeedersForDTR(dtrId) {
        try {
            const dtr = await prisma.dTR.findUnique({
                where: { id: parseInt(dtrId) }
            });

            if (!dtr) {
                throw new Error('DTR not found');
            }

            const feedersRaw = await prisma.meter.findMany({
                where: { dtrId: parseInt(dtrId) },
                select: {
                    id: true,
                    meterNumber: true,
                    serialNumber: true,
                    manufacturer: true,
                    model: true,
                    type: true,
                    phase: true,
                    status: true,
                    locationId: true
                }
            });

            const locationIds = [...new Set(feedersRaw.map(f => f.locationId))];
            const locations = await prisma.location.findMany({
                where: { id: { in: locationIds } },
                select: { id: true, name: true, code: true, latitude: true, longitude: true }
            });
            const locationMap = Object.fromEntries(locations.map(loc => [loc.id, loc]));

            const feeders = feedersRaw.map(f => ({
                ...f,
                location: locationMap[f.locationId] || null
            }));

            return {
                dtr: {
                    id: dtr.id,
                    dtrNumber: dtr.dtrNumber,
                    serialNumber: dtr.serialNumber,
                    manufacturer: dtr.manufacturer,
                    model: dtr.model,
                    capacity: dtr.capacity,
                    loadPercentage: dtr.loadPercentage,
                    status: dtr.status
                },
                feeders: feeders
            };
        } catch (error) {
            console.error('Error fetching feeders for DTR:', error);
            throw error;
        }
    }

    static async getDTRAlerts() {
        try {
            const alerts = await prisma.dTRFault.findMany({
                include: {
                    dtr: {
                        include: {
                            location: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
            return alerts;
        } catch (error) {
            console.error('Error fetching DTR alerts:', error);
            throw error;
        }
    }

    static async getDTRAlertsTrends() {
        try {
            const today = new Date();
            const months = [];
            for (let i = 0; i < 12; i++) {
                const date = new Date(today.getFullYear(), today.getMonth() - 11 + i, 1);
                months.push({
                    month: date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0')
                });
            }

            const startMonth = new Date(today.getFullYear(), today.getMonth() - 11, 1);
            const endMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

            const faults = await prisma.dTRFault.findMany({
                where: {
                    createdAt: {
                        gte: startMonth,
                        lt: endMonth
                    }
                },
                select: {
                    status: true,
                    createdAt: true
                }
            });

            const trendsData = months.map(monthData => {
                const monthFaults = faults.filter(fault => {
                    const faultMonth = fault.createdAt.getFullYear() + '-' + String(fault.createdAt.getMonth() + 1).padStart(2, '0');
                    return faultMonth === monthData.month;
                });
                return {
                    month: monthData.month,
                    detected_count: monthFaults.filter(f => f.status === 'DETECTED').length,
                    analyzing_count: monthFaults.filter(f => f.status === 'ANALYZING').length,
                    repairing_count: monthFaults.filter(f => f.status === 'REPAIRING').length,
                    resolved_count: monthFaults.filter(f => f.status === 'RESOLVED').length,
                    unresolved_count: monthFaults.filter(f => f.status === 'UNRESOLVED').length
                };
            });
            return trendsData;
        } catch (error) {
            console.error('Error fetching DTR alerts trends:', error);
            throw error;
        }
    }

    static async getDTRStats() {
        try {
            const totalDTRs = await prisma.dTR.count();
            const totalLTFeeders = await prisma.meter.count();

            // Active/Inactive DTRs
            const activeDTRs = await prisma.dTR.count({ where: { status: 'ACTIVE' } });
            const inactiveDTRs = await prisma.dTR.count({ where: { status: 'INACTIVE' } });

            const meterIds = (await prisma.meter.findMany({ select: { id: true } })).map(m => m.id);
            const latestReadings = await Promise.all(
                meterIds.map(async meterId =>
                    await prisma.meterReading.findFirst({
                        where: { meterId },
                        orderBy: { readingDate: 'desc' }
                    })
                )
            );
            const readingsArr = latestReadings.filter(Boolean);

            const ltFuseBlown = readingsArr.filter(r =>
                (r.currentR === 0 || r.currentY === 0 || r.currentB === 0)
            ).length;

            const htFuseBlown = readingsArr.filter(r =>
                (r.voltageR !== null && r.voltageR < 180) ||
                (r.voltageY !== null && r.voltageY < 180) ||
                (r.voltageB !== null && r.voltageB < 180)
            ).length;

            const totalFuseBlown = ltFuseBlown + htFuseBlown;

            const overloadedDTRs = await prisma.dTR.count({
                where: {
                    loadPercentage: { gt: 90 }
                }
            });

            const underloadedDTRs = await prisma.dTR.count({
                where: {
                    loadPercentage: { lt: 30 }
                }
            });

            const unbalancedDTRs = readingsArr.filter(r =>
                r.currentB !== null && r.currentB > 15
            ).length;

            const powerFailureFeeders = readingsArr.filter(r =>
                r.powerFactor !== null && r.powerFactor === 0
            ).length;

            // Percentages
            const percent = (num, denom) => denom > 0 ? +(num / denom * 100).toFixed(2) : 0;

            return {
                totalDTRs,
                totalLTFeeders,
                activeDTRs,
                inactiveDTRs,
                totalFuseBlown,
                overloadedDTRs,
                underloadedDTRs,
                ltFuseBlown,
                htFuseBlown,
                unbalancedDTRs,
                powerFailureFeeders,
                percentTotalFuseBlown: percent(totalFuseBlown, totalDTRs),
                percentOverloadedFeeders: percent(overloadedDTRs, totalLTFeeders),
                percentUnderloadedFeeders: percent(underloadedDTRs, totalLTFeeders),
                percentUnbalancedDTRs: percent(unbalancedDTRs, totalDTRs),
                percentPowerFailureFeeders: percent(powerFailureFeeders, totalLTFeeders)
            };
        } catch (error) {
            console.error('Error fetching DTR stats:', error);
            throw error;
        }
    }

    static async getConsumptionStats() {
        try {
            const agg = await prisma.meterReading.aggregate({
                _sum: {
                    kWh: true,
                    kVAh: true,
                    kW: true,
                    kVA: true
                }
            });
            return {
                totalKWh: agg._sum.kWh || 0,
                totalKVAh: agg._sum.kVAh || 0,
                totalKW: agg._sum.kW || 0,
                totalKVA: agg._sum.kVA || 0
            };
        } catch (error) {
            console.error('Error fetching consumption stats:', error);
            throw error;
        }
    }

    static async getFeederStats(dtrId) {
        try {
            const meters = await prisma.meter.findMany({
                where: { dtrId: parseInt(dtrId) },
                select: { id: true }
            });
            const meterIds = meters.map(m => m.id);
            const totalLTFeeders = meterIds.length;

            const latestReadings = await Promise.all(
                meterIds.map(async meterId =>
                    await prisma.meterReading.findFirst({
                        where: { meterId },
                        orderBy: { readingDate: 'desc' }
                    })
                )
            );
            const readingsArr = latestReadings.filter(Boolean);

            let totalKW = 0, totalKVA = 0, totalKWh = 0, totalKVAh = 0;
            for (const r of readingsArr) {
                totalKW += r.kW || 0;
                totalKVA += r.kVA || 0;
                totalKWh += r.kWh || 0;
                totalKVAh += r.kVAh || 0;
            }

          
            const ltFuseBlown = readingsArr.filter(r =>
                (r.currentR === 0 || r.currentY === 0 || r.currentB === 0)
            ).length;

            const unbalancedLTFeeders = readingsArr.filter(r =>
                r.currentB !== null && r.currentB > 15
            ).length;

            const dtr = await prisma.dTR.findUnique({
                where: { id: parseInt(dtrId) },
                select: { loadPercentage: true }
            });
            let status = 'Normal';
            if (dtr) {
                if (dtr.loadPercentage > 90) status = 'Over Load';
                else if (dtr.loadPercentage < 30) status = 'Under Load';
            }

            const powerOnHours = null;
            const powerOffHours = null;

            return {
                totalLTFeeders,
                totalKW,
                totalKVA,
                totalKWh,
                totalKVAh,
                ltFuseBlown,
                unbalancedLTFeeders,
                status,
                powerOnHours,
                powerOffHours
            };
        } catch (error) {
            console.error('Error fetching feeder stats:', error);
            throw error;
        }
    }

    static async getInstantaneousStats(meterId) {
        try {
            const latestReading = await prisma.meterReading.findFirst({
                where: { meterId: parseInt(meterId) },
                orderBy: { readingDate: 'desc' }
            });

            if (!latestReading) {
                return {
                    rphVolt: 0, yphVolt: 0, bphVolt: 0,
                    instantKVA: 0, mdKVA: 0,
                    rphCurr: 0, yphCurr: 0, bphCurr: 0,
                    neutralCurrent: 0, freqHz: 0,
                    rphPF: 0, yphPF: 0, bphPF: 0,
                    avgPF: 0, cumulativeKVAh: 0,
                    lastCommDate: null
                };
            }

            const allReadings = await prisma.meterReading.findMany({
                where: { meterId: parseInt(meterId) }
            });

            const rphVolt = latestReading.voltageR || 0;
            const yphVolt = latestReading.voltageY || 0;
            const bphVolt = latestReading.voltageB || 0;
            const rphCurr = latestReading.currentR || 0;
            const yphCurr = latestReading.currentY || 0;
            const bphCurr = latestReading.currentB || 0;
            const instantKVA = latestReading.kVA || 0;
            const freqHz = latestReading.frequency || 0;
            const avgPF = latestReading.averagePF || 0;
            const neutralCurrent = latestReading.currentB || 0; 

            const mdKVA = allReadings.length > 0 
                ? Math.max(...allReadings.map(r => r.kVA || 0))
                : 0;

            const cumulativeKVAh = allReadings.reduce((sum, r) => sum + (r.kVAh || 0), 0);

            // Use the new phase-specific power factor columns
            const rphPF = latestReading.rphPowerFactor || avgPF;
            const yphPF = latestReading.yphPowerFactor || avgPF;
            const bphPF = latestReading.bphPowerFactor || avgPF;

            return {
                rphVolt: +(rphVolt).toFixed(2),
                yphVolt: +(yphVolt).toFixed(2),
                bphVolt: +(bphVolt).toFixed(2),
                instantKVA: +(instantKVA).toFixed(2),
                mdKVA: +(mdKVA).toFixed(2),
                rphCurr: +(rphCurr).toFixed(2),
                yphCurr: +(yphCurr).toFixed(2),
                bphCurr: +(bphCurr).toFixed(2),
                neutralCurrent: +(neutralCurrent).toFixed(2),
                freqHz: +(freqHz).toFixed(2),
                rphPF: +(rphPF).toFixed(2),
                yphPF: +(yphPF).toFixed(2),
                bphPF: +(bphPF).toFixed(2),
                avgPF: +(avgPF).toFixed(2),
                cumulativeKVAh: +(cumulativeKVAh).toFixed(2),
                lastCommDate: latestReading.readingDate
            };
        } catch (error) {
            console.error('Error fetching instantaneous stats:', error);
            throw error;
        }
    }
}

export default DTRDB; 