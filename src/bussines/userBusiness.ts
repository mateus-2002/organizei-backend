import { UserRepository } from "../repository/userRepository";
import { hash } from "../services/hashManager";
import { IUser, IUserInputDTO } from "../types/userTypes";
import { IdGenerator } from "../services/idGenerator";

export class UserBusiness {
  private userRepository = new UserRepository();
  private idGenerator = new IdGenerator();

  async createUser(userInput: IUserInputDTO): Promise<IUser> {
    const id = this.idGenerator.generate();
    const hashedPassword = await hash(userInput.password);

    const newUser: IUser = {
      id,
      name: userInput.name,
      email: userInput.email,
      password: hashedPassword,
    };

    return await this.userRepository.save(newUser);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await this.userRepository.findByEmail(email);
  }
}
