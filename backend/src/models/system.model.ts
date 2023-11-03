import { Schema, model, type Model } from 'mongoose'
import type ISystem from '../interfaces/ISystem'

class StudentModel {
  public readonly model: Model<ISystem>

  constructor () {
    const schema = new Schema<ISystem>({
      bus: { type: Number, default: 30 },
      emailOnRegister: { type: String, default: '' },
      emailOnRegisterAdmin: { type: String, default: '' },
      emailOnForgotPassword: { type: String, default: '' },
      emailOnAccept: { type: String, default: '' },
      emailTravelOnAccept: { type: String, default: '' },
      emailTravelOnReject: { type: String, default: '' },
      emailTravelOnCancel: { type: String, default: '' }
    })
    this.model = model<ISystem>('System', schema)
    // buscar um registro, se não encontrar, cria um novo
  }

  async findOrCreate (): Promise<ISystem> {
    const data = await this.model.findOne()
    if (data === null) {
      return await this.model.create({})
    }
    return data
  }

  async updateBus (bus: number): Promise<void> {
    await this.model.updateOne({}, { bus })
  }

  async getBus (): Promise<number> {
    const data = await this.findOrCreate()
    return data.bus
  }
}

export default new StudentModel()
