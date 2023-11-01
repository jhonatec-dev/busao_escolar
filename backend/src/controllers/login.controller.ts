import { type Request, type Response } from 'express'
import StudentService from '../services/student.service'
import { mapStatusHTTP } from '../utils/mapStatusHTTP'

export class LoginController {
  private readonly service: StudentService

  constructor () {
    this.service = new StudentService()
  }

  async login (req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body
      const { status, data } = await this.service.login({
        email,
        password
      })
      console.log('status', status, 'data', data, 'controller')
      if (status !== 'SUCCESS') {
        throw new Error('Dados de login inválidos ou usuário não autorizado')
      }

      return res.status(mapStatusHTTP(status)).json(data)
    } catch (error: Error | any) {
      return res.status(400).json({ message: error.message })
    }
  }
}
