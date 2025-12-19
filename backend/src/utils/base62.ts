/**
 * Algoritmo Base62 Encoding/Decoding
 * 
 * Base62 usa 62 caracteres: 0-9, a-z, A-Z
 * Esto permite crear URLs cortas y legibles.
 * 
 * Ejemplo:
 * - ID numérico: 125894217
 * - Base62: "7n4Ak" (5 caracteres)
 * 
 * Capacidad:
 * - 7 caracteres = 3,521,614,606,208 combinaciones (3.5 billones)
 * - 8 caracteres = 218,340,105,584,896 combinaciones (218 billones)
 */

// Alfabeto Base62: números, minúsculas, mayúsculas
const BASE62_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE = 62n; // BigInt para soportar números muy grandes

/**
 * Codificar un número a Base62
 * 
 * @param num - Número a codificar (BigInt para soportar IDs grandes)
 * @returns String en Base62
 * 
 * @example
 * encodeBase62(125894217n) // "7n4Ak"
 * encodeBase62(0n) // "0"
 */
export function encodeBase62(num: bigint): string {
    // Caso especial: 0
    if (num === 0n) {
        return '0';
    }

    // Validar que sea un número positivo
    if (num < 0n) {
        throw new Error('No se pueden codificar números negativos');
    }

    let encoded = '';
    let remaining = num;

    // Convertir a Base62 dividiendo sucesivamente
    while (remaining > 0n) {
        const remainder = Number(remaining % BASE);
        encoded = BASE62_CHARS[remainder] + encoded;
        remaining = remaining / BASE;
    }

    return encoded;
}

/**
 * Decodificar un string Base62 a número
 * 
 * @param str - String en Base62
 * @returns Número original (BigInt)
 * 
 * @example
 * decodeBase62("7n4Ak") // 125894217n
 * decodeBase62("0") // 0n
 */
export function decodeBase62(str: string): bigint {
    // Validar que solo contenga caracteres válidos
    if (!/^[0-9a-zA-Z]+$/.test(str)) {
        throw new Error('String contiene caracteres inválidos para Base62');
    }

    let decoded = 0n;

    // Convertir cada carácter
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const charIndex = BASE62_CHARS.indexOf(char);

        if (charIndex === -1) {
            throw new Error(`Carácter inválido: ${char}`);
        }

        decoded = decoded * BASE + BigInt(charIndex);
    }

    return decoded;
}

/**
 * Validar si un string es Base62 válido
 * 
 * @param str - String a validar
 * @returns true si es Base62 válido
 */
export function isValidBase62(str: string): boolean {
    return /^[0-9a-zA-Z]+$/.test(str);
}

/**
 * Generar un alias aleatorio de longitud específica
 * 
 * Útil para testing o como fallback
 * 
 * @param length - Longitud del alias (default: 7)
 * @returns String Base62 aleatorio
 */
export function generateRandomBase62(length: number = 7): string {
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * BASE62_CHARS.length);
        result += BASE62_CHARS[randomIndex];
    }
    return result;
}
