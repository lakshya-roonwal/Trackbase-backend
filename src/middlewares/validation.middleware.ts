import { NextFunction, Request, Response } from 'express';

import { AnyZodObject, ZodError, ZodIssue } from 'zod';

export const validateData = (schema: AnyZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue: ZodIssue) => ({
                    path: issue.path.join('.'),
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }));
                res.status(403).json({
                    success: false,
                    message: 'Invalid data',
                    error: errorMessages,
                });
                return;
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
        }
    };
};
