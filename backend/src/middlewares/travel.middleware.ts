import { type NextFunction, type Request, type Response } from 'express'

export const validateTravelBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { year, month } = req.body
  if (year === undefined || month === undefined) {
    res.status(400).json({ message: 'Ano e mês devem ser informados' })
    return
  }

  if (typeof year !== 'number' || typeof month !== 'number') {
    res.status(400).json({ message: 'Ano e mês devem ser numéricos' })
    return
  }

  if (year < 2010 || year > 2100 || month < 0 || month > 12) {
    res.status(400).json({ message: 'Ano ou mês inválidos' })
    return
  }

  next()
}

export const validateTravelParams = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { year, month } = req.params
  if (year === undefined || month === undefined) {
    res.status(400).json({ message: 'Ano e mês devem ser informados' })
    return
  }

  if (+year < 2010 || +year > 2100 || +month < 0 || +month > 12) {
    res.status(400).json({ message: 'Ano ou mês inválidos' })
    return
  }

  next()
}
