import { z } from 'zod';

// User validation schema
export const addUserSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be less than 50 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    firstName: z.string().min(1, 'First name is required').max(100, 'First name must be less than 100 characters'),
    lastName: z.string().min(1, 'Last name is required').max(100, 'Last name must be less than 100 characters'),
    phone: z.string().optional(),
    isActive: z.boolean().optional().default(true),
    roleId: z.number().optional()
});

// Assign roles validation schema
export const assignRolesSchema = z.object({
    roleId: z.number().min(1, 'Role ID is required')
});

// Validation middleware
export const validateUserData = (schema) => {
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