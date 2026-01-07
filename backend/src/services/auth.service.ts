import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '@/config/env';
import { JwtPayload, AuthResponse } from '@/types/auth.types';
import { UserRepository } from '@/repositories/user.repository';
import { ConflictError, UnauthorizedError, BadRequestError } from '@/errors';
import { emailService } from './email.service';

export class AuthService {
    private readonly SALT_ROUNDS = 10;

    constructor(
        private readonly userRepository: UserRepository
    ) { }

    /**
     * Register new user
     */
    public async register(email: string, password: string, name?: string): Promise<AuthResponse> {
        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Check availability
        const existingUser = await this.userRepository.findByEmail(normalizedEmail);

        if (existingUser) {
            // Si el usuario ya está verificado, no permitimos re-registro
            if (existingUser.isVerified) {
                throw new ConflictError('El usuario ya existe');
            }

            // Si el usuario NO está verificado, verificamos si su token de registro expiró
            if (existingUser.verificationTokenExpires && existingUser.verificationTokenExpires < new Date()) {
                // El token expiró, eliminamos el registro anterior para permitir la nueva creación
                console.log(`🗑️ Eliminando usuario no verificado con token expirado: ${normalizedEmail}`);
                await this.userRepository.delete(existingUser.id);
            } else {
                // El usuario existe, no está verificado pero el token aún es válido
                throw new ConflictError('Ya existe una cuenta pendiente de verificación con este email');
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

        // Create user
        const user = await this.userRepository.create({
            email: normalizedEmail,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpires,
            isVerified: false,
        });

        // Send verification email (don't await to not block registration response, or await if you want to be sure)
        // For link-weaver, we'll try to send it but not block the user if it fails (just log it)
        try {
            await emailService.sendVerificationEmail(user.email, user.name || '', verificationToken);
        } catch (error) {
            console.error('⚠️ Falló el envío del email de bienvenida:', error);
        }

        // Generate token
        const token = this.generateToken({
            userId: user.id,
            email: user.email,
        });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }

    /**
     * Login
     */
    public async login(email: string, password: string): Promise<AuthResponse> {
        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Find user
        const user = await this.userRepository.findByEmail(normalizedEmail);

        if (!user) {
            throw new UnauthorizedError('Usuario o contraseña inválidos');
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            throw new UnauthorizedError('Usuario o contraseña inválidos');
        }

        // Check if verified
        if (!user.isVerified) {
            // En desarrollo podríamos ser más flexibles, pero el usuario pidió implementarlo
            // así que lo activamos para todos los entornos o según NODE_ENV.
            // Para cumplir con lo solicitado:
            throw new UnauthorizedError('Por favor verifica tu email antes de iniciar sesión');
        }

        // Generate token
        const token = this.generateToken({
            userId: user.id,
            email: user.email,
        });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }

    /**
     * Verify email
     */
    public async verifyEmail(token: string): Promise<void> {
        const user = await this.userRepository.findByVerificationToken(token);

        if (!user) {
            throw new BadRequestError('Token de verificación inválido');
        }

        if (user.verificationTokenExpires && user.verificationTokenExpires < new Date()) {
            throw new BadRequestError('El token de verificación ha expirado. Por favor, crea tu cuenta de nuevo.');
        }

        await this.userRepository.update(user.id, {
            isVerified: true,
            verificationToken: null,
            verificationTokenExpires: null,
        });
    }

    /**
     * Request password reset
     */
    public async requestPasswordReset(email: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email.toLowerCase().trim());

        if (!user) {
            // Por seguridad, no decimos si el email existe o no
            return;
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hora

        await this.userRepository.update(user.id, {
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetExpires,
        });

        await emailService.sendPasswordResetEmail(user.email, user.name || '', resetToken);
    }

    /**
     * Reset password
     */
    public async resetPassword(token: string, newPassword: string): Promise<void> {
        const user = await this.userRepository.findByResetToken(token);

        if (!user) {
            throw new BadRequestError('Token de recuperación inválido');
        }

        if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
            throw new BadRequestError('El token de recuperación ha expirado');
        }

        const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

        await this.userRepository.update(user.id, {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        });
    }

    /**
     * Generate JWT Token
     */
    private generateToken(payload: JwtPayload): string {
        return jwt.sign(payload, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
        });
    }

    /**
     * Verify JWT Token (Public static or helper usually, used in middleware)
     * If middleware uses it, it might be better to keep it static or move to a JwtUtil.
     * The middleware imports verifyToken. I should probably keep it static or move independent logic.
     * But since I am refactoring AuthService to be an instance, I should decide.
     * Middleware `auth.middleware` likely uses `AuthService.verifyToken`.
     */
    public static verifyToken(token: string): JwtPayload {
        return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    }
}
