import { Error } from "mongoose";
import ServiceResult from "../interfaces/IService";
import StudentModel from "../models/student.model";
import JWT from "../utils/JWT";
import { comparePassword, encrypt } from "../utils/encrypt";
import Email from "../utils/sendEmail";

class StudentService {
  async find(): Promise<ServiceResult<IStudent[]>> {
    const data = await StudentModel.find();
    return {
      status: "SUCCESS",
      data,
    };
  }

  async findById(id: string): Promise<ServiceResult<IStudent>> {
    try {
      const data = await StudentModel.findById(id);
      if (!data) {
        throw new Error("User not found");
      }
      return {
        status: "SUCCESS",
        data,
      };
    } catch (error: Error | any) {
      return {
        status: "NOT_FOUND",
        data: { message: error.message || "Internal server error" },
      };
    }
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

      const { password: passwordDB, frequency, ...student } = data;

      if (!data.accepted) {
        throw new Error("User not accepted");
      }

      const token = JWT.generateToken(student);

      return {
        status: "SUCCESS",
        data: { token },
      };
    } catch (error: Error | any) {
      return {
        status: "NOT_FOUND",
        data: { message: error.message || "Internal server error" },
      };
    }
  }

  async create(student: IStudent) {
    try {
      await StudentModel.model.validate(student);

      const studentWithSameEmail = await StudentModel.findByEmail(
        student.email
      );
      if (studentWithSameEmail) {
        let errorMessage = "Usuário já cadastrado";
        if (!studentWithSameEmail.accepted)
          errorMessage += " - não liberado pelo administrador. Aguarde.";
        throw new Error(errorMessage);
      }
      if (student.password) {
        student.password = encrypt(student.password);
      }
      const data = await StudentModel.create({
        ...student,
        accepted: false,
        role: "student",
      });
      const adminList = await StudentModel.getAdminList();
      await Email.sendConfirmationEmail(student, adminList);
      return {
        status: "CREATED",
        data,
      };
    } catch (error: Error | any) {
      return {
        status: "INVALID",
        data: { message: error.message || "Internal server error" },
      };
    }
  }

  private async isDuplicateEmail(email: string, _id: string): Promise<boolean> {
    const data = await StudentModel.model.find({ email, _id: { $ne: _id } });
    return data.length > 0;
  }

  async update(id: string, student: IStudent) {
    // verificar se o estudante existe
    try {
      const data = await StudentModel.findById(id);
      if (!data) {
        throw new Error("Usuario nao encontrado");
      }
      if (await this.isDuplicateEmail(student.email, id)) {
        throw new Error("Email já existe");
      }
      await StudentModel.update(id, student);
      return {
        status: "UPDATED",
        data,
      };
    } catch (error: Error | any) {
      return {
        status: "ERROR",
        data: { message: error.message || "Internal server error" },
      };
    }
    // verificar duplicidade de email
  }

  async delete(id: string) {
    try {
      const data = await StudentModel.findById(id);
      if (!data) {
        throw new Error("User not found");
      }
      await StudentModel.delete(id);
      return {
        status: "DELETED",
        data: {
          _id: id,
        },
      };
    } catch (error: Error | any) {
      return {
        status: "ERROR",
        data: { message: error.message || "Internal server error" },
      };
    }
  }
}

export default StudentService;
