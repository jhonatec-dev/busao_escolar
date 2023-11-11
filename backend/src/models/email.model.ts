import { type Dayjs } from 'dayjs'
import { configDotenv } from 'dotenv'
import type IEmail from '../interfaces/IEmail'
import { type IStudent } from '../interfaces/IStudent'
import { type ITravelStudent } from '../interfaces/ITravel'

configDotenv()
const IMG_URL = `${process.env.FRONT_END_URL}/logo192.png`

const WEEKDAYS = {
  sunday: 'Domingo',
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado'
}

class EmailModel {
  private getFooter (): string {
    let text = '<br>'
    text += '<p>Atenciosamente,</p>'
    text += `<img src="${IMG_URL}" alt="Busão Escolar" style="width: 100px; height: 100px;" />`
    text += '<p>Equipe Busão Escolar</p>'
    text += '<br>'
    text += `<span style='font-size: 0.8em;'>
    Este e-mail foi enviado automaticamente, por favor não responder.</span>`

    return text
  }

  private getAccessButton (): string {
    return `<button style="background-color: #333; color: #fff; 
    padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; 
    text-decoration: none;">
    <a href="${process.env.FRONT_END_URL}" target="_blank" 
    style="text-decoration: none; color: inherit;">
    Acessar conta
    </a>
    </button>`
  }

  public getConfirmationEmail = (student: IStudent): IEmail => {
    const email: IEmail = { subject: '', html: '' }
    email.subject = 'Bem vindo ao Busão Escolar!'
    let text = `<h2>Olá, ${student.name}!</h2>`
    text += '<h3>Seja bem vindo ao Busão Escolar!</h3>'
    text += '<p>Seu cadastro foi realizado com sucesso.</p>'
    text += '<br>'
    text += '<h4>Por favor aguarde o administrador liberar seu cadastro.</h4>'

    email.html = text + this.getFooter()

    return email
  }

  public getAdminConfirmationEmail (student: IStudent): IEmail {
    const email: IEmail = { subject: '', html: '' }
    email.subject = 'Novo cadastro no Busão Escolar!'

    let text = '<h2>Novo cadastro no Busão Escolar!</h2>'
    text += '<br>'
    text += '<h3>Entre na sua conta e confirme o cadastro de </h3>'
    text += `<p><strong>Nome:</strong> ${student.name}</p>`
    text += `<p><strong>E-mail:</strong> ${student.email}</p>`
    text += `<p><strong>Escola:</strong> ${student.school}.</p>`
    text += '<br><br>'
    text += this.getAccessButton()

    email.html = text + this.getFooter()
    return email
  }

  public getActivationEmail (student: IStudent): IEmail {
    const email: IEmail = { subject: '', html: '' }
    email.subject = 'Cadastro aprovado no Busão Escolar!'

    let text = `<h2>Olá, ${student.name}!</h2>`
    text += '<h3>Seu cadastro foi aprovado no Busão Escolar!</h3>'
    text += '<br>'
    text += '<h3>Os dados do seu cadastro são:</h3>'
    text += `<p><strong>Nome:</strong> ${student.name}</p>`
    text += `<p><strong>E-mail:</strong> ${student.email}</p>`
    text += `<p><strong>Escola:</strong> ${student.school}.</p>`
    text += '<br>'
    text += '<h4>Frequência:</h4>'
    text += '<ul>'
    Object.entries(student.frequency).forEach(([key, value]) => {
      if (value) text += `<li>${WEEKDAYS[key as keyof typeof WEEKDAYS]}</li>`
    })
    text += '</ul>'
    text +=
      '<h4>Sua frequência é gerenciada pelo administrador do Busão Escolar.</h4>'
    text += '<br>'
    text += this.getAccessButton()

    email.html = text + this.getFooter()

    return email
  }

  public getChangeFrequencyEmail (student: IStudent): IEmail {
    const email: IEmail = { subject: '', html: '' }
    email.subject = 'Frequência alterada no Busão Escolar!'
    let text = `<h2>Olá, ${student.name}!</h2>`
    text += '<h3>Sua frequência foi alterada no Busão Escolar!</h3>'
    text += '<br>'
    text +=
      '<h3>Isso afeta suas vagas automaticamente confirmadas à partir de agora.</h3>'
    text += '<br>'
    text += '<h4>Frequência:</h4>'
    text += '<ul>'
    Object.entries(student.frequency).forEach(([key, value]) => {
      if (value) text += `<li>${WEEKDAYS[key as keyof typeof WEEKDAYS]}</li>`
    })
    text += '</ul>'
    text +=
      '<h4>Sua frequência foi alterada pelo administrador do Busão Escolar.</h4>'
    text += '<br>'
    text += this.getAccessButton()

    email.html = text + this.getFooter()

    return email
  }

  public getDeleteEmail (student: IStudent): IEmail {
    const email: IEmail = { subject: '', html: '' }
    email.subject = 'Remoção de cadastro no Busão Escolar!'

    let text = `<h2>Olá, ${student.name}!</h2>`
    text += '<h3>Seu cadastro foi removido do Busão Escolar!</h3>'
    text += '<br>'
    text += '<h4>Obrigado por utilizar o Busão Escolar.</h4>'

    email.html = text + this.getFooter()

    return email
  }

  public getOtherStudentsEmail (student: ITravelStudent, date: Dayjs): IEmail {
    const email: IEmail = { subject: '', html: '' }
    email.subject = 'Solicitação de vaga no Busão Escolar!'

    let text = `<h2>Olá, ${student.name}!</h2>`
    text += '<h3>Recebemos seu pedido de vaga no Busão Escolar!</h3>'
    text += '<br>'
    text += `<h3><strong>Data:</strong> ${date.format('DD/MM/YYYY')}</h3>`
    text += `<p><strong>Nome:</strong> ${student.name}</p>`
    text += `<p><strong>Escola:</strong> ${student.school}.</p>`
    text += `<p><strong>Mensagem:</strong> ${student.message}</p>`
    text += '<br>'
    text += '<p>Aguarde o administrador liberar sua vaga.</p>'

    email.html = text + this.getFooter()

    return email
  }

  public getOtherStudentsConfirmationEmail (date: Dayjs): IEmail {
    const email: IEmail = { subject: '', html: '' }
    email.subject = 'Confirmação de vaga no Busão Escolar!'

    let text = '<h2>Olá!</h2>'
    text += '<h3>Seu pedido de vaga foi confirmado no Busão Escolar!</h3>'
    text += '<br>'
    text += `<h3><strong>Data:</strong> ${date.format('DD/MM/YYYY')}</h3>`
    text += '<p>Não se esqueça de estar no ponto de ônibus!</p>'
    text += '<br>'
    text += this.getAccessButton()

    email.html = text + this.getFooter()

    return email
  }

  public getCancelTravelsEmail (date: Dayjs): IEmail {
    const email: IEmail = { subject: '', html: '' }
    email.subject = 'Cancelamento de viagem no Busão Escolar!'

    let text = '<h2>Olá!</h2>'
    text +=
      '<h3>Uma viagem que você solicitou vaga foi cancelada no Busão Escolar!</h3>'
    text += '<br>'
    text += `<h3><strong>Data:</strong> ${date.format('DD/MM/YYYY')}</h3>`
    text += '<br>'
    text += this.getAccessButton()

    email.html = text + this.getFooter()

    return email
  }
}

export default new EmailModel()
