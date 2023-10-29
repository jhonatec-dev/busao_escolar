import ServiceResult from "../interfaces/IService";
import StudentModel from "../models/student.model";
import { generateToken } from "../utils/JWT";
import { comparePassword } from "../utils/encrypt";

class StudentService {
  async find(): Promise<ServiceResult<IStudent[]>> {
    const data = await StudentModel.find();
    return {
      status: "SUCCESS",
      data,
    };
  }

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<ServiceResult<{ token: string }>> {
    try {
      const data = await StudentModel.findByEmail(email);
      if (!data) {
        throw new Error("User not found");
      }

      if (data.password && !comparePassword(password, data.password)) {
        throw new Error("Password invalid");
      }

      const { password: passwordDB, ...student } = data;

      const token = generateToken(student);

      return {
        status: "SUCCESS",
        data: { token },
      };
    } catch (error) {
      return {
        status: "NOT_FOUND",
        data: { message: JSON.stringify(error) || "Internal server error" },
      };
    }
  }

  async create(student: IStudent) {
    try {
      const data = await StudentModel.create(student);
      return {
        status: "CREATED",
        data,
      };
    } catch (error) {
      return {
        status: "ERROR",
        data: { message: JSON.stringify(error) || "Internal server error" },
      };
    }
  }
}

export default StudentService;
