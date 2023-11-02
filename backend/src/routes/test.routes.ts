/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, type Request, type Response } from 'express'
import validateToken from '../middlewares/token.middleware'
import studentModel from '../models/student.model'

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

export default testRoutes
