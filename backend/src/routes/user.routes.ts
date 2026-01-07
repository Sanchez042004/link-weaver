import { Router } from 'express';
import { userController } from '@/container';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();

// GET /api/users/profile
router.get('/profile', authenticate, userController.getProfile);

// DELETE /api/users/me
router.delete('/me', authenticate, userController.deleteAccount);

export const userRoutes = router;
