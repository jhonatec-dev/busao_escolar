/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, type Request, type Response } from 'express'
import SystemController from '../controllers/system.controller'
import validateToken from '../middlewares/token.middleware'

const stytemRoutes = Router()

const systemController = new SystemController()

stytemRoutes.get(
  '/bus', validateToken,
  async (req: Request, res: Response) => await systemController.getBus(req, res)
)

stytemRoutes.patch(
  '/bus',
  validateToken,
  async (req: Request, res: Response) =>
    await systemController.updateBus(req, res)
)

export default stytemRoutes
