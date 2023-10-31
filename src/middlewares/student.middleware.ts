import { NextFunction, Request, Response } from "express";
import validator from "validator";

const validateCreateStudent = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email e Senha são campos obrigatórios" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Email inválido" });
  }

  if (!validator.isLength(password, { min: 6 })) {
    return res.status(400).json({ message: "Senha possui menos de 6 caracteres" });
  }

  next();
};

export default validateCreateStudent;
