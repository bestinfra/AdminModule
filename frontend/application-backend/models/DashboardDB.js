import { PrismaClient } from '@prisma/client';
import { getDateInYMDFormat } from '../utils/utils.js';

const prisma = new PrismaClient();

class DashboardDB {
    static async getMainWidgets() {
        try {
            const now = new Date();
            // Use getDateInYMDFormat for string dates if needed
            const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDayCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            const firstDayPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const lastDayPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
            const firstDayBeforePreviousMonth = new Date(now.getFullYear(), now.getMonth() - 2, 1);
            const lastDayBeforePreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59, 999);
            
            const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
            const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);
            const startOfDayBeforeYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2);
            const endOfDayBeforeYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 23, 59, 59, 999);

            const totalConsumers = await prisma.consumers.count({
                where: {
                    meters: {
                        some: {} // Only count consumers that have at least one meter
                    }
                }
            });

            const today = new Date();
            const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

            const activeMeterIds = await prisma.consumption.findMany({
                where: {
                    consumptionDate: {
                        gte: startOfToday,
                        lte: endOfToday
                    }
                },
                select: {
                    meterId: true
                },
                distinct: ['meterId']
            });

            const activeUnits = activeMeterIds.length;

            const totalConsumption = await prisma.consumption.aggregate({
                _sum: {
                    consumption: true
                }
            });

            const totalUnits = await prisma.meters.count();

            const threshold = totalUnits > 0 
                ? parseFloat(totalConsumption._sum.consumption || 0) / parseFloat(totalUnits)
                : 0;

            const heavyUsers = await prisma.consumption.count({
                where: {
                    consumption: {
                        gt: 1.93
                    }
                }
            });

            const usersCount = await prisma.consumers.groupBy({
                by: ['category'],
                where: {
                    meters: {
                        some: {} 
                    }
                },
                _count: {
                    category: true
                }
            });

            return {
                activeUnits,
                totalConsumers,
                heavyUsers,
                threshold,
                totalConsumption: totalConsumption._sum.consumption || 0,
                totalUnits,
                usersCount,
            };
        } catch (error) {
            console.error('getMainWidgets error:', error);
            throw error;
        }
    }

    static async graphDashboardAnalytics(period) {
        try {
            if (period === 'daily') {
                const d1 = new Date();
                const sdf = (date) => getDateInYMDFormat(date);
                const presDate = sdf(new Date(d1.setDate(d1.getDate() - 62)));
                d1.setDate(d1.getDate() + 62);
                const nextDate = sdf(new Date(d1));

                let whereClause = {
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
            console.error('graphDashboardAnalytics error:', error);
            throw error;
        }
    }
}

export default DashboardDB; 