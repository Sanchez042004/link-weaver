import { encodeBase62 } from '@/utils/base62';

/**
 * Generador de IDs tipo Snowflake
 * 
 * Inspirado en el algoritmo de Twitter Snowflake.
 * Genera IDs únicos de 64 bits distribuidos y ordenables.
 * 
 * Estructura del ID (64 bits):
 * - 41 bits: Timestamp (milisegundos desde epoch)
 * - 10 bits: Machine ID (soporta 1024 máquinas)
 * - 13 bits: Sequence (4096 IDs por milisegundo por máquina)
 * 
 * Ventajas:
 * ✅ Sin colisiones (único incluso en sistemas distribuidos)
 * ✅ Ordenable por tiempo (útil para analytics)
 * ✅ Alta throughput (4096 IDs/ms por servidor)
 * ✅ No requiere consultas a DB para verificar unicidad
 */

class IdGenerator {
    // Epoch personalizado (2022-01-01 00:00:00 UTC)
    // Usar epoch reciente maximiza el tiempo antes de overflow
    private readonly epoch = 1640995200000n; // new Date('2022-01-01').getTime()

    // ID de la máquina (1-1024)
    private readonly machineId: bigint;

    // Sequence counter (se resetea cada milisegundo)
    private sequence = 0n;

    // Último timestamp usado
    private lastTimestamp = 0n;

    // Bit shifts para construir el ID
    private readonly TIMESTAMP_SHIFT = 23n; // 10 + 13
    private readonly MACHINE_SHIFT = 13n;
    private readonly SEQUENCE_MASK = 0x1FFFn; // 13 bits = 8191

    /**
     * Constructor
     * 
     * @param machineId - ID único de esta máquina (1-1024)
     *                    En producción, esto vendría de una variable de entorno
     */
    constructor(machineId: number = 1) {
        if (machineId < 1 || machineId > 1024) {
            throw new Error('Machine ID debe estar entre 1 y 1024');
        }
        this.machineId = BigInt(machineId);
    }

    /**
     * Generar un ID único de 64 bits
     * 
     * @returns BigInt representando el ID único
     */
    public generate(): bigint {
        let timestamp = BigInt(Date.now());

        // Si estamos en el mismo milisegundo que el último ID
        if (timestamp === this.lastTimestamp) {
            // Incrementar sequence
            this.sequence = (this.sequence + 1n) & this.SEQUENCE_MASK;

            // Si sequence overflow (más de 8191 IDs en 1ms)
            if (this.sequence === 0n) {
                // Esperar al siguiente milisegundo
                timestamp = this.waitNextMillis(this.lastTimestamp);
            }
        } else {
            // Nuevo milisegundo, resetear sequence
            this.sequence = 0n;
        }

        // Validar que el timestamp no retroceda (clock drift)
        if (timestamp < this.lastTimestamp) {
            throw new Error(
                `Clock moved backwards. Refusing to generate ID for ${this.lastTimestamp - timestamp
                }ms`
            );
        }

        this.lastTimestamp = timestamp;

        // Construir el ID de 64 bits
        // [41 bits timestamp][10 bits machine][13 bits sequence]
        const id =
            ((timestamp - this.epoch) << this.TIMESTAMP_SHIFT) |
            (this.machineId << this.MACHINE_SHIFT) |
            this.sequence;

        return id;
    }

    /**
     * Generar un código corto en Base62
     * 
     * Este es el método principal que usaremos para crear aliases
     * 
     * @returns String Base62 (típicamente 7-8 caracteres)
     * 
     * @example
     * generateShortCode() // "7n4Ak2B"
     */
    public generateShortCode(): string {
        const id = this.generate();
        return encodeBase62(id);
    }

    /**
     * Esperar al siguiente milisegundo
     * 
     * @param lastTimestamp - Último timestamp usado
     * @returns Nuevo timestamp
     */
    private waitNextMillis(lastTimestamp: bigint): bigint {
        let timestamp = BigInt(Date.now());
        while (timestamp <= lastTimestamp) {
            timestamp = BigInt(Date.now());
        }
        return timestamp;
    }

    /**
     * Extraer el timestamp de un ID
     * 
     * Útil para debugging y analytics
     * 
     * @param id - ID generado
     * @returns Timestamp en milisegundos
     */
    public extractTimestamp(id: bigint): number {
        const timestamp = (id >> this.TIMESTAMP_SHIFT) + this.epoch;
        return Number(timestamp);
    }

    /**
     * Extraer el machine ID de un ID
     * 
     * @param id - ID generado
     * @returns Machine ID
     */
    public extractMachineId(id: bigint): number {
        const machineId = (id >> this.MACHINE_SHIFT) & 0x3FFn; // 10 bits
        return Number(machineId);
    }

    /**
     * Extraer el sequence de un ID
     * 
     * @param id - ID generado
     * @returns Sequence number
     */
    public extractSequence(id: bigint): number {
        const sequence = id & this.SEQUENCE_MASK;
        return Number(sequence);
    }
}

/**
 * Instancia singleton del generador de IDs
 * 
 * En producción, el machineId vendría de process.env.MACHINE_ID
 */
export const idGenerator = new IdGenerator(
    process.env.MACHINE_ID ? parseInt(process.env.MACHINE_ID) : 1
);

/**
 * Exportar la clase para testing
 */
export { IdGenerator };
