import { z } from 'zod';

export const userRegistrationSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2).optional(),
    email: z.string().email(),
    password: z.string().min(8).max(32),
});

export const userLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(32),
});
