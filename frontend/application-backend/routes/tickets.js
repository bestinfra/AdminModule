import express from 'express';
import { getTicketStats, getTicketsTable, getTicketTrends, getTicketById, getTicketsByConsumerId, updateTicketStatus, assignTicket, createTicket } from '../controllers/ticketController.js';
import { validateTicketData, createTicketSchema, updateTicketStatusSchema, assignTicketSchema } from '../validations/ticketValidation.js';

const router = express.Router();

router.get('/stats', getTicketStats);
router.get('/table', getTicketsTable);
router.get('/trends', getTicketTrends);
router.get('/:id', getTicketById);
router.get('/consumer/:consumerId', getTicketsByConsumerId);
router.post('/', validateTicketData(createTicketSchema), createTicket);
router.put('/:id/status', validateTicketData(updateTicketStatusSchema), updateTicketStatus);
router.put('/:id/assign', validateTicketData(assignTicketSchema), assignTicket);

export default router; 