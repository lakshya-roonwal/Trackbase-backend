import express from 'express';
import cookieParser from 'cookie-parser';

import userRoute from './routes/user.route';
import projectRoute from './routes/project.route';

import type { Request, Response } from 'express';

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

const healthCheck = async (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Running Correcty',
    });
    return;
};

app.get('/healthcheck', healthCheck);
app.use('/api/v1/auth/', userRoute);

// Authenticated Routes
app.use('/api/v1/project/', projectRoute);

export default app;
