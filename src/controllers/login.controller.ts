import { Request, Response } from "express";
import StudentService from "../services/student.service";
import { mapStatusHTTP } from "../utils/mapStatusHTTP";

export class LoginController {
  private service: StudentService;

  constructor() {
    this.service = new StudentService();
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { status, data } = await this.service.login(req.body);
      console.log('status', status, 'data', data, 'controller');
      if (status !== "SUCCESS") {
        throw new Error("Dados de login inválidos ou usuário não autorizado");
      }

      return res.status(mapStatusHTTP(status)).json(data);
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  }
}
