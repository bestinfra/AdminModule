import { PrismaClient } from '@prisma/client';
import { getDateInYMDFormat } from '../utils/utils.js';

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

        // Get feeders count for each DTR
        const dtrsWithFeedersCount = await Promise.all(
            data.map(async (dtr) => {
                const feedersCount = await prisma.meter.count({
                    where: { dtrId: dtr.id }
                });
                return {
                    ...dtr,
                    feedersCount
                };
            })
        );

        return {
            data: dtrsWithFeedersCount,
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

    static async getConsolidatedDTRStats() {
        try {
            // Get basic DTR stats
            const totalDTRs = await prisma.dTR.count();
            const totalLTFeeders = await prisma.meter.count();
            const activeDTRs = await prisma.dTR.count({ where: { status: 'ACTIVE' } });
            const inactiveDTRs = await prisma.dTR.count({ where: { status: 'INACTIVE' } });

            // Get meter readings for calculations
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

            // Calculate fuse blown stats
            const ltFuseBlown = readingsArr.filter(r =>
                (r.currentR === 0 || r.currentY === 0 || r.currentB === 0)
            ).length;

            const htFuseBlown = readingsArr.filter(r =>
                (r.voltageR !== null && r.voltageR < 180) ||
                (r.voltageY !== null && r.voltageY < 180) ||
                (r.voltageB !== null && r.voltageB < 180)
            ).length;

            const totalFuseBlown = ltFuseBlown + htFuseBlown;

            // Calculate overloaded/underloaded stats
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

            // Calculate percentages
            const percent = (num, denom) => denom > 0 ? +(num / denom * 100).toFixed(2) : 0;

            // Get consumption stats
            const agg = await prisma.meterReading.aggregate({
                _sum: {
                    kWh: true,
                    kVAh: true,
                    kW: true,
                    kVA: true
                }
            });

            // Format data according to the specified structure
            return {
                row1: {
                    totalDtrs: totalDTRs,
                    totalLtFeeders: totalLTFeeders,
                    totalFuseBlown: totalFuseBlown,
                    fuseBlownPercentage: percent(totalFuseBlown, totalDTRs),
                    overloadedFeeders: overloadedDTRs,
                    overloadedPercentage: percent(overloadedDTRs, totalLTFeeders),
                    underloadedFeeders: underloadedDTRs,
                    underloadedPercentage: percent(underloadedDTRs, totalLTFeeders),
                    ltSideFuseBlown: ltFuseBlown,
                    unbalancedDtrs: unbalancedDTRs,
                    unbalancedPercentage: percent(unbalancedDTRs, totalDTRs),
                    powerFailureFeeders: powerFailureFeeders,
                    powerFailurePercentage: percent(powerFailureFeeders, totalLTFeeders),
                    htSideFuseBlown: htFuseBlown,
                    activeDtrs: activeDTRs,
                    activePercentage: percent(activeDTRs, totalDTRs),
                    inactiveDtrs: inactiveDTRs,
                    inactivePercentage: percent(inactiveDTRs, totalDTRs)
                },
                row2: {
                    daily: {
                        totalKwh: (agg._sum.kWh || 0).toFixed(2),
                        totalKvah: (agg._sum.kVAh || 0).toFixed(2),
                        totalKw: (agg._sum.kW || 0).toFixed(2),
                        totalKva: (agg._sum.kVA || 0).toFixed(2)
                    },
                    monthly: {
                        totalKwh: (agg._sum.kWh || 0).toFixed(2),
                        totalKvah: (agg._sum.kVAh || 0).toFixed(2),
                        totalKw: (agg._sum.kW || 0).toFixed(2),
                        totalKva: (agg._sum.kVA || 0).toFixed(2)
                    }
                }
            };
        } catch (error) {
            console.error('Error fetching consolidated DTR stats:', error);
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

    static async getInstantaneousStats(dtrId) {
        try {
            // Get all meters associated with this DTR
            const meters = await prisma.meter.findMany({
                where: { dtrId: parseInt(dtrId) },
                select: { id: true }
            });
            
            const meterIds = meters.map(m => m.id);
            
            if (meterIds.length === 0) {
                return {
                    rphVolt: 0, yphVolt: 0, bphVolt: 0,
                    instantKVA: 0, mdKVA: 0,
                    rphCurr: 0, yphCurr: 0, bphCurr: 0,
                    neutralCurrent: 0, freqHz: 0,
                    rphPF: 0, yphPF: 0, bphPF: 0,
                    avgPF: 0, cumulativeKVAh: 0,
                    lastCommDate: null,
                    meterCount: 0
                };
            }

            // Get latest readings for all meters in this DTR
            const latestReadings = await Promise.all(
                meterIds.map(async meterId => {
                    return await prisma.meterReading.findFirst({
                        where: { meterId },
                        orderBy: { readingDate: 'desc' }
                    });
                })
            );

            const validReadings = latestReadings.filter(Boolean);
            
            if (validReadings.length === 0) {
                return {
                    rphVolt: 0, yphVolt: 0, bphVolt: 0,
                    instantKVA: 0, mdKVA: 0,
                    rphCurr: 0, yphCurr: 0, bphCurr: 0,
                    neutralCurrent: 0, freqHz: 0,
                    rphPF: 0, yphPF: 0, bphPF: 0,
                    avgPF: 0, cumulativeKVAh: 0,
                    lastCommDate: null,
                    meterCount: meterIds.length
                };
            }

            // Get all readings for all meters in this DTR for cumulative calculations
            const allReadings = await prisma.meterReading.findMany({
                where: { meterId: { in: meterIds } }
            });

            // Calculate averages across all meters
            const avgRphVolt = validReadings.reduce((sum, r) => sum + (r.voltageR || 0), 0) / validReadings.length;
            const avgYphVolt = validReadings.reduce((sum, r) => sum + (r.voltageY || 0), 0) / validReadings.length;
            const avgBphVolt = validReadings.reduce((sum, r) => sum + (r.voltageB || 0), 0) / validReadings.length;
            const avgRphCurr = validReadings.reduce((sum, r) => sum + (r.currentR || 0), 0) / validReadings.length;
            const avgYphCurr = validReadings.reduce((sum, r) => sum + (r.currentY || 0), 0) / validReadings.length;
            const avgBphCurr = validReadings.reduce((sum, r) => sum + (r.currentB || 0), 0) / validReadings.length;
            const avgInstantKVA = validReadings.reduce((sum, r) => sum + (r.kVA || 0), 0) / validReadings.length;
            const avgFreqHz = validReadings.reduce((sum, r) => sum + (r.frequency || 0), 0) / validReadings.length;
            const avgPowerFactor = validReadings.reduce((sum, r) => sum + (r.averagePF || 0), 0) / validReadings.length;

            // Calculate maximum demand KVA across all meters
            const mdKVA = allReadings.length > 0 
                ? Math.max(...allReadings.map(r => r.kVA || 0))
                : 0;

            // Calculate cumulative KVAh across all meters
            const cumulativeKVAh = allReadings.reduce((sum, r) => sum + (r.kVAh || 0), 0);

            // Calculate average phase-specific power factors
            const avgRphPF = validReadings.reduce((sum, r) => sum + (r.rphPowerFactor || r.averagePF || 0), 0) / validReadings.length;
            const avgYphPF = validReadings.reduce((sum, r) => sum + (r.yphPowerFactor || r.averagePF || 0), 0) / validReadings.length;
            const avgBphPF = validReadings.reduce((sum, r) => sum + (r.bphPowerFactor || r.averagePF || 0), 0) / validReadings.length;

            // Get the latest communication date
            const latestCommDate = validReadings.reduce((latest, r) => 
                r.readingDate > latest ? r.readingDate : latest, 
                validReadings[0].readingDate
            );

            return {
                rphVolt: +(avgRphVolt).toFixed(2),
                yphVolt: +(avgYphVolt).toFixed(2),
                bphVolt: +(avgBphVolt).toFixed(2),
                instantKVA: +(avgInstantKVA).toFixed(2),
                mdKVA: +(mdKVA).toFixed(2),
                rphCurr: +(avgRphCurr).toFixed(2),
                yphCurr: +(avgYphCurr).toFixed(2),
                bphCurr: +(avgBphCurr).toFixed(2),
                neutralCurrent: +(avgBphCurr).toFixed(2), // Using B phase current as neutral
                freqHz: +(avgFreqHz).toFixed(2),
                rphPF: +(avgRphPF).toFixed(2),
                yphPF: +(avgYphPF).toFixed(2),
                bphPF: +(avgBphPF).toFixed(2),
                avgPF: +(avgPowerFactor).toFixed(2),
                cumulativeKVAh: +(cumulativeKVAh).toFixed(2),
                lastCommDate: latestCommDate,
                meterCount: meterIds.length
            };
        } catch (error) {
            console.error('Error fetching instantaneous stats:', error);
            throw error;
        }
    }

    static async getDTRConsumptionAnalytics(dtrId, period) {
        try {
            // Get all meters associated with this DTR
            const meters = await prisma.meter.findMany({
                where: { dtrId: parseInt(dtrId) },
                select: { id: true }
            });
            
            const meterIds = meters.map(m => m.id);
            
            if (meterIds.length === 0) {
                return [];
            }

            if (period === 'daily') {
                const d1 = new Date();
                const sdf = (date) => getDateInYMDFormat(date);
                const presDate = sdf(new Date(d1.setDate(d1.getDate() - 62)));
                d1.setDate(d1.getDate() + 62);
                const nextDate = sdf(new Date(d1));

                let whereClause = {
                    meterId: { in: meterIds },
                    readingDate: {
                        gte: new Date(presDate),
                        lt: new Date(nextDate)
                    }
                };

                const result = await prisma.meterReading.groupBy({
                    by: ['readingDate'],
                    where: whereClause,
                    _count: {
                        id: true
                    },
                    _sum: {
                        kWh: true,
                        kVAh: true,
                        kW: true,
                        kVA: true
                    },
                    orderBy: {
                        readingDate: 'asc'
                    }
                });

                return result.map(item => ({
                    consumption_date: getDateInYMDFormat(item.readingDate),
                    count: item._count.id,
                    total_kwh: item._sum.kWh || 0,
                    total_kvah: item._sum.kVAh || 0,
                    total_kw: item._sum.kW || 0,
                    total_kva: item._sum.kVA || 0
                }));

            }
            // monthly
            const d1 = new Date();
            const sdf = (date) => getDateInYMDFormat(date);
            const presDate = sdf(new Date(d1.setMonth(d1.getMonth() - 13)));
            d1.setMonth(d1.getMonth() + 14);
            const nextDate = sdf(new Date(d1));

            let whereClause = {
                meterId: { in: meterIds },
                readingDate: {
                    gte: new Date(presDate),
                    lt: new Date(nextDate)
                }
            };

            const result = await prisma.meterReading.groupBy({
                by: ['readingDate'],
                where: whereClause,
                _count: {
                    id: true
                },
                _sum: {
                    kWh: true,
                    kVAh: true,
                    kW: true,
                    kVA: true
                },
                orderBy: {
                    readingDate: 'asc'
                }
            });

            // Group by month
            const monthlyData = {};
            result.forEach(item => {
                const monthKey = getDateInYMDFormat(item.readingDate).slice(0, 7); // YYYY-MM format
                if (!monthlyData[monthKey]) {
                    monthlyData[monthKey] = {
                        consumption_date: monthKey,
                        count: 0,
                        total_kwh: 0,
                        total_kvah: 0,
                        total_kw: 0,
                        total_kva: 0
                    };
                }
                monthlyData[monthKey].count += item._count.id;
                monthlyData[monthKey].total_kwh += item._sum.kWh || 0;
                monthlyData[monthKey].total_kvah += item._sum.kVAh || 0;
                monthlyData[monthKey].total_kw += item._sum.kW || 0;
                monthlyData[monthKey].total_kva += item._sum.kVA || 0;
            });

            return Object.values(monthlyData).sort((a, b) => a.consumption_date.localeCompare(b.consumption_date));
        } catch (error) {
            console.error('Error fetching DTR consumption analytics:', error);
            throw error;
        }
    }

    static async getDTRConsumptionStats(dtrId) {
        try {
            // Get all meters associated with this DTR
            const meters = await prisma.meter.findMany({
                where: { dtrId: parseInt(dtrId) },
                select: { id: true }
            });
            
            const meterIds = meters.map(m => m.id);
            
            if (meterIds.length === 0) {
                return {
                    totalKWh: 0,
                    totalKVAh: 0,
                    totalKW: 0,
                    totalKVA: 0,
                    meterCount: 0
                };
            }

            const agg = await prisma.meterReading.aggregate({
                where: {
                    meterId: { in: meterIds }
                },
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
                totalKVA: agg._sum.kVA || 0,
                meterCount: meterIds.length
            };
        } catch (error) {
            console.error('Error fetching DTR consumption stats:', error);
            throw error;
        }
    }

    

    static async getDTRMainGraphAnalytics(dtrId, period) {
        try {
            // Get all meters associated with this DTR
            const meters = await prisma.meter.findMany({
                where: { dtrId: parseInt(dtrId) },
                select: { id: true }
            });
            
            const meterIds = meters.map(m => m.id);
            
            if (meterIds.length === 0) {
                return [];
            }

            if (period === 'daily') {
                const d1 = new Date();
                const sdf = (date) => getDateInYMDFormat(date);
                const presDate = sdf(new Date(d1.setDate(d1.getDate() - 62)));
                d1.setDate(d1.getDate() + 62);
                const nextDate = sdf(new Date(d1));

                let whereClause = {
                    meterId: { in: meterIds },
                    consumptionDate: {
                        gte: new Date(presDate),
                        lt: new Date(nextDate)
                    }
                };

                const result = await prisma.consumption.groupBy({
                    by: ['consumptionDate'],
                    where: whereClause,
                    _count: {
                        id: true
                    },
                    _sum: {
                        consumption: true
                    },
                    orderBy: {
                        consumptionDate: 'asc'
                    }
                });

                return result.map(item => ({
                    consumption_date: getDateInYMDFormat(item.consumptionDate),
                    count: item._count.id,
                    total_consumption: item._sum.consumption || 0
                }));

            }
            // monthly
            const d1 = new Date();
            const sdf = (date) => getDateInYMDFormat(date);
            const presDate = sdf(new Date(d1.setMonth(d1.getMonth() - 13)));
            d1.setMonth(d1.getMonth() + 14);
            const nextDate = sdf(new Date(d1));

            let whereClause = {
                meterId: { in: meterIds },
                consumptionDate: {
                    gte: new Date(presDate),
                    lt: new Date(nextDate)
                }
            };

            const result = await prisma.consumption.groupBy({
                by: ['consumptionDate'],
                where: whereClause,
                _count: {
                    id: true
                },
                _sum: {
                    consumption: true
                },
                orderBy: {
                    consumptionDate: 'asc'
                }
            });

            // Group by month
            const monthlyData = {};
            result.forEach(item => {
                const monthKey = getDateInYMDFormat(item.consumptionDate).slice(0, 7); // YYYY-MM format
                if (!monthlyData[monthKey]) {
                    monthlyData[monthKey] = {
                        consumption_date: monthKey,
                        count: 0,
                        total_consumption: 0
                    };
                }
                monthlyData[monthKey].count += item._count.id;
                monthlyData[monthKey].total_consumption += item._sum.consumption || 0;
            });

            return Object.values(monthlyData).sort((a, b) => a.consumption_date.localeCompare(b.consumption_date));
        } catch (error) {
            console.error('Error fetching DTR main graph analytics:', error);
            throw error;
        }
    }
}

export default DTRDB; 