import { app } from './app';
import { env } from '@/config/env';
import { connectDatabase, disconnectDatabase } from '@/config/database';
import { redisClient } from '@/config/redis';

/**
 * Servidor HTTP de Link Weaver
 * 
 * Este archivo:
 * 1. Conecta a PostgreSQL
 * 2. Conecta a Redis
 * 3. Inicia el servidor Express
 * 4. Maneja el shutdown gracefully
 */

/**
 * Función principal para iniciar el servidor
 */
async function startServer() {
    try {
        console.log('🚀 Iniciando Link Weaver Backend...\n');

        /**
         * 1. Conectar a PostgreSQL
         */
        console.log('📊 Conectando a PostgreSQL...');
        await connectDatabase();

        /**
         * 2. Conectar a Redis
         */
        console.log('🔴 Conectando a Redis...');
        await redisClient.connect();

        /**
         * 3. Iniciar servidor Express
         */
        const PORT = env.PORT;
        const server = app.listen(PORT, () => {
            console.log('\n✅ Servidor iniciado correctamente!\n');
            console.log(`🌐 Entorno: ${env.NODE_ENV}`);
            console.log(`🔗 URL: http://localhost:${PORT}`);
            console.log(`📡 Health Check: http://localhost:${PORT}/health`);
            console.log('\n💡 Presiona Ctrl+C para detener el servidor\n');
        });

        /**
         * Manejo de señales de terminación
         * 
         * Cuando se presiona Ctrl+C o el proceso recibe una señal de terminación,
         * cerramos las conexiones gracefully antes de salir.
         */
        const gracefulShutdown = async (signal: string) => {
            console.log(`\n\n⚠️  Señal ${signal} recibida. Cerrando servidor...`);

            // Cerrar servidor HTTP (dejar de aceptar nuevas conexiones)
            server.close(async () => {
                console.log('🔌 Servidor HTTP cerrado');

                try {
                    // Desconectar de PostgreSQL
                    await disconnectDatabase();

                    // Desconectar de Redis
                    await redisClient.disconnect();

                    console.log('✅ Shutdown completado correctamente');
                    process.exit(0);
                } catch (error) {
                    console.error('❌ Error durante shutdown:', error);
                    process.exit(1);
                }
            });

            // Si después de 10 segundos no se cerró, forzar salida
            setTimeout(() => {
                console.error('⚠️  Forzando cierre después de timeout');
                process.exit(1);
            }, 10000);
        };

        // Escuchar señales de terminación
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        /**
         * Manejo de errores no capturados
         */
        process.on('unhandledRejection', (reason, promise) => {
            console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
            // En producción, aquí enviarías el error a un servicio de logging
        });

        process.on('uncaughtException', (error) => {
            console.error('❌ Uncaught Exception:', error);
            // En producción, aquí enviarías el error a un servicio de logging
            gracefulShutdown('UNCAUGHT_EXCEPTION');
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

/**
 * Iniciar el servidor
 */
startServer();
