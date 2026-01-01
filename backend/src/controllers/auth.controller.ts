import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from '@/services/auth.service';
import { BadRequestError } from '@/errors';

// Schemas
const registerSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character (e.g. !@#$%)'),
    name: z.string().optional(),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string(),
});

export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * Register Endpoint
     */
    public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Validate input
            const validation = registerSchema.safeParse(req.body);

            if (!validation.success) {
                const errorMessage = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
                throw new BadRequestError(errorMessage);
            }

            const data = validation.data;

            // Execute service
            const result = await this.authService.register(data.email, data.password, data.name);

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Login Endpoint
     */
    public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Validate input
            const validation = loginSchema.safeParse(req.body);

            if (!validation.success) {
                const errorMessage = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
                throw new BadRequestError(errorMessage);
            }

            const data = validation.data;

            // Execute service
            const result = await this.authService.login(data.email, data.password);

            res.status(200).json({
                success: true,
                message: 'Login exitoso',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
}
