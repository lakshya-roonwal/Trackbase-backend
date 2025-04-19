import { Router } from 'express'
import { signUp } from '../controllers/user.controller'
import { userRegistrationSchema } from '../schemas/userSchema'
import { validateData } from '../middlewares/validation'
const router = Router()

router.post('/sign-up', validateData(userRegistrationSchema), signUp)

export default router
