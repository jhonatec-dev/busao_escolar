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
              _id: student._id as string,
              name: student.name,
              email: student.email,
              school: student.school,
              approved: true as boolean
            })),
          otherStudents: [] as ITravelStudent[]
        })
      } else if (!days.includes(i) && daysTravel.some((elm) => elm.day === i)) {
        // tenho no banco, mas nao no meu request
        const index = daysTravel.findIndex((elm) => elm.day === i)
        daysTravel[index].active = false
        // TODO: enviar email ao estudante avisando o cancelamento da viagem
        // criar um array de viagens canceladas e agrupar em uma única mensagem
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
      const newTravel = await this.generateStudents(
        travel.days,
        currentTravel,
        initialBusSits
      )
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

  private isStudentInTravel (
    studentId: string,
    travel: ITravel,
    day: number
  ): boolean {
    const dayTravel = travel.days.find((elm) => elm.day === day)
    if (dayTravel === undefined) {
      throw new Error('Viagem não encontrada')
    }
    return (
      dayTravel.frequentStudents.some((elm) => elm._id === studentId) ||
      dayTravel.otherStudents.some((elm) => elm._id === studentId)
    )
  }

  async addOtherStudent (
    idTravel: string,
    day: number,
    student: Omit<ITravelStudent, 'approved'>
  ): Promise<ServiceResult<string>> {
    try {
      const travel = await travelModel.findById(idTravel)
      if (travel === null) {
        throw new Error('Viagem não encontrada')
      }
      // TODO: verificar se o estudante já está como frequente no mesmo dia da semana que a viagem solicitada
      if (this.isStudentInTravel(student._id, travel, day)) {
        throw new Error('Estudante já está registrado na viagem')
      }
      await travelModel.addOtherStudent(idTravel, day, {
        ...student,
        approved: false
      })
      return {
        status: 'SUCCESS',
        data: 'adicionado com sucesso'
      }
      // TODO: enviar email confirmando o agendamento
    } catch (error) {
      return {
        status: 'INVALID',
        data: { message: (error as Error).message }
      }
    }
  }
}

export default TravelService
