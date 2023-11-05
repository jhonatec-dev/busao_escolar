import { type NextFunction, type Request, type Response } from 'express'
import validator from 'validator'

export const validateDateTravelBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { year, month } = req.body
  if (year === undefined || month === undefined) {
    res.status(400).json({ message: 'Ano e mês devem ser informados' })
    return
  }

  if (!validator.isNumeric(year) || !validator.isNumeric(month)) {
    res.status(400).json({ message: 'Ano e mês devem ser numéricos' })
    return
  }

  if (year < 2010 || year > 2100 || month < 0 || month > 12) {
    res.status(400).json({ message: 'Ano ou mês inválidos' })
    return
  }

  next()
}

export const validateDateTravelQuery = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { year, month } = req.query
  if (year === undefined || month === undefined) {
    res.status(400).json({ message: 'Ano e mês devem ser informados' })
    return
  }

  if (+year < 2010 || +year > 2100 || +month < 0 || +month > 12) {
    res.status(400).json({ message: 'Ano ou mês inválidos' })
    return
  }

  req.body = {
    year: +year,
    month: +month
  }

  next()
}
