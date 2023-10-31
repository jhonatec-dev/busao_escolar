import { type NextFunction, type Request, type Response } from 'express'
import validator from 'validator'

const validateCreateStudent = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body
  if (email === undefined || password === undefined) {
    res.status(400).json({ message: 'Email e Senha são campos obrigatórios' })
    return
  }

  if (!validator.isEmail(email)) {
    res.status(400).json({ message: 'Email inválido' })
    return
  }

  if (!validator.isLength(password, { min: 6 })) {
    res.status(400).json({ message: 'Senha possui menos de 6 caracteres' })
    return
  }

  next()
}

export default validateCreateStudent
