import { configDotenv } from 'dotenv'
import nodemailer from 'nodemailer'
import { type IStudent } from '../interfaces/IStudent'

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
    const subject = 'Bem vindo ao Busão Escolar!'
    let text = `<h2>Olá, ${student.name}!</h2><h3>Seja bem vindo ao Busão Escolar!</h3>`
    text += '<p>Seu cadastro foi realizado com sucesso.</p>'
    text += '<br>'
    text += '<p>Por favor aguarde o administrador liberar seu cadastro.</p>'
    text += '<br>'
    text += '<p>Atenciosamente,</p>'
    text += '<p>Equipe Busão Escolar</p>'
    text += '<br><br>'
    text +=
      "<span style='font-size: 0.8em;'>Este e-mail foi enviado automaticamente, por favor não responder.</span>"
    await this.sendEmail([student.email], subject, text)
    if (adminList.length > 0) {
      const subjectAdmin = 'Novo cadastro no Busão Escolar!'
      text = '<h2>Novo cadastro no Busão Escolar!</h2>'
      text += '<br>'
      text += '<p>Entre na sua conta e confirme o cadastro de </p>'
      text += `<p>${student.name} / ${student.email} / ${student.school}.</p>`
      text += '<br><br>'
      text += '<p>Atenciosamente,</p>'
      text += '<p>Equipe Busão Escolar</p>'
      text += '<br><br>'
      text +=
        "<span style='font-size: 0.8em;'>Este e-mail foi enviado automaticamente, por favor não responder.</span>"
      await this.sendEmail(adminList, subjectAdmin, text)
    }
  }
}

export default new Email()
