import { Router } from 'express';
import { userController } from '@/container';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();

// GET /api/users/profile
router.get('/profile', authenticate, userController.getProfile);

export const userRoutes = router;
