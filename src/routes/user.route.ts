import { Router } from 'express';

import { login, signUp } from '../controllers/user.controller';
import { userLoginSchema, userRegistrationSchema } from '../schemas/userSchema';
import { validateData } from '../middlewares/validation.middleware';

const router = Router();

router.post('/sign-up', validateData(userRegistrationSchema), signUp);
router.post('/login', validateData(userLoginSchema), login);

export default router;
