import bcrypt from "bcrypt";
import { configDotenv } from "dotenv";

configDotenv();

const saltRounds = process.env.SALT_ROUNDS;
const secrete = process.env.SECRET_SECRETA;

export const encrypt = (password: string) => {
  return bcrypt.hashSync(password, Number(saltRounds));
}

export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
}