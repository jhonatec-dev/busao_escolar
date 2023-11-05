import dayjs from 'dayjs'
import { Schema, model, type Model } from 'mongoose'
import { type ITravel, type ITravelStudent } from '../interfaces/ITravel'

class TravelModel {
  public readonly model: Model<ITravel>

  constructor () {
    const studentScheme = new Schema<ITravelStudent>({
      id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      approved: { type: Boolean, default: false }
    }, {
      _id: false
    })

    const dayTravelScheme = new Schema({
      day: { type: Number, required: true },
      active: { type: Boolean, default: true },
      observations: { type: String, default: '' },
      frequentStudents: [studentScheme],
      otherStudents: [studentScheme]
    }, {
      _id: false
    })

    const schema = new Schema<ITravel>({
      busSits: { type: Number, default: 30 },
      year: { type: Number, default: dayjs().year() },
      month: { type: Number, default: dayjs().month() + 1 },
      days: [dayTravelScheme]
    })
    this.model = model<ITravel>('Travel', schema)
  }

  async find (year: number, month: number): Promise<ITravel[]> {
    return await this.model.find({ year, month })
  }

  async findById (id: string): Promise<ITravel> {
    return (await this.model.findById(id)) as ITravel
  }

  async create (travel: ITravel): Promise<ITravel> {
    return await this.model.create(travel)
  }

  async update (id: string, travel: ITravel): Promise<ITravel> {
    await this.model.updateOne({ _id: id }, travel)
    return await this.findById(id)
  }

  async aproveStudent (
    idTravel: string,
    day: number,
    idStudent: string
  ): Promise<void> {
    await this.model.updateOne(
      { _id: idTravel, 'days.day': day, 'days.otherStudents._id': idStudent },
      { $set: { 'days.$.active': true } }
    )
  }
}

export default new TravelModel()
