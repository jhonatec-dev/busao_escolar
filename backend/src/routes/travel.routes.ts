/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, type Request, type Response } from 'express'
import TravelController from '../controllers/travel.controller'
import validateToken from '../middlewares/token.middleware'
import {
  validateTravelBody,
  validateTravelParams
} from '../middlewares/travel.middleware'

const travelController = new TravelController()

const travelRoutes = Router()

travelRoutes.get(
  '/:year/:month',
  [validateToken, validateTravelParams],
  async (req: Request, res: Response) => {
    await travelController.getTravelMonth(req, res)
  }
)

travelRoutes.post(
  '/',
  [validateToken, validateTravelBody],
  async (req: Request, res: Response) => {
    await travelController.setMonthTravels(req, res)
  }
)

export default travelRoutes
