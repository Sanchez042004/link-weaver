import { Logger } from '@/config/logger';

const INTERVAL_MS = 10 * 60 * 1000; // 10 minutos

/**
 * Inicia un cron interno que hace un ping al propio endpoint /health
 * cada 10 minutos para evitar que Koyeb pause el servidor por inactividad.
 *
 * NOTA: Para que Koyeb no entre en pausa, el ping real lo debe hacer
 * un servicio externo (como cron-job.org) apuntando al dominio de Koyeb.
 *
 * @param port - Puerto en el que está escuchando el servidor Express (fallback)
 */
export function startKeepAlive(port: number): void {
    // Ya no usamos env.BASE_URL aquí porque BASE_URL debe ser el frontend
    // para generar los links acortados correctamente.
    // En su lugar usamos una variable separada BACKEND_URL si existe, o localhost.
    const publicUrl = process.env.BACKEND_URL?.replace(/\/$/, '');
    const healthUrl = publicUrl
        ? `${publicUrl}/health`
        : `http://localhost:${port}/health`;

    Logger.info(`💓 Keep-alive activado → ping cada 10 min a ${healthUrl}`);

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
