import { type Request, type Response } from 'express'
import TravelService from '../services/travel.service'
import { mapStatusHTTP } from '../utils/mapStatusHTTP'

class TravelController {
  private readonly service: TravelService

  constructor () {
    this.service = new TravelService()
  }

  async create (req: Request, res: Response): Promise<Response> {
    if (req.body.token.role === 'admin') {
      const { status, data } = await this.service.create(req.body)
      return res.status(mapStatusHTTP(status)).json(data)
    }

    return res.status(403).json({ message: 'Usuário não autorizado' })
  }
}

export default TravelController
