import { z } from 'zod';
import dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

/**
 * Schema de validación para variables de entorno
 * 
 * Zod nos permite:
 * 1. Validar que todas las variables requeridas existen
 * 2. Validar el formato (ej: URLs válidas)
 * 3. Proporcionar valores por defecto
 * 4. Obtener type-safety en TypeScript
 */
const envSchema = z.object({
    // Entorno de ejecución
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),

    // Puerto del servidor
    PORT: z
        .string()
        .default('3001')
        .transform((val) => parseInt(val, 10)),

    // URL de conexión a PostgreSQL
    DATABASE_URL: z
        .string()
        .url('DATABASE_URL debe ser una URL válida')
        .refine(
            (url) => url.startsWith('postgresql://'),
            'DATABASE_URL debe ser una conexión PostgreSQL'
        ),

    // URL de conexión a Redis
    REDIS_URL: z
        .string()
        .url('REDIS_URL debe ser una URL válida')
        .refine(
            (url) => url.startsWith('redis://'),
            'REDIS_URL debe ser una conexión Redis'
        )
        .optional(),

    // Secreto para firmar JWT
    JWT_SECRET: z
        .string()
        .min(32, 'JWT_SECRET debe tener al menos 32 caracteres para ser seguro'),

    // Tiempo de expiración del JWT
    JWT_EXPIRES_IN: z
        .string()
        .default('7d'),

    // URL del frontend (para CORS)
    FRONTEND_URL: z
        .string()
        .url('FRONTEND_URL debe ser una URL válida'),

    // Rate limiting (opcional)
    RATE_LIMIT_WINDOW_MS: z
        .string()
        .default('900000') // 15 minutos
        .transform((val) => parseInt(val, 10)),

    RATE_LIMIT_MAX_REQUESTS: z
        .string()
        .default('100')
        .transform((val) => parseInt(val, 10)),

    // URL base para los cortadores (ej: http://localhost:3001, https://my.app)
    BASE_URL: z
        .string()
        .url('BASE_URL debe ser una URL válida')
        .optional()
        .describe('URL base para construir las URLs cortas'),

    // ID de la máquina para Snowflake (1-1024)
    MACHINE_ID: z
        .string()
        .default('1')
        .transform((val) => parseInt(val, 10))
        .refine((val) => val >= 1 && val <= 1024, 'MACHINE_ID debe estar entre 1 y 1024'),

    // SMTP User for emails
    SMTP_USER: z.string().email().optional(),
    // SMTP Password for emails
    SMTP_PASS: z.string().optional(),
});

/**
 * Validar y parsear las variables de entorno
 * 
 * Si falta alguna variable o tiene formato incorrecto,
 * el servidor no arrancará y mostrará un error claro
 */
const parseEnv = () => {
    if (process.env.NODE_ENV === 'test') {
        // En test, forzamos valores válidos para evitar validaciones fallidas por basura en .env
        const testEnv = {
            ...process.env,
            // Sobreescribir con valores válidos garantizados
            BASE_URL: 'http://test.local',
            MACHINE_ID: '1',
            PORT: '3000',
            DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
            JWT_SECRET: 'test-secret-must-be-at-least-32-chars-long',
            FRONTEND_URL: 'http://localhost:3000',
            // Mantener NODE_ENV
            NODE_ENV: 'test',
        };
        return envSchema.parse(testEnv);
    }

    try {
        return envSchema.parse(process.env);
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Note: Using console.error here because Logger may not be initialized yet
            console.error('❌ Error en las variables de entorno:');
            error.issues.forEach((err) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
            process.exit(1);
        }
        throw error;
    }
};

/**
 * Exportar variables de entorno validadas y tipadas
 * 
 * Ahora podemos usar env.PORT, env.DATABASE_URL, etc.
 * con autocompletado y type-safety
 */
export const env = parseEnv();

/**
 * Type helper para obtener el tipo de env
 */
export type Env = z.infer<typeof envSchema>;
