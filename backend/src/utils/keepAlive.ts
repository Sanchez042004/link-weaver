import { Logger } from '@/config/logger';

const INTERVAL_MS = 10 * 60 * 1000; // 10 minutos

/**
 * Inicia un cron interno que hace un ping al propio endpoint /health
 * cada 10 minutos para evitar que Koyeb pause el servidor por inactividad.
 *
 * Usa localhost directamente para no depender de la URL pública del servicio.
 * Solo se activa en producción.
 *
 * @param port - Puerto en el que está escuchando el servidor Express
 */
export function startKeepAlive(port: number): void {
    const healthUrl = `http://localhost:${port}/health`;

    Logger.info(`💓 Keep-alive activado → ping cada 10 min a ${healthUrl}`);

    const ping = async () => {
        try {
            const res = await fetch(healthUrl, { signal: AbortSignal.timeout(10_000) });
            Logger.info(`💓 Keep-alive ping OK (${res.status})`);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            Logger.warn(`💓 Keep-alive ping fallido: ${message}`);
        }
    };

    // Primer ping al arrancar para verificar que el servidor responde
    void ping();

    setInterval(() => void ping(), INTERVAL_MS);
}
