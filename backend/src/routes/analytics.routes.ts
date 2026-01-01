import { Router } from 'express';
import { analyticsController } from '@/container';
import { optionalAuthenticate } from '@/middlewares/optional-auth.middleware';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();

// GET /api/analytics (General stats for authenticated user)
router.get('/', authenticate, analyticsController.getGeneralStats);

// GET /api/analytics/:alias (Specific link stats)
router.get('/:alias', optionalAuthenticate, analyticsController.getStats);

export const analyticsRoutes = router;
