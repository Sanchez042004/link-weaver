import { Router } from 'express';
import { AuthController } from '@/controllers/auth.controller';

const router = Router();

// Rutas públicas
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

export const authRoutes = router;
