import { Request, Response } from "express";
import StudentService from "../services/student.service";
import { mapStatusHTTP } from "../utils/mapStatusHTTP";


class StudentController {
  private service: StudentService;
  constructor() {
    this.service = new StudentService();
  }

  async find(_req: Request, res: Response): Promise<Response>{
    const { status, data } = await this.service.find();
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async findByUser(req: Request, res: Response): Promise<Response>{
    const { status, data } = await this.service.findByUser(req.body.user);
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async create(req: Request, res: Response): Promise<Response>{
    const { status, data } = await this.service.create(req.body.student);
    return res.status(mapStatusHTTP(status)).json(data);
  }

}

export default StudentController;