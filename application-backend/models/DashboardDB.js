import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class DashboardDB {
    static async getMainWidgets() {
        try {
            const now = new Date();
            
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

            const totalConsumers = await prisma.consumer.count({
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

            const totalUnits = await prisma.meter.count();

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

            const usersCount = await prisma.consumer.groupBy({
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

            // Get current month revenue
            // const currentMonthRevenue = await prisma.payment.aggregate({
            //     where: {
            //         createdAt: {
            //             gte: firstDayCurrentMonth,
            //             lte: lastDayCurrentMonth
            //         },
            //         paymentStatus: 'SUCCESS'
            //     },
            //     _sum: {
            //         amount: true
            //     },
            //     _count: true
            // });

            // // Get last month revenue
            // const lastMonthRevenue = await prisma.payment.aggregate({
            //     where: {
            //         createdAt: {
            //             gte: firstDayPreviousMonth,
            //             lte: lastDayPreviousMonth
            //         },
            //         paymentStatus: 'SUCCESS'
            //     },
            //     _sum: {
            //         amount: true
            //     },
            //     _count: true
            // });

            // // Get before last month revenue
            // const beforeLastMonthRevenue = await prisma.payment.aggregate({
            //     where: {
            //         createdAt: {
            //             gte: firstDayBeforePreviousMonth,
            //             lte: lastDayBeforePreviousMonth
            //         },
            //         paymentStatus: 'SUCCESS'
            //     },
            //     _sum: {
            //         amount: true
            //     },
            //     _count: true
            // });

            // // Get yesterday consumption
            // const yesterdayConsumption = await prisma.consumption.aggregate({
            //     where: {
            //         consumptionDate: {
            //             gte: startOfYesterday,
            //             lte: endOfYesterday
            //         }
            //     },
            //     _sum: {
            //         consumption: true
            //     }
            // });

            // // Get day before yesterday consumption
            // const dayBeforeYesterdayConsumption = await prisma.consumption.aggregate({
            //     where: {
            //         consumptionDate: {
            //             gte: startOfDayBeforeYesterday,
            //             lte: endOfDayBeforeYesterday
            //         }
            //     },
            //     _sum: {
            //         consumption: true
            //     }
            // });

            // // Get yesterday revenue
            // const yesterdayRevenue = await prisma.payment.aggregate({
            //     where: {
            //         createdAt: {
            //             gte: startOfYesterday,
            //             lte: endOfYesterday
            //         },
            //         paymentStatus: 'SUCCESS'
            //     },
            //     _sum: {
            //         amount: true
            //     }
            // });

            // // Get day before yesterday revenue
            // const dayBeforeYesterdayRevenue = await prisma.payment.aggregate({
            //     where: {
            //         createdAt: {
            //             gte: startOfDayBeforeYesterday,
            //             lte: endOfDayBeforeYesterday
            //         },
            //         paymentStatus: 'SUCCESS'
            //     },
            //     _sum: {
            //         amount: true
            //     }
            // });

            return {
                activeUnits,
                totalConsumers,
                heavyUsers,
                threshold,
                totalConsumption: totalConsumption._sum.consumption || 0,
                totalUnits,
                usersCount,
                
                // Monthly Widgets Data
                // currentMonthtotalRevenue: currentMonthRevenue._sum.amount || 0,
                // lastMonthTotalRevenue: lastMonthRevenue._sum.amount || 0,
                // lastMonthTotalAmount: lastMonthRevenue._sum.amount || 0,
                // beforeLastMonthTotalAmount: beforeLastMonthRevenue._sum.amount || 0,
                // paymentReceiptsCurrentMonth: currentMonthRevenue._count || 0,
                // paymentReceiptsLastMonth: lastMonthRevenue._count || 0,
                
                // // Daily Widgets Data
                // yesterdayConsumption: yesterdayConsumption._sum.consumption || 0,
                // dayBeforeYesterdayConsumption: dayBeforeYesterdayConsumption._sum.consumption || 0,
                // yesterdayTotalRevenue: yesterdayRevenue._sum.amount || 0,
                // dayBeforeYesterdayTotalRevenue: dayBeforeYesterdayRevenue._sum.amount || 0,
                // yesterdayPaymentReceipts: 0, // Can be calculated if needed
                // dayBeforeYesterdayPaymentReceipts: 0, // Can be calculated if needed
            };
        } catch (error) {
            console.error('Error getting dashboard widgets:', error);
            throw error;
        }
    }

    static async graphDashboardAnalytics(accessCondition, accessValues, period) {
        try {
            if (period === 'daily') {
                const d1 = new Date();
                const sdf = (date) => date.toISOString().split('T')[0];
                const presDate = sdf(new Date(d1.setDate(d1.getDate() - 62)));
                d1.setDate(d1.getDate() + 62);
                const nextDate = sdf(new Date(d1));

                let whereClause = {
                    consumptionDate: {
                        gte: new Date(presDate),
                        lt: new Date(nextDate)
                    }
                };
                
                if (accessValues && accessValues.length > 0) {
                    whereClause.meterId = {
                        in: accessValues
                    };
                }

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
                    consumption_date: item.consumptionDate.toISOString().split('T')[0],
                    count: item._count.id,
                    total_consumption: item._sum.consumption || 0
                }));

            } else if (period === 'monthly') {
                const d1 = new Date();
                const sdf = (date) => date.toISOString().split('T')[0];
                const presDate = sdf(new Date(d1.setMonth(d1.getMonth() - 13)));
                d1.setMonth(d1.getMonth() + 14);
                const nextDate = sdf(new Date(d1));

                // Build the meter filter condition
                let whereClause = {
                    consumptionDate: {
                        gte: new Date(presDate),
                        lt: new Date(nextDate)
                    }
                };
                
                if (accessValues && accessValues.length > 0) {
                    whereClause.meterId = {
                        in: accessValues
                    };
                }

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
                    const monthKey = item.consumptionDate.toISOString().slice(0, 7); // YYYY-MM format
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
            }
        } catch (error) {
            console.error('graphDashboardAnalytics error:', error);
            throw error;
        }
    }
}

export default DashboardDB; 