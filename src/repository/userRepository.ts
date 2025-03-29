import { UserModel } from "../data/models/userModels";
import { IUser } from "../types/userTypes";

export class UserRepository {
  async save(user: IUser): Promise<IUser> {
    return await UserModel.create(user);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }
}
