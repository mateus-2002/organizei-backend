import { UserRepository } from "../repository/userRepository";
import { IUser, IUserInputDTO } from "../types/userTypes";
import { hash, compare } from "../services/hashManager";
import { generatedId } from "../services/idGenerator";

export class UserBusiness {
  private userRepository = new UserRepository();

  async createUser(userInput: IUserInputDTO): Promise<IUser> {
    const id = generatedId();
    const cypherPassword = await hash(password);

    const newUser: IUser = {
      id,
      name: userInput.name,
      email: userInput.email,
      password: cypherPassword,
    };

    return await this.userRepository.save(newUser);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await this.userRepository.findByEmail(email);
  }
}
