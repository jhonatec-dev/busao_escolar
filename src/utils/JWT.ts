import { configDotenv } from "dotenv";
import * as Jwt from "jsonwebtoken";

configDotenv();

class JWT {
  public static generateToken = (payload: any) => {
    return Jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });
  };

  public static verifyToken = (token: string) => {
    return Jwt.verify(token, process.env.JWT_SECRET as string);
  };
}

export default JWT;
