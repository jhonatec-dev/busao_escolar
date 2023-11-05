import dayjs from 'dayjs'
import type ServiceResult from '../interfaces/IService'
import {
  type ITravel,
  type ITravelService,
  type ITravelStudent
} from '../interfaces/ITravel'
import studentModel from '../models/student.model'
import systemModel from '../models/system.model'
import travelModel from '../models/travel.model'

class TravelService {
  async getTravelMonth (
    year: number,
    month: number
  ): Promise<ServiceResult<ITravel>> {
    try {
      const data = await travelModel.findOne(year, month)
      return {
        status: 'SUCCESS',
        data
      }
    } catch (error) {
      return {
        status: 'INVALID',
        data: { message: (error as Error).message }
      }
    }
  }

  private async generateStudents (
    days: number[],
    currentTravel: ITravel,
    initialBusSits: number = 30
  ): Promise<ITravel> {
    const students = await studentModel.find(true)
    if (students.length === 0) {
      throw new Error('Nenhum estudante encontrado')
    }
    const { year, month, days: daysTravel } = currentTravel
    const date = dayjs()
      .year(year)
      .month(month - 1)

    for (let i = 1; i <= date.daysInMonth(); i++) {
      if (days.includes(i) && !daysTravel.some((elm) => elm.day === i)) {
        // tenho no meu request, mas nao no banco
        const weekDay = date.date(i).format('dddd').toLowerCase()
        currentTravel.days.push({
          day: i,
          active: true,
          observations: '',
          busSits: initialBusSits,
          frequentStudents: students
            .filter(
              (student) =>
                student.frequency[weekDay as keyof typeof student.frequency]
            )
            .map((student) => ({
              id: student._id as string,
              name: student.name,
              email: student.email,
              approved: true as boolean
            })),
          otherStudents: [] as ITravelStudent[]
        })
      } else if (!days.includes(i) && daysTravel.some((elm) => elm.day === i)) {
        // tenho no banco, mas nao no meu request
        const index = daysTravel.findIndex((elm) => elm.day === i)
        daysTravel[index].active = false
      }
    }

    daysTravel.sort((a, b) => a.day - b.day)

    return {
      ...currentTravel,
      days: daysTravel
    }
  }

  async setMonthTravels (
    travel: ITravelService
  ): Promise<ServiceResult<ITravel>> {
    try {
      const currentTravel = await travelModel.findOrCreate(
        travel.year,
        travel.month
      )
      const initialBusSits = await systemModel.getBus()
      console.log('initialBusSits', initialBusSits)
      const newTravel = await this.generateStudents(travel.days, currentTravel, initialBusSits)
      // throw new Error('teste')

      console.log('newTravel', newTravel)

      const data = await travelModel.update(
        currentTravel._id as string,
        newTravel
      )

      return {
        status: 'CREATED',
        data
      }
    } catch (error) {
      return {
        status: 'INVALID',
        data: { message: (error as Error).message }
      }
    }
  }
}

export default TravelService
