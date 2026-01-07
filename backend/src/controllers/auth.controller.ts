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
    email: z.string().email('Email inválido'),
    password: z.string(),
});

const forgotPasswordSchema = z.object({
    email: z.string().email('Email inválido'),
});

const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token requerido'),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/[0-9]/, 'Debe contener al menos un número')
        .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
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

    /**
     * Verify Email Endpoint
     */
    public verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { token } = req.query;

            if (!token || typeof token !== 'string') {
                throw new BadRequestError('Token de verificación requerido');
            }

            await this.authService.verifyEmail(token);

            res.status(200).json({
                success: true,
                message: 'Email verificado correctamente',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Forgot Password Endpoint
     */
    public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const validation = forgotPasswordSchema.safeParse(req.body);

            if (!validation.success) {
                throw new BadRequestError('Email inválido');
            }

            await this.authService.requestPasswordReset(validation.data.email);

            res.status(200).json({
                success: true,
                message: 'Si el email existe, se ha enviado un enlace de recuperación',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Reset Password Endpoint
     */
    public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const validation = resetPasswordSchema.safeParse(req.body);

            if (!validation.success) {
                const errorMessage = validation.error.issues.map(i => i.message).join(', ');
                throw new BadRequestError(errorMessage);
            }

            const { token, password } = validation.data;

            await this.authService.resetPassword(token, password);

            res.status(200).json({
                success: true,
                message: 'Contraseña restablecida correctamente',
            });
        } catch (error) {
            next(error);
        }
    }
}
