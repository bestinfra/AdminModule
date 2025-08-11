import { z } from 'zod';

// Ticket validation schema
export const createTicketSchema = z.object({
    ticketNumber: z.string().min(1, 'Ticket number is required'),
    subject: z.string().min(1, 'Subject is required').max(255, 'Subject must be less than 255 characters'),
    description: z.string().min(1, 'Description is required'),
    type: z.string().min(1, 'Type is required'),
    category: z.string().min(1, 'Category is required'),
    priority: z.enum(['low', 'medium', 'high', 'critical']).optional().default('medium'),
    dtrId: z.number().positive('DTR ID must be a positive number').optional(),
    raisedById: z.number().positive('Raised by ID must be a positive number'),
    assignedToId: z.number().positive('Assigned to ID must be a positive number').optional(),
    status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional().default('open'),
    attachments: z.array(z.string().url('Attachment must be a valid URL')).optional()
});

// Update ticket status schema
export const updateTicketStatusSchema = z.object({
    status: z.enum(['open', 'in_progress', 'resolved', 'closed'], {
        errorMap: () => ({ message: 'Status must be one of: open, in_progress, resolved, closed' })
    })
});

// Assign ticket schema
export const assignTicketSchema = z.object({
    assignedToId: z.number().positive('Assigned to ID must be a positive number')
});

// Validation middleware
export const validateTicketData = (schema) => {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse(req.body);
            req.validatedData = validatedData;
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors
                });
            }
            
            return res.status(500).json({
                success: false,
                message: 'Validation error',
                error: error.message
            });
        }
    };
}; 