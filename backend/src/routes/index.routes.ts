import { Router } from 'express'
import loginRoutes from './login.routes'
import studentRoutes from './student.routes'

const router = Router()

router.use('/login', loginRoutes)
router.use('/student', studentRoutes)

export default router
