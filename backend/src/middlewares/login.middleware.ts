import { type NextFunction, type Request, type Response } from 'express'
import validator from 'validator'

const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body
  console.log('middleware', email, password)
  if (
    email === undefined ||
    password === undefined ||
    !validator.isEmail(email as string) ||
    !validator.isLength(password, { min: 6 })
  ) {
    res.status(400).json({ message: 'Dados de login inválidos' })
    return
  }

  next()
}

export default validateLogin
