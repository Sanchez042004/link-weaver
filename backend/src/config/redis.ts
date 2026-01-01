import { createClient, RedisClientType } from 'redis';
import { env } from './env';
import { Logger } from './logger';

/**
 * Cliente de Redis - Singleton Pattern
 * 
 * Redis se usa como caché para:
 * 1. Almacenar URLs más accedidas (reducir carga en PostgreSQL)
 * 2. Acelerar redirecciones (latencia <50ms)
 */

export class RedisClient {
    private static instance: RedisClient;
    private client: RedisClientType;
    private isConnected: boolean = false;

    private constructor() {
        // Crear cliente de Redis
        this.client = createClient({
            url: env.REDIS_URL,
            socket: {
                reconnectStrategy: (retries) => {
                    // Reintentar conexión con backoff exponencial
                    if (retries > 10) {
                        Logger.error('❌ Redis: Máximo de reintentos alcanzado');
                        return new Error('Redis connection failed');
                    }
                    return Math.min(retries * 100, 3000);
                },
            },
        });

        // Event listeners
        this.client.on('connect', () => {
            Logger.info('Conectando a Redis...');
        });

        this.client.on('ready', () => {
            this.isConnected = true;
            Logger.info('Conectado a Redis');
        });

        this.client.on('error', (error) => {
            Logger.error('Error en Redis:', error);
            this.isConnected = false;
        });

        this.client.on('end', () => {
            this.isConnected = false;
            Logger.info('Desconectado de Redis');
        });
    }

    /**
     * Obtener instancia única de RedisClient
     */
    public static getInstance(): RedisClient {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient();
        }
        return RedisClient.instance;
    }

    /**
     * Conectar a Redis
     */
    public async connect(): Promise<void> {
        if (!this.isConnected) {
            await this.client.connect();
        }
    }

    /**
     * Desconectar de Redis
     */
    public async disconnect(): Promise<void> {
        if (this.isConnected) {
            await this.client.disconnect();
        }
    }

    /**
     * Obtener el cliente de Redis
     */
    public getClient(): RedisClientType {
        return this.client;
    }

    /**
     * Verificar si está conectado
     */
    public isReady(): boolean {
        return this.isConnected;
    }
}

// Exportar instancia única
export const redisClient = RedisClient.getInstance();

/**
 * Exportar el cliente de Redis para uso directo
 */
export const getRedisClient = (): RedisClientType => {
    return redisClient.getClient();
};
