import { Router } from 'express'
import loginRoutes from './login.routes'
import studentRoutes from './student.routes'
import systemRoutes from './system.routes'
import testRoutes from './test.routes'
import travelRoutes from './travel.routes'

const router = Router()

router.use('/login', loginRoutes)
router.use('/student', studentRoutes)
router.use('/system', systemRoutes)
router.use('/travel', travelRoutes)

router.use('/test', testRoutes)

export default router
