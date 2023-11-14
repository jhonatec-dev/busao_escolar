/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, type Request, type Response } from 'express'
import requestController from '../controllers/request.controller'
import validateToken from '../middlewares/token.middleware'

const requestRoutes = Router()

requestRoutes.get('/', validateToken, async (req: Request, res: Response) => { await requestController.getRequests(req, res) }
)

export default requestRoutes
