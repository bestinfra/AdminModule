import { PrismaClient } from '@prisma/client';
import { getDateInYMDFormat } from '../utils/utils.js';

const prisma = new PrismaClient();

class TicketDB {
    static async getTicketStats() {
        try {            
            const tickets = await prisma.tickets.findMany({
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

            if (filters.dtrNumber) {
                whereClause.dtrs = {
                    dtrNumber: {
                        contains: filters.dtrNumber,
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

            const totalCount = await prisma.tickets.count({
                where: whereClause
            });

            const tickets = await prisma.tickets.findMany({
                where: whereClause,
                include: {
                    dtrs: {
                        select: {
                            dtrNumber: true,
                            serialNumber: true,
                            locations: {
                                select: {
                                    name: true,
                                    address: true
                                }
                            },
                            meters: {
                                select: {
                                    meterNumber: true,
                                    serialNumber: true,
                                    manufacturer: true,
                                    model: true,
                                    type: true,
                                    status: true
                                }
                            }
                        }
                    },
                    users_tickets_raisedByIdTousers: {
                        select: {
                            username: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    },
                    users_tickets_assignedToIdTousers: {
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
                dtrNumber: ticket.dtrs?.dtrNumber || 'NA',
                dtrSerialNumber: ticket.dtrs?.serialNumber || 'NA',
                locationName: ticket.dtrs?.locations?.name || 'NA',
                locationAddress: ticket.dtrs?.locations?.address || 'NA',
                // Get connected meters information
                connectedMeters: ticket.dtrs?.meters?.map(meter => ({
                    meterNumber: meter.meterNumber,
                    serialNumber: meter.serialNumber,
                    manufacturer: meter.manufacturer,
                    model: meter.model,
                    type: meter.type,
                    status: meter.status
                })) || [],
                meterCount: ticket.dtrs?.meters?.length || 0,
                raisedBy: ticket.users_tickets_raisedByIdTousers ? `${ticket.users_tickets_raisedByIdTousers.firstName} ${ticket.users_tickets_raisedByIdTousers.lastName}` : null,
                assignedTo: ticket.users_tickets_assignedToIdTousers ? `${ticket.users_tickets_assignedToIdTousers.firstName} ${ticket.users_tickets_assignedToIdTousers.lastName}` : null,
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

            const tickets = await prisma.tickets.findMany({
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
            const ticket = await prisma.tickets.findUnique({
                where: { id: ticketId },
                include: {
                    dtrs: {
                        include: {
                            locations: true,
                            meters: {
                                include: {
                                    locations: true
                                }
                            }
                        }
                    },
                    users_tickets_raisedByIdTousers: {
                        select: {
                            username: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    },
                    users_tickets_assignedToIdTousers: {
                        select: {
                            username: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                }
            });

            if (!ticket) {
                return null;
            }

            // Map the data similar to getTicketsTable
            const raisedBy = ticket.users_tickets_raisedByIdTousers;
            const assignedTo = ticket.users_tickets_assignedToIdTousers;
            const dtr = ticket.dtrs;
            const location = dtr?.locations?.name ?? dtr?.locations?.address;
            const firstMeter = Array.isArray(dtr?.meters) && dtr.meters.length > 0 ? dtr.meters[0] : undefined;
            const meterNumber = firstMeter?.meterNumber ?? firstMeter?.serialNumber;
            const connectionType = firstMeter?.type ?? dtr?.type;

            const mappedTicket = {
                id: ticket.id,
                ticketNumber: ticket.ticketNumber,
                subject: ticket.subject,
                description: ticket.description,
                type: ticket.type,
                category: ticket.category,
                priority: ticket.priority,
                status: ticket.status,
                resolution: ticket.resolution,
                dtrNumber: dtr?.dtrNumber || 'NA',
                dtrSerialNumber: dtr?.serialNumber || 'NA',
                locationName: dtr?.locations?.name || 'NA',
                locationAddress: dtr?.locations?.address || 'NA',
                // Get connected meters information
                connectedMeters: dtr?.meters?.map(meter => ({
                    meterNumber: meter.meterNumber,
                    serialNumber: meter.serialNumber,
                    manufacturer: meter.manufacturer,
                    model: meter.model,
                    type: meter.type,
                    status: meter.status
                })) || [],
                meterCount: dtr?.meters?.length || 0,
                raisedBy: raisedBy ? `${raisedBy.firstName} ${raisedBy.lastName}` : null,
                assignedTo: assignedTo ? `${assignedTo.firstName} ${assignedTo.lastName}` : null,
                raisedByEmail: raisedBy?.email || null,
                assignedToEmail: assignedTo?.email || null,
                createdAt: ticket.createdAt,
                updatedAt: ticket.updatedAt
            };

            return mappedTicket;
        } catch (error) {
            console.error(' TicketDB.getTicketById: Database error:', error);
            throw error;
        }
    }

    static async getTicketsByDtrId(dtrId) {
        try {
            return await prisma.tickets.findMany({
                where: { dtrId },
                include: {
                    users_raisedBy: {
                        select: {
                            username: true,
                            firstName: true,
                            lastName: true
                        }
                    },
                    users_assignedTo: {
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
            console.error(' TicketDB.getTicketsByDtrId: Database error:', error);
            throw error;
        }
    }

    static async updateTicketStatus(ticketId, status) {
        try {
            return await prisma.tickets.update({
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
            return await prisma.tickets.update({
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
            return await prisma.tickets.create({
                data: ticketData,
                include: {
                    dtrs: true,
                    users_raisedBy: true
                }
            });
        } catch (error) {
            console.error(' TicketDB.createTicket: Database error:', error);
            throw error;
        }
    }

    
}

export default TicketDB; 