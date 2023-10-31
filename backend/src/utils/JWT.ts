import { configDotenv } from 'dotenv'
import * as Jwt from 'jsonwebtoken'
import type IToken from '../interfaces/IToken'

configDotenv()

class JWT {
  public generateToken = (payload: any): string => {
    return Jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '1d'
    })
  }

  public verifyToken = (token: string): IToken => {
    return Jwt.verify(token, process.env.JWT_SECRET as string) as IToken
  }
}

export default new JWT()
