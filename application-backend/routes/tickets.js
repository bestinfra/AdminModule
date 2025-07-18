import express from 'express';
import {
    getTicketStats,
    getTicketsTable,
    getTicketTrends,
    getTicketById,
    getTicketsByConsumerId,
    updateTicketStatus,
    assignTicket,
    createTicket
} from '../controllers/ticketController.js';

const router = express.Router();

router.get('/stats', getTicketStats);
router.get('/table', getTicketsTable);
router.get('/trends', getTicketTrends);
router.get('/:id', getTicketById);
router.get('/consumer/:consumerId', getTicketsByConsumerId);
router.patch('/:id/status', updateTicketStatus);
router.patch('/:id/assign', assignTicket);
router.post('/', createTicket);

export default router; 