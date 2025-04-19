import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../db'
import status from '../utils/statusCodes'
import bcrypt from 'bcryptjs'

const signUp = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password } = req.body

        const isUserExits = await prisma.user.findFirst({ where: { email } })

        if (isUserExits) {
            res.status(status.CONFLICT).json({
                success: false,
                message: 'User already exist',
            })
            return
        }

        const hashedPassword = await bcrypt.hash(password, 11)

        // then store them into the database
        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
            },
        })

        if (!process.env.APP_SECRET) {
            throw new Error('APP_SECRET is not defined')
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
        )
        res.cookie('Authorization', token, {
            maxAge: 1000 * 60 * 60 * 24 * 10,
            httpOnly: true,
            secure: true,
        })
        // TODO : Wrapper class for responce
        res.status(200).json({ success: true, token: `Bearer ${token}` })
        return
    } catch (error) {
        // TODO : Logger Service
        console.log('Error ', error)
        res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal Server Error',
        })
    }
}

export { signUp }
