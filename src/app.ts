import express from 'express'
import type { Request, Response } from 'express'

const app = express()

app.get('/healthcheck', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Running Correcty',
    })
    return
})

export default app
