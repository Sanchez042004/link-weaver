import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { BadRequestError } from '@/errors';

export const validate = (schema: ZodObject<any>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        // Assign parsed values back to request for type safety and sanitization
        if (parsed.body) req.body = parsed.body;
        if (parsed.query) req.query = parsed.query as any;
        if (parsed.params) req.params = parsed.params as any;

        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessage = error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
            next(new BadRequestError(errorMessage));
        } else {
            next(error);
        }
    }
};
