import dayjs from 'dayjs'
import type ServiceResult from '../interfaces/IService'
import { type IStudent } from '../interfaces/IStudent'
import {
  type ITravel,
  type ITravelDay,
  type ITravelService,
  type ITravelStudent
} from '../interfaces/ITravel'
import studentModel from '../models/student.model'
import systemModel from '../models/system.model'
import travelModel from '../models/travel.model'
import emailService from './email.service'

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
    travelToEdit: ITravel,
    initialBusSits: number = 30
  ): Promise<{ newTravel: ITravel, daysToCancel: number[] }> {
    const students = await studentModel.find(true)
    if (students.length === 0) {
      throw new Error('Nenhum estudante encontrado')
    }

    const currentTravel = Object.assign({}, travelToEdit)
    // console.log('DENTRO DA FUNÇÃO \n', currentTravel)

    const { year, month, days: daysTravel } = currentTravel
    const date = dayjs()
      .year(year)
      .month(month - 1)

    const daysToCancel = []

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
        currentTravel.days = currentTravel.days.filter((elm) => elm.day !== i)
        daysToCancel.push(i)
        // TODO: enviar email ao estudante avisando o cancelamento da viagem
        // criar um array de viagens canceladas e agrupar em uma única mensagem
      }
    }

    daysTravel.sort((a, b) => a.day - b.day)

    return {
      newTravel: currentTravel,
      daysToCancel
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
      // console.log('\n \n currentTravel BEFORE \n\n', currentTravel, '\n \n')
      const { newTravel, daysToCancel } = await this.generateStudents(
        travel.days,
        currentTravel,
        initialBusSits
      )
      // console.log('\n \n currentTravel AFTER \n\n', currentTravel, '\n \n')
      // console.log('daysToCancel', daysToCancel)
      if (daysToCancel.length > 0) {
        emailService
          .sendCancelTravelsEmail(currentTravel, daysToCancel)
          .then(() => {
            console.log('Email de cancelamento enviado')
          })
          .catch((error) => {
            console.log('Erro no envio de email de cancelamento:', error)
          })
      }

      const data = await travelModel.update(
        currentTravel._id as string,
        newTravel // mudar para newTravel
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

      if (this.isStudentInTravel(student._id, travel, day)) {
        throw new Error('Estudante já está registrado na viagem')
      }
      await travelModel.addOtherStudent(idTravel, day, {
        ...student,
        approved: false
      })
      await emailService.sendOtherStudentsEmail(
        student as ITravelStudent,
        dayjs(`${travel.year}-${travel.month}-${day}`)
      )
      return {
        status: 'SUCCESS',
        data: 'adicionado com sucesso'
      }
    } catch (error) {
      return {
        status: 'INVALID',
        data: { message: (error as Error).message }
      }
    }
  }

  private genereateUpdatedDayStudents (
    dayTravelDB: ITravelDay,
    newDayTravel: ITravelDay
  ): ITravelStudent[] {
    // analisar os dois objetos verificando se o estudante no newDayTravel está como accepted e o DB não
    const result: ITravelStudent[] = []
    newDayTravel.otherStudents.forEach((student) => {
      if (student.approved) {
        const studentDB = dayTravelDB.otherStudents.find(
          (elm) => elm._id === student._id
        ) as ITravelStudent
        if (!studentDB.approved) {
          result.push(student)
        }
      }
    })

    return result
  }

  async updateDay (
    idTravel: string,
    day: number,
    travelDay: Partial<ITravelDay>
  ): Promise<ServiceResult<string>> {
    try {
      const travel = await travelModel.findById(idTravel)
      if (travel === null) {
        throw new Error('Viagem não encontrada')
      }
      const dayTravelDB = travel.days.find((elm) => elm.day === day)
      if (dayTravelDB === undefined) {
        throw new Error('Viagem não encontrada')
      }
      const studentsToSendEmail = this.genereateUpdatedDayStudents(
        dayTravelDB,
        travelDay as ITravelDay
      )
      await travelModel.updateDay(idTravel, day, travelDay)
      // TODO: gerar corretamente a lista de alunos que devem receber o email
      if (studentsToSendEmail.length > 0) {
        await emailService.sendOtherStudentsConfirmationEmail(
          dayjs(`${travel.year}-${travel.month}-${day}`),
          studentsToSendEmail
        )
      }
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

  async removeStudentsOfTravels (idToRemove: string): Promise<void> {
    try {
      const today = dayjs()
      const currYear = today.year()
      const currMonth = today.month() + 1
      const currDay = today.date()
      const tripsToUpdate = await travelModel.model.find({
        $or: [
          {
            year: currYear,
            month: currMonth,
            'days.day': { $gte: currDay }
          },
          {
            year: currYear,
            month: { $gt: currMonth }
          },
          {
            year: { $gt: currYear }
          }
        ]
      })

      for (const trip of tripsToUpdate) {
        trip.days.forEach((day) => {
          if (
            (trip.year === currYear &&
              trip.month === currMonth &&
              day.day >= currDay) ||
            (trip.year === currYear && trip.month > currMonth) ||
            trip.year > currYear
          ) {
            // console.log(idToRemove, day.frequentStudents)
            day.frequentStudents = day.frequentStudents.filter(
              (s) => s._id !== idToRemove
            )
            day.otherStudents = day.otherStudents.filter(
              (s) => s._id !== idToRemove
            )
          }
        })

        await trip.save()
      }
    } catch (error) {
      throw new Error((error as Error).message)
    }
  }

  async updateStudentOnTravels (student: IStudent): Promise<void> {
    // TODO: testar sem frequência
    try {
      const today = dayjs()
      const currYear = today.year()
      const currMonth = today.month() + 1
      const currDay = today.date()
      const tripsToUpdate = await travelModel.model.find({
        $or: [
          {
            year: currYear,
            month: currMonth,
            'days.day': { $gte: currDay }
          },
          {
            year: currYear,
            month: { $gt: currMonth }
          },
          {
            year: { $gt: currYear }
          }
        ]
      })

      const studentTravel: ITravelStudent = {
        _id: student._id as string,
        name: student.name,
        email: student.email,
        school: student.school,
        approved: true
      }

      for (const trip of tripsToUpdate) {
        trip.days.forEach((dayTravel) => {
          if (
            (trip.year === currYear &&
              trip.month === currMonth &&
              dayTravel.day >= currDay) ||
            (trip.year === currYear && trip.month > currMonth) ||
            trip.year > currYear
          ) {
            // TODO: verificar sobre o dia da semana da frequencia do estudante
            const weekDay = dayjs(`${trip.year}-${trip.month}-${dayTravel.day}`)
              .format('dddd')
              .toLowerCase()

            if (student.frequency[weekDay as keyof typeof student.frequency]) {
              // Adicione o estudante à lista de frequentStudents
              if (
                !dayTravel.frequentStudents.some(
                  (student) => student._id === studentTravel._id.toString()
                )
              ) {
                dayTravel.frequentStudents.push(studentTravel)
              }

              // Remova o estudante da lista de otherStudents
              if (
                dayTravel.otherStudents.some(
                  (student) => student._id === studentTravel._id.toString()
                )
              ) {
                dayTravel.otherStudents = dayTravel.otherStudents.filter(
                  (student) => student._id !== studentTravel._id.toString()
                )
              }
            } else {
              // não é o dia da semana frequente do aluno
              // remover ele da lista de frequentes

              dayTravel.frequentStudents = dayTravel.frequentStudents.filter(
                (student) => student._id !== studentTravel._id.toString()
              )
            }
          }
        })

        // Salve as alterações na viagem após o processamento de todos os dias do mês

        await trip.save()
      }
    } catch (error) {
      throw new Error((error as Error).message)
    }
  }
}

export default new TravelService()
