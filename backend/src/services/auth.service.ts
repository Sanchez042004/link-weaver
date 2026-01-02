import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { JwtPayload, AuthResponse } from '@/types/auth.types';
import { UserRepository } from '@/repositories/user.repository';
import { ConflictError, UnauthorizedError } from '@/errors';

export class AuthService {
    private readonly SALT_ROUNDS = 10;

    constructor(private readonly userRepository: UserRepository) { }

    /**
     * Register new user
     */
    public async register(email: string, password: string, name?: string): Promise<AuthResponse> {
        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Check availability
        const existingUser = await this.userRepository.findByEmail(normalizedEmail);

        if (existingUser) {
            throw new ConflictError('El usuario ya existe');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

        // Create user
        const user = await this.userRepository.create({
            email: normalizedEmail,
            password: hashedPassword,
            name,
        });

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
