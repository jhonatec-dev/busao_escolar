/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, type Request, type Response } from 'express'
import TravelController from '../controllers/travel.controller'
import validateToken from '../middlewares/token.middleware'

const travelController = new TravelController()

const travelRoutes = Router()

travelRoutes.post('/', validateToken, async (req: Request, res: Response) => {
  await travelController.create(req, res)
})

export default travelRoutes
