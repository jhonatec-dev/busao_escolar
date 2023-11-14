import { type Request, type Response } from 'express'
import requestService from '../services/request.service'
import { mapStatusHTTP } from '../utils/mapStatusHTTP'

class RequestController {
  async getRequests (req: Request, res: Response): Promise<void> {
    if (req.body.token.role === 'admin') {
      const { status, data } = await requestService.getRequests()
      res.status(mapStatusHTTP(status)).json(data)
    } else {
      res.status(403).json({ message: 'Usuário não autorizado' })
    }
  }
}

export default new RequestController()
