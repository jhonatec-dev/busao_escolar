import { type Request, type Response } from 'express'
import SystemService from '../services/system.service'
import { mapStatusHTTP } from '../utils/mapStatusHTTP'

class SystemController {
  private readonly service: SystemService
  constructor () {
    this.service = new SystemService()
  }

  async getBus (req: Request, res: Response): Promise<Response> {
    if (req.body.token.role === 'admin') {
      const { status, data } = await this.service.getBus()
      return res.status(mapStatusHTTP(status)).json(data)
    }
    return res.status(403).json({ message: 'Usuário não autorizado' })
  }

  async updateBus (req: Request, res: Response): Promise<Response> {
    if (req.body.token.role === 'admin') {
      const { status, data } = await this.service.updateBus(req.body.bus)
      return res.status(mapStatusHTTP(status)).json(data)
    }

    return res.status(403).json({ message: 'Usuário não autorizado' })
  }
}

export default SystemController
