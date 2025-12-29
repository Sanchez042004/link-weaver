import { Router } from 'express';
import { AuthController } from '@/controllers/auth.controller';
import { authLimiter } from '@/middlewares/rate-limit.middleware';

const router = Router();

// Rutas públicas
router.post('/register', authLimiter, AuthController.register);
router.post('/login', authLimiter, AuthController.login);

export const authRoutes = router;
