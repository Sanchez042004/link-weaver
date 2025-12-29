import { prisma } from '@/config/database';

export class UserService {
    /**
     * Obtener usuario por ID (sin password)
     */
    public static async getUserById(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        return user;
    }
}
