import { type Request, type Response } from 'express'
import TravelService from '../services/travel.service'
import { mapStatusHTTP } from '../utils/mapStatusHTTP'

class TravelController {
  private readonly service: TravelService

  constructor () {
    this.service = new TravelService()
  }

  async getTravelMonth (req: Request, res: Response): Promise<Response> {
    const { status, data } = await this.service.getTravelMonth(
      req.body.year,
      req.body.month
    )
    return res.status(mapStatusHTTP(status)).json(data)
  }

  async setMonthTravels (req: Request, res: Response): Promise<Response> {
    if (req.body.token.role === 'admin') {
      const { status, data } = await this.service.setMonthTravels(req.body)
      return res.status(mapStatusHTTP(status)).json(data)
    }

    return res.status(403).json({ message: 'Usuário não autorizado' })
  }
}

export default TravelController
