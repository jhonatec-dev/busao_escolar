import { Schema, model, type Model } from 'mongoose'
import { type IStudent } from '../interfaces/IStudent'

class StudentModel {
  public readonly model: Model<IStudent>

  constructor () {
    const schema = new Schema<IStudent>({
      name: { type: String, required: true },
      school: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
      role: { type: String, default: 'student' },
      accepted: { type: Boolean, default: false },
      frequency: {
        monday: { type: Boolean, default: false },
        tuesday: { type: Boolean, default: false },
        wednesday: { type: Boolean, default: false },
        thursday: { type: Boolean, default: false },
        friday: { type: Boolean, default: false },
        saturday: { type: Boolean, default: false },
        sunday: { type: Boolean, default: false }
      }
    })
    this.model = model<IStudent>('Student', schema)
  }

  async create (student: IStudent): Promise<IStudent> {
    const { password, ...data } = (await this.model.create(student)).toObject()
    return data
  }

  async find (): Promise<IStudent[]> {
    return await this.model.find().select('_id name')
  }

  async findById (id: string): Promise<IStudent> {
    return await this.model.findById(id).select('-password')
  }

  async findByEmail (email: string): Promise<IStudent | null> {
    return (await (
      await this.model.findOne({
        email
      })
    )?.toObject()) as IStudent
  }

  async getAdminList (): Promise<string[]> {
    const data = await this.model
      .find({ role: 'admin', accepted: true })
      .select('email')
    return data.map((item) => item.email)
  }

  async update (id: string, student: IStudent): Promise<IStudent> {
    await this.model.updateOne({ _id: id }, student)
    return await this.findById(id)
  }

  async delete (id: string): Promise<void> {
    await this.model.deleteOne({ _id: id })
  }

  async accept (id: string): Promise<void> {
    await this.model.updateOne({ _id: id }, { accepted: true })
  }
}

export default new StudentModel()
