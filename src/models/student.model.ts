import { Model, Schema, model } from "mongoose";

class StudentModel {
  public readonly model: Model<IStudent>;

  constructor() {
    const schema = new Schema<IStudent>({
      name: String,
      school: String,
      email: String,
      password: String,
      role: String,
      frequency: {
        monday: Boolean,
        tuesday: Boolean,
        wednesday: Boolean,
        thursday: Boolean,
        friday: Boolean,
        saturday: Boolean,
        sunday: Boolean,
      },
    });
    this.model = model<IStudent>("Student", schema);
  }

  async create(student: IStudent) {
    return await this.model.create(student);
  }

  async find() {
    return await this.model.find();
  }

  async findById(id: string) {
    return await this.model.findById(id);
  }

  async findByEmail(email: string) {
    return (
      await this.model.findOne({
        email,
      })
    )?.toObject();
  }

  async update(id: string, student: IStudent) {
    return await this.model.updateOne({ _id: id }, student);
  }

  async delete(id: string) {
    return await this.model.deleteOne({ _id: id });
  }
}

export default new StudentModel();
