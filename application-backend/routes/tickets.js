import express from 'express';
import { getTicketStats, getTicketsTable, getTicketTrends, getTicketById, updateTicketStatus, assignTicket, createTicket, getDtrDetails } from '../controllers/ticketController.js';
import { validateTicketData, createTicketSchema, updateTicketStatusSchema, assignTicketSchema } from '../validations/ticketValidation.js';
import { populateUserFromCookies } from '../utils/cookieUtils.js';


const router = express.Router();

router.use(populateUserFromCookies);


router.get('/stats', getTicketStats);
router.get('/table', getTicketsTable);
router.get('/trends', getTicketTrends);
router.get('/dtr/:dtrNumber', getDtrDetails);
router.get('/:id', getTicketById);
router.post('/', validateTicketData(createTicketSchema), createTicket);
router.put('/:id/status', validateTicketData(updateTicketStatusSchema), updateTicketStatus);
router.put('/:id/assign', validateTicketData(assignTicketSchema), assignTicket);

export default router; 