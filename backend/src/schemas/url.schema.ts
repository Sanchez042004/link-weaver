import { z } from 'zod';

export const createUrlSchema = z.object({
    body: z.object({
        longUrl: z.string()
            .url('La URL proporcionada no es válida')
            .max(2048, 'La URL es demasiado larga')
            .regex(/^https?:\/\//, 'La URL debe comenzar con http:// o https://'),
        customAlias: z.string()
            .min(3, 'El alias debe tener al menos 3 caracteres')
            .max(20, 'El alias no puede tener más de 20 caracteres')
            .regex(/^[a-zA-Z0-9-_]+$/, 'El alias solo puede contener letras, números, guiones y guiones bajos')
            .optional(),
    })
});

export const updateUrlSchema = z.object({
    params: z.object({
        id: z.string().uuid().or(z.string().length(21)).optional(), // Allowing UUID or NanoID length if that's what's used
    }),
    body: z.object({
        longUrl: z.string()
            .url('La URL proporcionada no es válida')
            .startsWith('http', 'La URL debe ser válida (http/https)')
            .optional(),
        customAlias: z.string()
            .min(3, 'El alias debe tener al menos 3 caracteres')
            .max(20, 'El alias no puede tener más de 20 caracteres')
            .regex(/^[a-zA-Z0-9-_]+$/, 'El alias solo puede contener letras, números, guiones y guiones bajos')
            .optional(),
    })
});
