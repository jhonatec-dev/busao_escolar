/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, type Request, type Response } from 'express'
import validateToken from '../middlewares/token.middleware'
import studentModel from '../models/student.model'
import travelModel from '../models/travel.model'

const testRoutes = Router()

testRoutes.post(
  '/desactivate',
  validateToken,
  async (req: Request, res: Response) => {
    if (req.body.token.role !== 'admin') return res.sendStatus(403)
    const filtro = { role: { $ne: 'admin' } }
    const atualizacao = { $set: { accepted: false } }
    try {
      await studentModel.model.updateMany(filtro, atualizacao)
    } catch (error) {
      console.log(error)
    }

    res.sendStatus(200)
  }
)

testRoutes.post(
  '/reset',
  validateToken,
  async (req: Request, res: Response) => {
    try {
      if (req.body.token.role !== 'admin') return res.sendStatus(403)
      await travelModel.model.deleteMany({})
      await studentModel.model.deleteMany({ role: 'student' })
      res.sendStatus(200)
    } catch (error) {
      res.json((error as Error).message).status(400)
    }
  }
)

testRoutes.post(
  '/travels-reset',
  validateToken,
  async (req: Request, res: Response) => {
    try {
      if (req.body.token.role !== 'admin') return res.sendStatus(403)
      await travelModel.model.deleteMany({})
      res.sendStatus(200)
    } catch (error) {
      res.json((error as Error).message).status(400)
    }
  }
)

export default testRoutes
