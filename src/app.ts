import express from 'express';

import userRoute from './routes/user.route';

import type { Request, Response } from 'express';

const app = express();

// Middlewares
app.use(express.json());

const healthCheck = async (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Running Correcty',
    });
    return;
};

app.get('/healthcheck', healthCheck);

app.use('/api/v1/auth/', userRoute);

export default app;
