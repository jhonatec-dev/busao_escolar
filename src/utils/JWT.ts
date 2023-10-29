import { configDotenv } from "dotenv";
import * as Jwt from "jsonwebtoken";

configDotenv();

export const generateToken = (payload: any) => {
  console.log(process.env.JWT_SECRET);
  return Jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1d" });
}

export const verifyToken = (token: string) => {
  return Jwt.verify(token, process.env.JWT_SECRET as string)
}