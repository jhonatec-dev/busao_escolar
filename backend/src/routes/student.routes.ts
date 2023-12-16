/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, type Request, type Response } from 'express'
import StudentController from '../controllers/student.controller'
import validateCreateStudent from '../middlewares/student.middleware'
import validateToken from '../middlewares/token.middleware'

const studentController = new StudentController()

const studentRoutes = Router()

studentRoutes.get(
  '/',
  validateToken,
  async (req: Request, res: Response) => await studentController.find(req, res)
)

studentRoutes.post(
  '/',
  validateCreateStudent,
  async (req: Request, res: Response) =>
    await studentController.create(req, res)
)

studentRoutes.put(
  '/',
  [validateToken, validateCreateStudent],
  async (req: Request, res: Response) =>
    await studentController.update(req, res)
)

studentRoutes.post('/forgot', async (req: Request, res: Response) => {
  await studentController.forgot(req, res)
})

studentRoutes.get(
  '/profile',
  validateToken,
  async (req: Request, res: Response) =>
    await studentController.getProfile(req, res)
)

studentRoutes.get(
  '/:id',
  validateToken,
  async (req: Request, res: Response) =>
    await studentController.findById(req, res)
)

studentRoutes.delete(
  '/:id',
  validateToken,
  async (req: Request, res: Response) =>
    await studentController.delete(req, res)
)

studentRoutes.patch('/accept/:id', validateToken, async (req: Request, res: Response) =>
  await studentController.accept(req, res)
)

studentRoutes.patch('/frequency/:id', validateToken, async (req: Request, res: Response) =>
  await studentController.changeFrequency(req, res)
)

export default studentRoutes
