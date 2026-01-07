import { Router } from 'express';
import { urlController } from '@/container';
import { optionalAuthenticate } from '@/middlewares/optional-auth.middleware';
import { authenticate } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validate.middleware';
import { createUrlSchema, updateUrlSchema } from '@/schemas/url.schema';

const router = Router();

// POST /api/urls - Create short URL (public or authenticated)
router.post('/', optionalAuthenticate, validate(createUrlSchema), urlController.createShortUrl);

// GET /api/urls - List my URLs (Requires Auth)
router.get('/', authenticate, urlController.getMyUrls);

// DELETE /api/urls/:id - Delete URL (Requires Auth)
router.delete('/:id', authenticate, urlController.deleteUrl);

// PATCH /api/urls/:id - Update URL (Requires Auth)
router.patch('/:id', authenticate, validate(updateUrlSchema), urlController.updateUrl);

export const urlRoutes = router;
