import { Router } from 'express';
import { UrlController } from '@/controllers/url.controller';
import { optionalAuthenticate } from '@/middlewares/optional-auth.middleware';

const router = Router();

// POST /api/urls - Crear URL corta (pública o autenticada)
router.post('/', optionalAuthenticate, UrlController.createShortUrl);

export const urlRoutes = router;
