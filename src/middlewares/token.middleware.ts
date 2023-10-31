import { NextFunction, Request, Response } from "express";
import studentModel from "../models/student.model";
import JWT from "../utils/JWT";

const extractToken = (bearerToken: string) => {
  return bearerToken.split(" ")[1];
};

const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(400).json({ message: "Token não encontrado" });
  }

  try {
    const token = extractToken(authorization);
    const validToken = JWT.verifyToken(token) as any;
    const student = await studentModel.findByEmail(validToken.email);
    if (!student || !student.accepted) {
      throw new Error("User not found");
    }

    req.body.token = validToken;
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }

  next();
};

export default validateToken;
