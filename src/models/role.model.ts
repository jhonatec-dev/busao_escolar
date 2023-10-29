import mongoose, { Model } from "mongoose";
import IRole from "../interfaces/IRole";

export class RoleModel {
  private model: Model<IRole>;
  constructor() {
    const schema = new mongoose.Schema<IRole>({
      user: String,
      password: String,
    });
    this.model = mongoose.model<IRole>("Role", schema);
  }

  async create(role: IRole) {
    return await this.model.create(role);
  }

  async find() {
    return await this.model.find();
  }

  async findByUser(user: string) {
    return await this.model.findOne({ user });
  }

  async update(id: string, role: IRole) {
    return await this.model.updateOne({ _id: id }, role);
  }
}
