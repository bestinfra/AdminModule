import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class BillingDB {
    static async getPostpaidBillingStats() {
        try {
            const bills = await prisma.bill.findMany({
                include: {
                    consumer: true,
                    meter: true,
                    payments: true
                }
            });

            const totalBills = bills.length;
            const totalAmount = bills.reduce((sum, bill) => sum + Number(bill.totalAmount || 0), 0);
            
            // Calculate outstanding and paid amounts based on payments
            const outstandingAmount = bills.reduce((sum, bill) => {
                const totalPaid = bill.payments.reduce((paymentSum, payment) => 
                    paymentSum + Number(payment.amount || 0), 0);
                const outstanding = Number(bill.totalAmount || 0) - totalPaid;
                return sum + (outstanding > 0 ? outstanding : 0);
            }, 0);
            
            const overdueAmount = bills.reduce((sum, bill) => {
                const totalPaid = bill.payments.reduce((paymentSum, payment) => 
                    paymentSum + Number(payment.amount || 0), 0);
                const outstanding = Number(bill.totalAmount || 0) - totalPaid;
                const isOverdue = bill.dueDate < new Date() && outstanding > 0;
                return sum + (isOverdue ? outstanding : 0);
            }, 0);
            
            const paidAmount = bills.reduce((sum, bill) => {
                const totalPaid = bill.payments.reduce((paymentSum, payment) => 
                    paymentSum + Number(payment.amount || 0), 0);
                return sum + totalPaid;
            }, 0);

            // Calculate realization percentage
            const realizationPercentage = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

            // Count by status
            const pendingCount = bills.filter(bill => bill.status === 'GENERATED').length;
            const overdueCount = bills.filter(bill => {
                const totalPaid = bill.payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
                const outstanding = Number(bill.totalAmount || 0) - totalPaid;
                return bill.dueDate < new Date() && outstanding > 0;
            }).length;
            const paidCount = bills.filter(bill => {
                const totalPaid = bill.payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
                return totalPaid >= Number(bill.totalAmount || 0);
            }).length;

            const stats = {
                totalBills,
                totalAmount: Number(totalAmount.toFixed(2)),
                outstandingAmount: Number(outstandingAmount.toFixed(2)),
                overdueAmount: Number(overdueAmount.toFixed(2)),
                paidAmount: Number(paidAmount.toFixed(2)),
                realizationPercentage: Number(realizationPercentage.toFixed(2)),
                pendingCount,
                overdueCount,
                paidCount
            };
            
            return stats;
        } catch (error) {
            console.error(' BillingDB.getPostpaidBillingStats: Database error:', error);
            throw error;
        }
    }

    static async getPostpaidBillingTable(page = 1, limit = 10, filters = {}) {
        try {
            const skip = (page - 1) * limit;
            
            const whereClause = {};

            if (filters.status) {
                whereClause.status = filters.status;
            }

            if (filters.consumerNumber) {
                whereClause.consumer = {
                    consumerNumber: {
                        contains: filters.consumerNumber,
                        mode: 'insensitive'
                    }
                };
            }

            if (filters.billNumber) {
                whereClause.billNumber = {
                    contains: filters.billNumber,
                    mode: 'insensitive'
                };
            }

            const totalCount = await prisma.bill.count({
                where: whereClause
            });

            const bills = await prisma.bill.findMany({
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
                    meter: {
                        select: {
                            serialNumber: true,
                            type: true
                        }
                    },
                    payments: true
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            });

            const billingData = bills.map(bill => {
                const totalAmount = Number(bill.totalAmount || 0);
                const paidAmount = bill.payments.reduce((sum, payment) => 
                    sum + Number(payment.amount || 0), 0);
                const outstandingAmount = totalAmount - paidAmount;
                
                let daysOverdue = 0;
                if (bill.dueDate && outstandingAmount > 0) {
                    const dueDate = new Date(bill.dueDate);
                    const today = new Date();
                    daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
                }

                return {
                    id: bill.id,
                    billNumber: bill.billNumber,
                    consumerNumber: bill.consumer?.consumerNumber,
                    consumerName: bill.consumer?.name,
                    consumerPhone: bill.consumer?.primaryPhone,
                    consumerEmail: bill.consumer?.email,
                    meterSerial: bill.meter?.serialNumber,
                    meterType: bill.meter?.type,
                    billingPeriod: `${bill.billMonth}/${bill.billYear}`,
                    dueDate: bill.dueDate,
                    totalAmount,
                    paidAmount,
                    outstandingAmount,
                    status: bill.status,
                    daysOverdue,
                    createdAt: bill.createdAt,
                    updatedAt: bill.updatedAt
                };
            });

            const totalPages = Math.ceil(totalCount / limit);

            const result = {
                data: billingData,
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
            console.error('BillingDB.getPostpaidBillingTable: Database error:', error);
            throw error;
        }
    }

    static async getBillById(billId) {
        try {
            return await prisma.bill.findUnique({
                where: { id: billId },
                include: {
                    consumer: {
                        include: {
                            location: true
                        }
                    },
                    meter: {
                        include: {
                            location: true,
                            dtr: true
                        }
                    },
                    payments: true
                }
            });
        } catch (error) {
            console.error('BillingDB.getBillById: Database error:', error);
            throw error;
        }
    }

    static async getBillsByConsumerId(consumerId) {
        try {
            return await prisma.bill.findMany({
                where: { consumerId },
                include: {
                    meter: {
                        select: {
                            serialNumber: true,
                            type: true
                        }
                    },
                    payments: true
                },
                orderBy: { createdAt: 'desc' }
            });
        } catch (error) {
            console.error('BillingDB.getBillsByConsumerId: Database error:', error);
            throw error;
        }
    }

    static async getLastBillByConsumerId(consumerId) {
        try {
            return await prisma.bill.findFirst({
                where: { consumerId },
                include: {
                    meter: {
                        select: {
                            serialNumber: true,
                            type: true
                        }
                    },
                    payments: true
                },
                orderBy: { createdAt: 'desc' }
            });
        } catch (error) {
            console.error('BillingDB.getLastBillByConsumerId: Database error:', error);
            throw error;
        }
    }

    static async updateBillStatus(billId, status) {
        try {
            return await prisma.bill.update({
                where: { id: billId },
                data: { 
                    status,
                    updatedAt: new Date()
                }
            });
        } catch (error) {
            console.error('BillingDB.updateBillStatus: Database error:', error);
            throw error;
        }
    }

    static async createBill(billData) {
        try {
            return await prisma.bill.create({
                data: billData,
                include: {
                    consumer: true,
                    meter: true
                }
            });
        } catch (error) {
            console.error('BillingDB.createBill: Database error:', error);
            throw error;
        }
    }
}

export default BillingDB; 