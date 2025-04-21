import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db';
import status from '../utils/statusCodes';
import bcrypt from 'bcryptjs';
import Logger from '../services/LoggerService';

const logger = new Logger('User');

const signUp = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const isUserExits = await prisma.user.findFirst({ where: { email } });

        if (isUserExits) {
            res.status(status.CONFLICT).json({
                success: false,
                message: 'User already exist',
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 11);

        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
            },
        });

        if (!process.env.APP_SECRET) {
            throw new Error('APP_SECRET is not defined');
        }
        const token = jwt.sign(
            {
                id: newUser.id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                // TODO : Role in JWT
            },
            process.env.APP_SECRET as string
        );
        res.cookie('Authorization', token, {
            maxAge: 1000 * 60 * 60 * 24 * 10,
            httpOnly: true,
            secure: true,
        });
        // TODO : Wrapper class for responce
        res.status(200).json({ success: true, token: `Bearer ${token}` });
        return;
    } catch (error) {
        logger.log('Signup Error', 'error', error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
        where: { email },
    });

    if (!user) {
        res.status(status.UNAUTHORIZED).json({
            success: false,
            message: 'Invalid Email or Password',
        });
        return;
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
        res.status(status.UNAUTHORIZED).json({
            success: false,
            message: 'Invalid Email or Password',
        });
        return;
    }
    if (!process.env.APP_SECRET) {
        throw new Error('APP_SECRET is not defined');
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            // TODO : Role in JWT
        },
        process.env.APP_SECRET as string
    );
    res.cookie('Authorization', token, {
        maxAge: 1000 * 60 * 60 * 24 * 10,
        httpOnly: true,
        secure: true,
    });
    // TODO : Wrapper class for responce
    res.status(200).json({ success: true, token: `Bearer ${token}` });
    return;
};

export { signUp, login };
