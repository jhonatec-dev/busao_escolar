import type ServiceResult from '../interfaces/IService'
import SystemModel from '../models/system.model'

class SystemService {
  async getBus (): Promise<ServiceResult<number>> {
    const data = await SystemModel.getBus()
    return {
      status: 'SUCCESS',
      data
    }
  }

  async updateBus (bus: number): Promise<ServiceResult<string>> {
    try {
      await SystemModel.updateBus(bus)
      return {
        status: 'SUCCESS',
        data: 'atualizado com sucesso'
      }
    } catch (error) {
      return {
        status: 'INVALID',
        data: { message: (error as Error).message }
      }
    }
  }
}

export default SystemService
