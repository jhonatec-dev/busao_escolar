import { type NextFunction, type Request, type Response } from 'express'
import studentModel from '../models/student.model'
import JWT from '../utils/JWT'

const extractToken = (bearerToken: string): string => {
  return bearerToken.split(' ')[1]
}

const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { authorization } = req.headers

  if (authorization === undefined) {
    res.status(401).json({ message: 'Token não encontrado' })
    return
  }

  try {
    const token = extractToken(authorization)
    const validToken = JWT.verifyToken(token)
    const student = await studentModel.findByEmail(validToken.email)
    if (student === null || student === undefined || !student.accepted) {
      throw new Error('User not found')
    }

    req.body.token = validToken
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' })
    return
  }

  next()
}

export default validateToken
