import { Router } from 'express'
import loginRoutes from './login.routes'
import studentRoutes from './student.routes'
import testRoutes from './test.routes'

const router = Router()

router.use('/login', loginRoutes)
router.use('/student', studentRoutes)
router.use('/test', testRoutes)

export default router
