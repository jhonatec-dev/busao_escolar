import dayjs from 'dayjs'
import { Schema, model, type Model } from 'mongoose'
import {
  type ITravel,
  type ITravelDay,
  type ITravelStudent
} from '../interfaces/ITravel'

class TravelModel {
  public readonly model: Model<ITravel>

  constructor () {
    const studentScheme = new Schema<ITravelStudent>(
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        approved: { type: Boolean, default: false }
      },
      {
        _id: false
      }
    )

    const dayTravelScheme = new Schema<ITravelDay>(
      {
        day: { type: Number, required: true },
        active: { type: Boolean, default: true },
        observations: { type: String, default: '' },
        frequentStudents: [studentScheme],
        otherStudents: [studentScheme]
      },
      {
        _id: false
      }
    )

    const schema = new Schema<ITravel>({
      busSits: { type: Number, default: 30 },
      year: { type: Number, default: dayjs().year() },
      month: { type: Number, default: dayjs().month() + 1 },
      days: [dayTravelScheme]
    })
    this.model = model<ITravel>('Travel', schema)
  }

  async findOne (year: number, month: number): Promise<ITravel> {
    return (await this.model.findOne({ year, month })) as ITravel
  }

  async findById (id: string): Promise<ITravel> {
    return (await this.model.findById(id)) as ITravel
  }

  async create (travel: ITravel): Promise<ITravel> {
    return await this.model.create(travel)
  }

  async findOrCreate (
    year: number,
    month: number,
    busSits: number
  ): Promise<ITravel> {
    const data = await this.model.findOne({ year, month })

    if (data !== null && data !== undefined) {
      console.log(data)
      return data as ITravel
    }
    return await this.model.create({ year, month, busSits })
  }

  async update (id: string, travel: Partial<ITravel>): Promise<ITravel> {
    return (await this.model.findByIdAndUpdate({ _id: id }, travel, {
      new: true
    })) as ITravel
  }

  async aproveStudent (
    idTravel: string,
    day: number,
    idStudent: string
  ): Promise<void> {
    await this.model.updateOne(
      { _id: idTravel, 'days.day': day, 'days.$.otherStudents._id': idStudent },
      { $set: { 'days.$.active': true } }
    )
  }
}

export default new TravelModel()
