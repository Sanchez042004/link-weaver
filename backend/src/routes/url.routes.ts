import { Router } from 'express';
import { UrlController } from '@/controllers/url.controller';
import { optionalAuthenticate } from '@/middlewares/optional-auth.middleware';

const router = Router();

import { authenticate } from '@/middlewares/auth.middleware';

// POST /api/urls - Crear URL corta (pública o autenticada)
router.post('/', optionalAuthenticate, UrlController.createShortUrl);

// GET /api/urls - Listar mis URLs (Requiere Auth)
router.get('/', authenticate, UrlController.getMyUrls);

// DELETE /api/urls/:id - Eliminar URL (Requiere Auth)
router.delete('/:id', authenticate, UrlController.deleteUrl);

export const urlRoutes = router;
