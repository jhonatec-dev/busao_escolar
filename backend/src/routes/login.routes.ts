/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, type Request, type Response } from 'express'
import { LoginController } from '../controllers/login.controller'
import validateLogin from '../middlewares/login.middleware'

const loginRoutes = Router()

const loginController = new LoginController()

loginRoutes.post('/', validateLogin, async (req: Request, res: Response) => {
  await loginController.login(req, res)
})

export default loginRoutes
