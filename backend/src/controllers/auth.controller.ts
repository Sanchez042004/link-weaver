import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from '@/services/auth.service';

// Schemas de validación
const registerSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    name: z.string().optional(),
});

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string(),
});

export class AuthController {
    /**
     * Endpoint de Registro
     */
    public static async register(req: Request, res: Response): Promise<void> {
        try {
            // Validar input
            const data = registerSchema.parse(req.body);

            // Ejecutar servicio
            const result = await AuthService.register(data.email, data.password, data.name);

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: result,
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Error de validación',
                    errors: error.issues, // Corregido: .issues en lugar de .errors
                });
                return;
            }

            if (error instanceof Error && error.message === 'El usuario ya existe') {
                res.status(409).json({
                    success: false,
                    message: error.message,
                });
                return;
            }

            console.error('Error en register:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
            });
        }
    }

    /**
     * Endpoint de Login
     */
    public static async login(req: Request, res: Response): Promise<void> {
        try {
            // Validar input
            const data = loginSchema.parse(req.body);

            // Ejecutar servicio
            const result = await AuthService.login(data.email, data.password);

            res.status(200).json({
                success: true,
                message: 'Login exitoso',
                data: result,
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Error de validación',
                    errors: error.issues, // Corregido: .issues en lugar de .errors
                });
                return;
            }

            if (error instanceof Error && error.message === 'Credenciales inválidas') {
                res.status(401).json({
                    success: false,
                    message: error.message,
                });
                return;
            }

            console.error('Error en login:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
            });
        }
    }
}
