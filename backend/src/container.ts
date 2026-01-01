import { prisma } from '@/config/database';
import { redisClient } from '@/config/redis';

import { UrlRepository } from '@/repositories/url.repository';
import { ClickRepository } from '@/repositories/click.repository';
import { UserRepository } from '@/repositories/user.repository';

import { UrlService } from '@/services/url.service';
import { AnalyticsService } from '@/services/analytics.service';
import { UserService } from '@/services/user.service';
import { AuthService } from '@/services/auth.service';

import { UrlController } from '@/controllers/url.controller';
import { RedirectController } from '@/controllers/redirect.controller';
import { AnalyticsController } from '@/controllers/analytics.controller';
import { UserController } from '@/controllers/user.controller';
import { AuthController } from '@/controllers/auth.controller';

// Repositories
const urlRepository = new UrlRepository(prisma);
const clickRepository = new ClickRepository(prisma);
const userRepository = new UserRepository(prisma);

// Services
const urlService = new UrlService(urlRepository, redisClient);
const analyticsService = new AnalyticsService(clickRepository, urlRepository);
const userService = new UserService(userRepository);
const authService = new AuthService(userRepository);

// Controllers
const urlController = new UrlController(urlService);
const redirectController = new RedirectController(urlService, analyticsService);
const analyticsController = new AnalyticsController(analyticsService, urlService);
const userController = new UserController(userService);
const authController = new AuthController(authService);

export {
    urlController,
    redirectController,
    analyticsController,
    userController,
    authController
};
