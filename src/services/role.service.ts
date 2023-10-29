import IRole from "../interfaces/IRole";
import ServiceResult from "../interfaces/IService";
import { RoleModel } from "../models/role.model";

// criar uma classe RoleServices
export class RoleService {
  private model;

  constructor() {
    this.model = new RoleModel();
  }

  async findByUser(user: string): Promise<ServiceResult<IRole>> {
    try {
      console.log(user)
      const data = await this.model.findByUser(user) as IRole;
      return {
        status: "SUCCESS",
        data,
      };
    } catch (error) {
      return {
        status: "ERROR",
        data: { message: JSON.stringify(error) || "Internal server error" },
      };
    }
  }

  async create(role: IRole): Promise<ServiceResult<IRole>> {
    try {
      const data = await this.model.create(role);
      return {
        status: "SUCCESS",
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
