import { PrismaClient, User, Prisma } from '@prisma/client';

export class UserRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({ data });
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return this.prisma.user.update({ where: { id }, data });
    }

    async findByVerificationToken(token: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { verificationToken: token } });
    }

    async findByResetToken(token: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { resetPasswordToken: token } });
    }

    async delete(id: string): Promise<User> {
        return this.prisma.user.delete({ where: { id } });
    }
}
