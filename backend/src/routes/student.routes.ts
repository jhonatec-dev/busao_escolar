/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, type Request, type Response } from 'express'
import StudentController from '../controllers/student.controller'
import validateCreateStudent from '../middlewares/student.middleware'
import validateToken from '../middlewares/token.middleware'

const studentController = new StudentController()

const loginRoutes = Router()

loginRoutes.get(
  '/',
  validateToken,
  async (req: Request, res: Response) => await studentController.find(req, res)
)

loginRoutes.post(
  '/',
  validateCreateStudent,
  async (req: Request, res: Response) =>
    await studentController.create(req, res)
)

loginRoutes.put(
  '/',
  [validateToken, validateCreateStudent],
  async (req: Request, res: Response) =>
    await studentController.update(req, res)
)

loginRoutes.get(
  '/profile',
  validateToken,
  async (req: Request, res: Response) =>
    await studentController.getProfile(req, res)
)

loginRoutes.get(
  '/:id',
  validateToken,
  async (req: Request, res: Response) =>
    await studentController.findById(req, res)
)

loginRoutes.delete(
  '/:id',
  validateToken,
  async (req: Request, res: Response) =>
    await studentController.delete(req, res)
)

loginRoutes.post('/accept/:id', validateToken, async (req: Request, res: Response) =>
  await studentController.accept(req, res)
)

export default loginRoutes
