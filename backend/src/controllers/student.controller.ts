import { type Request, type Response } from 'express'
import StudentService from '../services/student.service'
import { mapStatusHTTP } from '../utils/mapStatusHTTP'

class StudentController {
  private readonly service: StudentService
  constructor () {
    this.service = new StudentService()
  }

  async find (_req: Request, res: Response): Promise<Response> {
    const { status, data } = await this.service.find()
    return res.status(mapStatusHTTP(status)).json(data)
  }

  async findById (req: Request, res: Response): Promise<Response> {
    if (
      req.body.token.role === 'admin' ||
      req.body.token._id === req.params.id
    ) {
      const { status, data } = await this.service.findById(req.params.id)
      return res.status(mapStatusHTTP(status)).json(data)
    }
    return res.status(403).json({ message: 'Usuário não autorizado' })
  }

  async getProfile (req: Request, res: Response): Promise<Response> {
    const { status, data } = await this.service.findById(req.body.token._id)
    return res.status(mapStatusHTTP(status)).json(data)
  }

  async create (req: Request, res: Response): Promise<Response> {
    const { status, data } = await this.service.create(req.body)
    return res.status(mapStatusHTTP(status)).json(data)
  }

  async update (req: Request, res: Response): Promise<Response> {
    const { token, ...student } = req.body
    if (token.role === 'admin') {
      const { status, data } = await this.service.update(
        req.params.id,
        student
      )
      return res.status(mapStatusHTTP(status)).json(data)
    }

    return res.status(403).json({ message: 'Usuário não autorizado' })
  }

  async delete (req: Request, res: Response): Promise<Response> {
    if (req.body.token.role === 'admin') {
      const { status, data } = await this.service.delete(req.params.id)
      return res.status(mapStatusHTTP(status)).json(data)
    }

    return res.status(403).json({ message: 'Usuário não autorizado' })
  }

  async accept (req: Request, res: Response): Promise<Response> {
    if (req.body.token.role === 'admin') {
      const { status, data } = await this.service.accept(req.params.id)
      return res.status(mapStatusHTTP(status)).json(data)
    }

    return res.status(403).json({ message: 'Usuário não autorizado' })
  }
}

export default StudentController
