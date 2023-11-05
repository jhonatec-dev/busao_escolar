import dayjs from 'dayjs'
import type ServiceResult from '../interfaces/IService'
import {
  type ITravel,
  type ITravelDay,
  type ITravelService,
  type ITravelStudent
} from '../interfaces/ITravel'
import studentModel from '../models/student.model'
import travelModel from '../models/travel.model'

class TravelService {
  async generateStudents (
    days: number[],
    year: number,
    month: number
  ): Promise<ITravelDay[]> {
    const students = await studentModel.find(true)
    if (students.length === 0) {
      throw new Error('Nenhum estudante encontrado')
    }

    const data: ITravelDay[] = days.map((day) => {
      const weekDay = dayjs()
        .year(year)
        .month(month - 1)
        .date(day)
        .format('dddd')
        .toLowerCase()
      console.log('weekDay', weekDay)

      return {
        day,
        active: true,
        observations: '',
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
      }
    })

    console.log('data', data)
    return data
  }

  async create (travel: ITravelService): Promise<ServiceResult<ITravel>> {
    try {
      const daysTravel = await this.generateStudents(
        travel.days,
        travel.year,
        travel.month
      )
      // throw new Error('teste')
      const data = await travelModel.create({
        ...travel,
        days: daysTravel
      })
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
