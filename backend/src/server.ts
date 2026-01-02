import { app } from './app';
import { env } from '@/config/env';
import { connectDatabase, disconnectDatabase } from '@/config/database';
import { redisClient } from '@/config/redis';
import { Logger } from '@/config/logger';

// ... (comments)

async function startServer() {
    try {
        Logger.info('Iniciando Link Weaver Backend');

        /**
         * 1. Conectar a PostgreSQL
         */
        Logger.info('Conectando a PostgreSQL');
        await connectDatabase();

        /**
         * 2. Conectar a Redis (si está configurado)
         */
        if (env.REDIS_URL) {
            Logger.info('Conectando a Redis');
            await redisClient.connect();
        } else {
            Logger.info('Redis omitido (no configurado)');
        }

        /**
         * 3. Iniciar servidor Express
         */
        const PORT = env.PORT;
        const server = app.listen(PORT, '0.0.0.0', () => {
            Logger.info(`Servidor iniciado correctamente`);
            Logger.info(`Entorno: ${env.NODE_ENV}`);
            Logger.info(`URL: ${env.BASE_URL || 'http://localhost:' + PORT}`);
            Logger.info(`Health Check: http://localhost:${PORT}/health`);
        });

        // ... (shutdown handlers)
        const gracefulShutdown = async (signal: string) => {
            Logger.warn(`Señal ${signal} recibida. Cerrando servidor`);

            // Cerrar servidor HTTP
            server.close(async () => {
                Logger.info('Servidor HTTP cerrado');
                try {
                    await disconnectDatabase();
                    await redisClient.disconnect();
                    Logger.info('Shutdown completado correctamente');
                    process.exit(0);
                } catch (error) {
                    Logger.error('Error durante shutdown:', error);
                    process.exit(1);
                }
            });

            // Timeout
            setTimeout(() => {
                Logger.error('Forzando cierre después de timeout');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        process.on('unhandledRejection', (reason, promise) => {
            Logger.error('Unhandled Rejection:', { reason, promise });
        });

        process.on('uncaughtException', (error) => {
            Logger.error('Uncaught Exception:', error);
            gracefulShutdown('UNCAUGHT_EXCEPTION');
        });
    } catch (error) {
        Logger.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();
