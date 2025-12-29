import { Router } from 'express';
import { UserController } from '@/controllers/user.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();

// GET /api/users/me - Perfil del usuario
router.get('/me', authenticate, UserController.getProfile);

export const userRoutes = router;
