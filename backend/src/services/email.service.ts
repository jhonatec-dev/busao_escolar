import dayjs, { type Dayjs } from 'dayjs'
import { configDotenv } from 'dotenv'
import nodemailer from 'nodemailer'
import { type IStudent } from '../interfaces/IStudent'
import { type ITravel, type ITravelStudent } from '../interfaces/ITravel'
import emailModel from '../models/email.model'

configDotenv()

class Email {
  private readonly transporter = nodemailer.createTransport({
    host: 'mail.jhonatec.com',
    service: 'mail.jhonatec.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  private async sendEmail (
    destination: string[],
    subject: string,
    text: string
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: destination,
        subject,
        html: text
      })
    } catch (error) {
      console.log('Erro no envio de email:', error)
    }
  }

  public async sendConfirmationEmail (
    student: IStudent,
    adminList: string[]
  ): Promise<void> {
    const studentEmailMessage = emailModel.getConfirmationEmail(student)
    await this.sendEmail(
      [student.email],
      studentEmailMessage.subject,
      studentEmailMessage.html
    )
    if (adminList.length > 0) {
      const aminEmailMessage = emailModel.getAdminConfirmationEmail(student)
      await this.sendEmail(
        adminList,
        aminEmailMessage.subject,
        aminEmailMessage.html
      )
    }
  }

  public async sendActivationEmail (student: IStudent): Promise<void> {
    const studentEmailMessage = emailModel.getActivationEmail(student)
    await this.sendEmail(
      [student.email],
      studentEmailMessage.subject,
      studentEmailMessage.html
    )
  }

  public async sendChangeFrequencyEmail (student: IStudent): Promise<void> {
    if (!student.accepted) return
    const studentEmailMessage = emailModel.getChangeFrequencyEmail(student)
    await this.sendEmail(
      [student.email],
      studentEmailMessage.subject,
      studentEmailMessage.html
    )
  }

  public async sendDeleteEmail (student: IStudent): Promise<void> {
    const studentEmailMessage = emailModel.getDeleteEmail(student)
    await this.sendEmail(
      [student.email],
      studentEmailMessage.subject,
      studentEmailMessage.html
    )
  }

  public async sendOtherStudentsEmail (
    student: ITravelStudent,
    date: Dayjs
  ): Promise<void> {
    const studentEmailMessage = emailModel.getOtherStudentsEmail(student, date)
    await this.sendEmail(
      [student.email],
      studentEmailMessage.subject,
      studentEmailMessage.html
    )
  }

  public async sendOtherStudentsConfirmationEmail (
    date: Dayjs,
    studentsList: ITravelStudent[]
  ): Promise<void> {
    const emails: string[] = studentsList.map((student) => student.email)
    const studentEmailMessage =
      emailModel.getOtherStudentsConfirmationEmail(date)
    await this.sendEmail(
      emails,
      studentEmailMessage.subject,
      studentEmailMessage.html
    )
  }

  public async sendCancelTravelsEmail (
    travel: ITravel,
    daysToCancel: number[]
  ): Promise<void> {
    try {
      // console.log('Cancelando travels: no emailService', daysToCancel, travel)
      if (daysToCancel.length === 0) return

      const promiseArray: Array<Promise<void>> = []

      daysToCancel.forEach((day) => {
        const foundDayTravel = travel.days.find(
          (dayTravel) => dayTravel.day === day
        )
        // console.log('\n foundDayTravel', foundDayTravel)
        if (foundDayTravel === undefined) return
        const destinations = foundDayTravel.otherStudents.map(
          (student) => student.email
        )
        // console.log('\n destinations', destinations)
        if (destinations.length === 0) return
        const studentEmailMessage = emailModel.getCancelTravelsEmail(
          dayjs(`${travel.year}-${travel.month}-${day}`)
        )
        // console.log(
        //   '\n\n Emails pra cancelamento\n',
        //   studentEmailMessage,
        //   '\nDestinatários:',
        //   destinations
        // )
        promiseArray.push(
          this.sendEmail(
            destinations,
            studentEmailMessage.subject,
            studentEmailMessage.html
          )
        )
      })

      // if (promiseArray.length > 0) {
      //   Promise.all(promiseArray)
      //     .then(() => {
      //       console.log('Email enviado com sucesso')
      //     })
      //     .catch(() => {
      //       console.log('Erro no envio de email')
      //     })
      // }
    } catch (error) {
      console.log('Erro no envio de email: GERAL NO CANCELAMENTO \n', error)
    }
  }
}

export default new Email()
