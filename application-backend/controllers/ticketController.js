import TicketDB from '../models/TicketDB.js';
import { getDateTime } from '../utils/utils.js';

export const getTicketStats = async (req, res) => {
    try {
        const stats = await TicketDB.getTicketStats();
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error(' getTicketStats: Error fetching ticket stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch ticket statistics',
            error: error.message
        });
    }
};

export const getTicketsTable = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const filters = {
            status: req.query.status,
            type: req.query.type,
            category: req.query.category,
            priority: req.query.priority,
            consumerNumber: req.query.consumerNumber,
            ticketNumber: req.query.ticketNumber
        };

        const ticketsData = await TicketDB.getTicketsTable(page, limit, filters);
        
        res.json({
            success: true,
            data: ticketsData
        });
    } catch (error) {
        console.error(' getTicketsTable: Error fetching tickets table:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tickets table',
            error: error.message
        });
    }
};

export const getTicketTrends = async (req, res) => {
    try {
        const accessCondition = req.locationMeters?.condition || '';
        const accessValues = req.locationMeters?.values || [];

        const trendsData = await TicketDB.getLastTwelveMonthsTrends(
            accessCondition,
            accessValues
        );

        const formattedData = trendsData.map(row => ({
            month: row.month,
            open_count: parseInt(row.open_count),
            in_progress_count: parseInt(row.in_progress_count),
            resolved_count: parseInt(row.resolved_count),
            closed_count: parseInt(row.closed_count)
        }));

        const result = {
            xAxisData: formattedData.map((row) => row.month),
            seriesData: [
                {
                    name: 'Open',
                    data: formattedData.map((row) => row.open_count),
                },
                {
                    name: 'In Progress',
                    data: formattedData.map((row) => row.in_progress_count),
                },
                {
                    name: 'Resolved',
                    data: formattedData.map((row) => row.resolved_count),
                },
                {
                    name: 'Closed',
                    data: formattedData.map((row) => row.closed_count),
                },
            ],
        };

        res.status(200).json({
            status: 'success',
            data: result,
        });
    } catch (error) {
        console.error(' getTicketTrends: Error fetching ticket trends:', {
            error: error.message,
            stack: error.stack,
            timestamp: getDateTime(),
        });
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            errorId: error.code || 'INTERNAL_SERVER_ERROR',
        });
    }
};

export const getTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await TicketDB.getTicketById(parseInt(id));
        
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        res.json({
            success: true,
            data: ticket
        });
    } catch (error) {
        console.error(' getTicketById: Error fetching ticket:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch ticket',
            error: error.message
        });
    }
};

export const getTicketsByConsumerId = async (req, res) => {
    try {
        const { consumerId } = req.params;
        const tickets = await TicketDB.getTicketsByConsumerId(parseInt(consumerId));
        
        res.json({
            success: true,
            data: tickets
        });
    } catch (error) {
        console.error(' getTicketsByConsumerId: Error fetching consumer tickets:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch consumer tickets',
            error: error.message
        });
    }
};

export const updateTicketStatus = async (req, res) => {
    try {
        const { id } = req.params;
        // Use validated data from middleware
        const { status } = req.validatedData;

        const updatedTicket = await TicketDB.updateTicketStatus(parseInt(id), status);
        
        res.json({
            success: true,
            data: updatedTicket
        });
    } catch (error) {
        console.error(' updateTicketStatus: Error updating ticket status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update ticket status',
            error: error.message
        });
    }
};

export const assignTicket = async (req, res) => {
    try {
        const { id } = req.params;
        // Use validated data from middleware
        const { assignedToId } = req.validatedData;

        const updatedTicket = await TicketDB.assignTicket(parseInt(id), parseInt(assignedToId));
        
        res.json({
            success: true,
            data: updatedTicket
        });
    } catch (error) {
        console.error(' assignTicket: Error assigning ticket:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to assign ticket',
            error: error.message
        });
    }
};

export const createTicket = async (req, res) => {
    try {
        // Use validated data from middleware
        const ticketData = req.validatedData;

        const newTicket = await TicketDB.createTicket(ticketData);
        
        res.status(201).json({
            success: true,
            data: newTicket
        });
    } catch (error) {
        console.error(' createTicket: Error creating ticket:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create ticket',
            error: error.message
        });
    }
}; 

