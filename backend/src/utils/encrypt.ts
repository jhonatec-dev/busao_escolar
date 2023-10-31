import bcrypt from 'bcrypt'
import { configDotenv } from 'dotenv'

configDotenv()

const saltRounds = process.env.SALT_ROUNDS

export const encrypt = (password: string): string => {
  return bcrypt.hashSync(password, Number(saltRounds))
}

export const comparePassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash)
}
