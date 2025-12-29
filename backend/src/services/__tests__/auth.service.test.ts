import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../auth.service';
import { prisma } from '@/config/database';
import { DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock Modules
vi.mock('@/config/database', async () => {
    const { mockDeep } = await import('vitest-mock-extended');
    return {
        prisma: mockDeep<PrismaClient>(),
    };
});

vi.mock('bcrypt');
vi.mock('jsonwebtoken');

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('AuthService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            // Arrange
            const email = 'test@example.com';
            const password = 'password123';
            const name = 'Test User';
            const hashedPassword = 'hashedPassword';
            const userId = 'user-uuid';
            const token = 'jwt-token';

            prismaMock.user.findUnique.mockResolvedValue(null);
            (bcrypt.hash as any).mockResolvedValue(hashedPassword);
            prismaMock.user.create.mockResolvedValue({
                id: userId,
                email,
                password: hashedPassword,
                name,
                createdAt: new Date(),
                updatedAt: new Date(),
            } as any);
            (jwt.sign as any).mockReturnValue(token);

            // Act
            const result = await AuthService.register(email, password, name);

            // Assert
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email } });
            expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
            expect(prismaMock.user.create).toHaveBeenCalledWith({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                },
            });
            expect(result).toEqual({
                token,
                user: {
                    id: userId,
                    email,
                    name,
                },
            });
        });

        it('should throw error if user already exists', async () => {
            // Arrange
            const email = 'test@example.com';
            prismaMock.user.findUnique.mockResolvedValue({ id: 'existing' } as any);

            // Act & Assert
            await expect(AuthService.register(email, 'pass')).rejects.toThrow('El usuario ya existe');
        });
    });

    describe('login', () => {
        it('should login successfully with valid credentials', async () => {
            // Arrange
            const email = 'test@example.com';
            const password = 'password123';
            const hashedPassword = 'hashedPassword';
            const user = {
                id: 'user-id',
                email,
                password: hashedPassword,
                name: 'Test',
            };
            const token = 'jwt-token';

            prismaMock.user.findUnique.mockResolvedValue(user as any);
            (bcrypt.compare as any).mockResolvedValue(true);
            (jwt.sign as any).mockReturnValue(token);

            // Act
            const result = await AuthService.login(email, password);

            // Assert
            expect(result.token).toBe(token);
            expect(result.user.email).toBe(email);
        });

        it('should throw error if user not found', async () => {
            // Arrange
            prismaMock.user.findUnique.mockResolvedValue(null);

            // Act & Assert
            await expect(AuthService.login('wrong@email.com', 'pass')).rejects.toThrow('Credenciales inválidas');
        });

        it('should throw error if password is invalid', async () => {
            // Arrange
            const user = {
                id: 'user-id',
                email: 'test@example.com',
                password: 'hash',
            };
            prismaMock.user.findUnique.mockResolvedValue(user as any);
            (bcrypt.compare as any).mockResolvedValue(false);

            // Act & Assert
            await expect(AuthService.login(user.email, 'wrongpass')).rejects.toThrow('Credenciales inválidas');
        });
    });
});
