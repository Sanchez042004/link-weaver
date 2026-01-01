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
}
