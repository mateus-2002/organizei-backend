import { Request, Response } from "express";
import { UserBusiness } from "../bussines/userBusiness";

export class UserController {
  private userBusiness = new UserBusiness();

  async createUser(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const newUser = await this.userBusiness.createUser({ name, email, password });

      return res.status(201).json(newUser);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      return res.status(400).json({ message: errorMessage });
    }
  }
}
