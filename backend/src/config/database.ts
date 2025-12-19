import { PrismaClient } from '@prisma/client';
import { env } from './env';

/**
 * Cliente de Prisma - Singleton Pattern
 * 
 * PrismaClient maneja la conexión a PostgreSQL.
 * Usamos un singleton para evitar crear múltiples conexiones
 * en desarrollo (cuando el servidor se reinicia con nodemon).
 */

// Extender el tipo global de Node.js
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

/**
 * Crear o reutilizar la instancia de Prisma
 */
export const prisma = global.prisma || new PrismaClient({
    log: env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn'] // En desarrollo, mostrar queries SQL
        : ['error'], // En producción, solo errores
});

/**
 * En desarrollo, guardar la instancia en global
 * para reutilizarla entre hot-reloads
 */
if (env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

/**
 * Manejar el cierre graceful de la conexión
 */
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

/**
 * Función helper para verificar la conexión a la base de datos
 */
export const connectDatabase = async (): Promise<void> => {
    try {
        await prisma.$connect();
        console.log('✅ Conectado a PostgreSQL');
    } catch (error) {
        console.error('❌ Error al conectar a PostgreSQL:', error);
        process.exit(1);
    }
};

/**
 * Función helper para desconectar de la base de datos
 */
export const disconnectDatabase = async (): Promise<void> => {
    await prisma.$disconnect();
    console.log('🔌 Desconectado de PostgreSQL');
};
