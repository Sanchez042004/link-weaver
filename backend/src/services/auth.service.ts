import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@/config/database';
import { env } from '@/config/env';
import { JwtPayload, AuthResponse } from '@/types/auth.types';

export class AuthService {
    private static readonly SALT_ROUNDS = 10;

    /**
     * Generar hash de contraseña
     */
    public static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.SALT_ROUNDS);
    }

    /**
     * Verificar contraseña
     */
    public static async verifyPassword(plain: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plain, hashed);
    }

    /**
     * Generar JWT Token
     */
    public static generateToken(payload: JwtPayload): string {
        return jwt.sign(payload, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'], // Casting explícito
        });
    }

    /**
     * Verificar JWT Token
     */
    public static verifyToken(token: string): JwtPayload {
        return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    }

    /**
     * Registrar nuevo usuario
     */
    public static async register(email: string, password: string, name?: string): Promise<AuthResponse> {
        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error('El usuario ya existe');
        }

        // Hashear password
        const hashedPassword = await this.hashPassword(password);

        // Crear usuario
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        // Generar token
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
     * Iniciar sesión
     */
    public static async login(email: string, password: string): Promise<AuthResponse> {
        // Buscar usuario
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        // Verificar password
        const isValid = await this.verifyPassword(password, user.password);

        if (!isValid) {
            throw new Error('Credenciales inválidas');
        }

        // Generar token
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
}
