import { type Request, type Response } from 'express'
import { type ITravelStudent } from '../interfaces/ITravel'
import TravelService from '../services/travel.service'
import { mapStatusHTTP } from '../utils/mapStatusHTTP'

class TravelController {
  private readonly service: TravelService

  constructor () {
    this.service = new TravelService()
  }

  async getTravelMonth (req: Request, res: Response): Promise<Response> {
    const { status, data } = await this.service.getTravelMonth(
      +req.params.year,
      +req.params.month
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

  async addOtherStudent (req: Request, res: Response): Promise<Response> {
    const { idTravel, day } = req.params
    const { token, message } = req.body
    const student: Omit<ITravelStudent, 'approved'> = {
      _id: token._id as string,
      name: token.name as string,
      email: token.email as string,
      school: token.school as string,
      message: message ?? ''
    }
    const { status, data } = await this.service.addOtherStudent(
      idTravel,
      +day,
      student
    )
    return res.status(mapStatusHTTP(status)).json(data)
  }

  async updateDay (req: Request, res: Response): Promise<Response> {
    if (req.body.token.role === 'admin') {
      const { status, data } = await this.service.updateDay(
        req.params.idTravel,
        +req.params.day,
        req.body
      )
      return res.status(mapStatusHTTP(status)).json(data)
    }

    return res.status(403).json({ message: 'Usuário não autorizado' })
  }
}

export default TravelController
