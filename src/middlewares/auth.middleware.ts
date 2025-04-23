import { NextFunction, Request, Response } from 'express';
import status from '../utils/statusCodes';
import Logger from '../services/LoggerService';
import jwt from 'jsonwebtoken';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

const logger = new Logger('Auth Middleware');

export const validateUser = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const token = req.cookies.Authorization;

        if (!token) {
            res.status(401).json({
                message: 'Authorization token is required.',
            });
            return;
        }

        const user = jwt.verify(
            token,
            process.env.APP_SECRET as string
        ) as User;

        if (!user) {
            res.status(status.UNAUTHORIZED).json({
                success: false,
                message: 'Unauthorized',
            });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        logger.log('Auth Middleware', 'error', error);
        res.status(status.UNAUTHORIZED).json({
            success: false,
            message: 'Unauthorized',
        });
        return;
    }
};
