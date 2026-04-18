import { Logger } from '@/config/logger';
import { env } from '@/config/env';

const INTERVAL_MS = 10 * 60 * 1000; // 10 minutos

/**
 * Inicia un cron interno que hace un ping al propio endpoint /health
 * cada 10 minutos para evitar que Koyeb pause el servidor por inactividad.
 *
 * IMPORTANTE: Koyeb mide inactividad por tráfico externo, por lo que el ping
 * debe hacerse a la URL pública del servicio (BASE_URL), NO a localhost.
 * Un ping a localhost no cuenta como tráfico externo para la plataforma.
 *
 * Como respaldo adicional, se recomienda usar un servicio externo como
 * cron-job.org o UptimeRobot para hacer ping a /health cada 5 minutos.
 *
 * @param port - Puerto en el que está escuchando el servidor Express (fallback)
 */
export function startKeepAlive(port: number): void {
    // Preferir la URL pública (BASE_URL) porque Koyeb necesita tráfico externo.
    // Si BASE_URL no está definida, caemos a localhost como último recurso.
    const publicUrl = env.BASE_URL?.replace(/\/$/, '');
    const healthUrl = publicUrl
        ? `${publicUrl}/health`
        : `http://localhost:${port}/health`;

    Logger.info(`💓 Keep-alive activado → ping cada 10 min a ${healthUrl}`);

    if (!publicUrl) {
        Logger.warn('💓 Keep-alive: BASE_URL no configurada. Usando localhost como fallback.');
        Logger.warn('💓 Para que Koyeb no pause el servidor, configura BASE_URL con la URL pública del servicio.');
    }

    const ping = async () => {
        try {
            const res = await fetch(healthUrl, { signal: AbortSignal.timeout(10_000) });
            Logger.info(`💓 Keep-alive ping OK (${res.status}) → ${healthUrl}`);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            Logger.warn(`💓 Keep-alive ping fallido: ${message}`);
        }
    };

    // Primer ping al arrancar para verificar que el servidor responde
    void ping();

    setInterval(() => void ping(), INTERVAL_MS);
}
