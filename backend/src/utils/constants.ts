/**
 * List of reserved aliases that cannot be used for shortened URLs
 * because they conflict with frontend routes or internal API paths.
 */
export const RESERVED_ALIASES = [
    // Frontend Routes
    'login',
    'signup',
    'register',
    'dashboard',
    'settings',
    'analytics',
    'features',
    'verify-email',
    'forgot-password',
    'reset-password',
    'logout',
    '404',
    'home',
    'profile',
    'admin',

    // API and Internal
    'api',
    'auth',
    'health',
    'status',
    'metrics',
    'favicon.ico',
    'robots.txt',
    'sitemap.xml',
    'static',
    'assets',
    'uploads',

    // Shortener reserved names
    'url',
    'shorten',
    'links',
    'knot',
    'weaver'
];
