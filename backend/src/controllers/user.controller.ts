import { Request, Response } from 'express';
import { UserService } from '@/services/user.service';
import { Logger } from '@/config/logger';

export class UserController {
    /**
     * Obtener perfil del usuario autenticado
     */
    public static async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const user = await UserService.getUserById(userId);

            res.status(200).json({
                success: true,
                data: user,
            });
        } catch (error) {
            if (error instanceof Error && error.message === 'Usuario no encontrado') {
                res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado',
                });
                return;
            }

            Logger.error('Error obteniendo perfil:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
            });
        }
    }
}
