import { NextFunction, Request, Response } from 'express';
import { UserService } from '@/services/user.service';

export class UserController {
    constructor(private readonly userService: UserService) { }

    /**
     * Get authenticated user profile
     */
    public getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!.userId;
            const user = await this.userService.getUserById(userId);

            res.status(200).json({
                success: true,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete account
     */
    public deleteAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!.userId;
            await this.userService.deleteUser(userId);

            res.status(200).json({
                success: true,
                message: 'Account deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}
