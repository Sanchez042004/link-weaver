import { Router } from 'express';
import { AnalyticsController } from '@/controllers/analytics.controller';
import { optionalAuthenticate } from '@/middlewares/optional-auth.middleware';

const router = Router();

// GET /api/analytics/:alias
router.get('/:alias', optionalAuthenticate, AnalyticsController.getStats);

export const analyticsRoutes = router;
