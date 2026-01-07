import { app } from './app';
import { env } from '@/config/env';
import { connectDatabase, disconnectDatabase } from '@/config/database';
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
         * 3. Iniciar servidor Express
         */
        /**
         * 3. Iniciar servidor Express
         */
        const PORT = env.PORT || 3001;
        const server = app.listen(PORT, '0.0.0.0', () => {
            Logger.info('=============================================');
            Logger.info(`🚀 SERVIDOR ESCUCHANDO EN: 0.0.0.0:${PORT}`);
            Logger.info(`Entorno: ${env.NODE_ENV}`);
            Logger.info(`🔗 API Root: http://localhost:${PORT}/`);
            Logger.info(`💓 Health:   http://localhost:${PORT}/health`);
            Logger.info('=============================================');
        });

        server.on('error', (err: any) => {
            console.error('❌ ERROR FATAL AL INICIAR SERVIDOR:', err);
            if (err.code === 'EADDRINUSE') {
                console.error(`  El puerto ${PORT} ya está en uso.`);
            }
            process.exit(1);
        });

        // ... (shutdown handlers)
        const gracefulShutdown = async (signal: string) => {
            Logger.warn(`Señal ${signal} recibida. Cerrando servidor`);

            // Cerrar servidor HTTP
            server.close(async () => {
                Logger.info('Servidor HTTP cerrado');
                try {
                    await disconnectDatabase();
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
