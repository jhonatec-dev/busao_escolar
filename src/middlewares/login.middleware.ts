import { NextFunction, Request, Response } from "express";
import validator from "validator";

const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (
    !email ||
    !password ||
    !validator.isEmail(email) ||
    !validator.isLength(password, { min: 6 })
  ) {
    return res.status(400).json({ message: "Dados de login inválidos" });
  }

  next();
};

export default validateLogin;
