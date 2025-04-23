import { Router } from 'express';
import { validateUser } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', validateUser, (req, res) => {
    res.status(200).json({
        message: 'helo world',
    });
});

export default router;
