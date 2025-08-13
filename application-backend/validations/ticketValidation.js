import { z } from 'zod';

// Ticket validation schema
export const createTicketSchema = z.object({
    subject: z.string().min(1, 'Subject is required').max(255, 'Subject must be less than 255 characters'),
    description: z.string().min(1, 'Description is required'),
    type: z.enum(['COMPLAINT', 'SERVICE_REQUEST', 'INQUIRY'], {
        errorMap: () => ({ message: 'Type must be one of: COMPLAINT, SERVICE_REQUEST, INQUIRY' })
    }),
    category: z.enum(['BILLING', 'METER', 'CONNECTION', 'TECHNICAL', 'OTHER'], {
        errorMap: () => ({ message: 'Category must be one of: BILLING, METER, CONNECTION, TECHNICAL, OTHER' })
    }),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
        errorMap: () => ({ message: 'Priority must be one of: LOW, MEDIUM, HIGH, URGENT' })
    }).optional().default('MEDIUM'),
    dtrId: z.number().positive('DTR ID must be a positive number').optional(),
    assignedToId: z.number().positive('Assigned to ID must be a positive number').optional(),
    status: z.enum(['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], {
        errorMap: () => ({ message: 'Status must be one of: OPEN, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED' })
    }).optional().default('OPEN'),
    attachments: z.array(z.string().url('Attachment must be a valid URL')).optional()
});

// Update ticket status schema
export const updateTicketStatusSchema = z.object({
    status: z.enum(['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], {
        errorMap: () => ({ message: 'Status must be one of: OPEN, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED' })
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
            console.log('=== TICKET VALIDATION START ===');
            console.log('Request body:', req.body);
            console.log('Validation schema:', schema.description || 'No description');
            
            const validatedData = schema.parse(req.body);
            console.log('✅ Validation successful:', validatedData);
            
            req.validatedData = validatedData;
            console.log('=== TICKET VALIDATION END ===');
            next();
        } catch (error) {
            console.log('❌ TICKET VALIDATION FAILED ===');
            if (error instanceof z.ZodError) {
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                
                console.log('Validation errors:', errors);
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors
                });
            }
            
            console.log('Non-validation error:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Validation error',
                error: error.message
            });
        }
    };
}; 