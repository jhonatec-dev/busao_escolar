import { Error } from 'mongoose'
import type ServiceResult from '../interfaces/IService'
import { type IStudent } from '../interfaces/IStudent'
import StudentModel from '../models/student.model'
import JWT from '../utils/JWT'
import { comparePassword, encrypt } from '../utils/encrypt'
import Email from '../utils/sendEmail'

class StudentService {
  async find (): Promise<ServiceResult<IStudent[]>> {
    const data = await StudentModel.find()
    return {
      status: 'SUCCESS',
      data
    }
  }

  async findById (id: string): Promise<ServiceResult<IStudent>> {
    try {
      const data = await StudentModel.findById(id)
      if (data === null) {
        throw new Error('Usuário não encontrado')
      }
      return {
        status: 'SUCCESS',
        data
      }
    } catch (error: Error | any) {
      return {
        status: 'NOT_FOUND',
        data: { message: error.message }
      }
    }
  }

  async login ({
    email,
    password
  }: {
    email: string
    password: string
  }): Promise<ServiceResult<{ token: string }>> {
    try {
      const data = await StudentModel.findByEmail(email)
      // console.log('data no Service', data)
      if (data === null || data === undefined) {
        throw new Error('Usuário ou Senha inválidos')
      }

      if (
        data.password !== undefined &&
        !comparePassword(password, data.password)
      ) {
        throw new Error('Usuário ou Senha inválidos')
      }

      const { password: passwordDB, frequency, ...student } = data

      if (!data.accepted) {
        throw new Error('Aguarde no seu E-mail a aprovação do cadastro')
      }

      const token = JWT.generateToken(student)

      return {
        status: 'SUCCESS',
        data: { token }
      }
    } catch (error: Error | any) {
      return {
        status: 'NOT_FOUND',
        data: { message: error.message }
      }
    }
  }

  async create (student: IStudent): Promise<ServiceResult<IStudent>> {
    try {
      await StudentModel.model.validate(student)

      const studentWithSameEmail = await StudentModel.findByEmail(
        student.email
      )
      if (studentWithSameEmail !== null && studentWithSameEmail !== undefined) {
        let errorMessage = 'Usuário já cadastrado'
        if (!studentWithSameEmail.accepted) {
          errorMessage += ' - Aguardando aprovação do administrador'
        }
        throw new Error(errorMessage)
      }
      if (student.password !== undefined) {
        student.password = encrypt(student.password)
      }
      const data = await StudentModel.create({
        ...student,
        accepted: false,
        role: 'student'
      })
      const adminList = await StudentModel.getAdminList()
      await Email.sendConfirmationEmail(student, adminList)
      return {
        status: 'CREATED',
        data
      }
    } catch (error: Error | any) {
      return {
        status: 'INVALID',
        data: { message: error.message }
      }
    }
  }

  private async isDuplicateEmail (email: string, _id: string): Promise<boolean> {
    const data = await StudentModel.model.find({ email, _id: { $ne: _id } })
    return data.length > 0
  }

  async update (
    id: string,
    student: IStudent
  ): Promise<ServiceResult<IStudent>> {
    // verificar se o estudante existe
    try {
      const data = await StudentModel.findById(id)
      if (data === null) {
        throw new Error('Usuário não encontrado')
      }
      if (await this.isDuplicateEmail(student.email, id)) {
        throw new Error('Email já existe')
      }
      await StudentModel.update(id, student)
      return {
        status: 'UPDATED',
        data
      }
    } catch (error: Error | any) {
      return {
        status: 'INVALID',
        data: { message: error.message }
      }
    }
    // verificar duplicidade de email
  }

  async delete (id: string): Promise<ServiceResult<{ _id: string }>> {
    try {
      const data = await StudentModel.findById(id)
      if (data === null) {
        throw new Error('Usuário não encontrado')
      }
      await StudentModel.delete(id)
      return {
        status: 'DELETED',
        data: {
          _id: id
        }
      }
    } catch (error: Error | any) {
      return {
        status: 'INVALID',
        data: { message: error.message }
      }
    }
  }

  async accept (id: string): Promise<ServiceResult<{ _id: string }>> {
    try {
      const data = await StudentModel.findById(id)
      if (data === null) {
        throw new Error('Usuário não encontrado')
      }
      await StudentModel.accept(id)
      return {
        status: 'SUCCESS',
        data: {
          _id: id
        }
      }
    } catch (error: Error | any) {
      return {
        status: 'INVALID',
        data: { message: error.message }
      }
    }
  }
}

export default StudentService
