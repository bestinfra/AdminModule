import { PrismaClient } from '@prisma/client';
import { getDateInYMDFormat } from '../utils/utils.js';

const prisma = new PrismaClient();

class TicketDB {
    static async getTicketStats() {
        try {            
            const tickets = await prisma.ticket.findMany({
                select: {
                    status: true
                }
            });

            const totalTickets = tickets.length;
            const openCount = tickets.filter(ticket => ticket.status === 'OPEN').length;
            const inProgressCount = tickets.filter(ticket => ticket.status === 'IN_PROGRESS').length;
            const resolvedCount = tickets.filter(ticket => ticket.status === 'RESOLVED').length;
            const closedCount = tickets.filter(ticket => ticket.status === 'CLOSED').length;

            const stats = {
                total: totalTickets,
                open: openCount,
                inProgress: inProgressCount,
                resolved: resolvedCount,
                closed: closedCount
            };
            
            return stats;
        } catch (error) {
            console.error(' TicketDB.getTicketStats: Database error:', error);
            throw error;
        }
    }

    static async getTicketsTable(page = 1, limit = 10, filters = {}) {
        try {
            
            const skip = (page - 1) * limit;
            
            const whereClause = {};

            if (filters.status) {
                whereClause.status = filters.status;
            }

            if (filters.type) {
                whereClause.type = filters.type;
            }

            if (filters.category) {
                whereClause.category = filters.category;
            }

            if (filters.priority) {
                whereClause.priority = filters.priority;
            }

            if (filters.consumerNumber) {
                whereClause.consumer = {
                    consumerNumber: {
                        contains: filters.consumerNumber,
                        mode: 'insensitive'
                    }
                };
            }

            if (filters.ticketNumber) {
                whereClause.ticketNumber = {
                    contains: filters.ticketNumber,
                    mode: 'insensitive'
                };
            }

            const totalCount = await prisma.ticket.count({
                where: whereClause
            });

            const tickets = await prisma.ticket.findMany({
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
                    raisedBy: {
                        select: {
                            username: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    },
                    assignedTo: {
                        select: {
                            username: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            });

            const ticketData = tickets.map(ticket => ({
                id: ticket.id,
                ticketNumber: ticket.ticketNumber,
                subject: ticket.subject,
                description: ticket.description,
                type: ticket.type,
                category: ticket.category,
                priority: ticket.priority,
                status: ticket.status,
                resolution: ticket.resolution,
                consumerNumber: ticket.consumer?.consumerNumber,
                consumerName: ticket.consumer?.name,
                consumerPhone: ticket.consumer?.primaryPhone,
                consumerEmail: ticket.consumer?.email,
                raisedBy: ticket.raisedBy ? `${ticket.raisedBy.firstName} ${ticket.raisedBy.lastName}` : null,
                assignedTo: ticket.assignedTo ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}` : null,
                createdAt: ticket.createdAt,
                updatedAt: ticket.updatedAt
            }));

            const totalPages = Math.ceil(totalCount / limit);

            const result = {
                data: ticketData,
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
            console.error(' TicketDB.getTicketsTable: Database error:', error);
            throw error;
        }
    }

    static async getLastTwelveMonthsTrends() {
        try {
            const today = new Date();
            const months = [];
            for (let i = 0; i < 12; i++) {
                const date = new Date(today.getFullYear(), today.getMonth() - 11 + i, 1);
                months.push({
                    month: getDateInYMDFormat(date).slice(0, 7)
                });
            }

            const startMonth = new Date(today.getFullYear(), today.getMonth() - 11, 1);
            const endMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

            const tickets = await prisma.ticket.findMany({
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
                const monthTickets = tickets.filter(ticket => {
                    const ticketMonth = getDateInYMDFormat(ticket.createdAt).slice(0, 7);
                    return ticketMonth === monthData.month;
                });

                return {
                    month: monthData.month,
                    open_count: monthTickets.filter(t => t.status === 'OPEN').length,
                    in_progress_count: monthTickets.filter(t => t.status === 'IN_PROGRESS').length,
                    resolved_count: monthTickets.filter(t => t.status === 'RESOLVED').length,
                    closed_count: monthTickets.filter(t => t.status === 'CLOSED').length
                };
            });
            
            return trendsData;
        } catch (error) {
            console.error(' TicketDB.getLastTwelveMonthsTrends: Database error:', error);
            throw error;
        }
    }

    static async getTicketById(ticketId) {
        try {
            return await prisma.ticket.findUnique({
                where: { id: ticketId },
                include: {
                    consumer: {
                        include: {
                            location: true
                        }
                    },
                    raisedBy: {
                        select: {
                            username: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    },
                    assignedTo: {
                        select: {
                            username: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                }
            });
        } catch (error) {
            console.error(' TicketDB.getTicketById: Database error:', error);
            throw error;
        }
    }

    static async getTicketsByConsumerId(consumerId) {
        try {
            return await prisma.ticket.findMany({
                where: { consumerId },
                include: {
                    raisedBy: {
                        select: {
                            username: true,
                            firstName: true,
                            lastName: true
                        }
                    },
                    assignedTo: {
                        select: {
                            username: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
        } catch (error) {
            console.error(' TicketDB.getTicketsByConsumerId: Database error:', error);
            throw error;
        }
    }

    static async updateTicketStatus(ticketId, status) {
        try {
            return await prisma.ticket.update({
                where: { id: ticketId },
                data: { 
                    status,
                    updatedAt: new Date()
                }
            });
        } catch (error) {
            console.error(' TicketDB.updateTicketStatus: Database error:', error);
            throw error;
        }
    }

    static async assignTicket(ticketId, assignedToId) {
        try {
            return await prisma.ticket.update({
                where: { id: ticketId },
                data: { 
                    assignedToId,
                    updatedAt: new Date()
                }
            });
        } catch (error) {
            console.error(' TicketDB.assignTicket: Database error:', error);
            throw error;
        }
    }

    static async createTicket(ticketData) {
        try {
            return await prisma.ticket.create({
                data: ticketData,
                include: {
                    consumer: true,
                    raisedBy: true
                }
            });
        } catch (error) {
            console.error(' TicketDB.createTicket: Database error:', error);
            throw error;
        }
    }

    
}

export default TicketDB; 