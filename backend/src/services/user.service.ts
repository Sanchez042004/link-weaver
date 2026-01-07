import { UserRepository } from '@/repositories/user.repository';
import { NotFoundError } from '@/errors';

export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    /**
     * Get user by ID (without password)
     */
    public async getUserById(userId: string) {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new NotFoundError('Usuario no encontrado');
        }

        // Exclude password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;

        return userWithoutPassword;
    }

    /**
     * Delete user account
     */
    public async deleteUser(userId: string) {
        // Prisma will handle cascading deletes if configured in schema
        // (Assuming CASCADE is set for urls and clicks)
        return this.userRepository.delete(userId);
    }
}
