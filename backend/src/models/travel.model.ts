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
        _id: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        school: { type: String, required: true },
        approved: { type: Boolean, default: false },
        message: { type: String, default: '', required: false }
      },
      {
        _id: false
      }
    )

    const dayTravelScheme = new Schema<ITravelDay>(
      {
        day: { type: Number, required: true },
        busSits: { type: Number, default: 30 },
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
    const data = (await this.model.findById(id))
    return data?.toObject() as ITravel
  }

  async create (travel: ITravel): Promise<ITravel> {
    return await this.model.create(travel)
  }

  async findOrCreate (year: number, month: number): Promise<ITravel> {
    const data = await this.model.findOne({ year, month })

    if (data !== null && data !== undefined) {
      return data.toObject() as ITravel
    }
    const newTravel = (await this.model.create({ year, month })).toObject()
    return newTravel
  }

  async update (id: string, travel: Partial<ITravel>): Promise<ITravel> {
    return (await this.model.findByIdAndUpdate({ _id: id }, travel, {
      new: true
    })) as ITravel
  }

  async updateDay (id: string, newTravel: ITravel): Promise<void> {
    // console.log('\n\n\n newTravel on model já', newTravel, '\n\n\n')
    await this.model.updateOne(
      {
        _id: id
      },
      {
        $set: newTravel
      }
    )
  }

  async addOtherStudent (
    idTravel: string,
    day: number,
    student: ITravelStudent
  ): Promise<void> {
    await this.model.findByIdAndUpdate(
      { _id: idTravel },
      {
        $push: {
          'days.$[day].otherStudents': student
        }
      },
      {
        arrayFilters: [{ 'day.day': day }]
      }
    )
  }
}

export default new TravelModel()
