import { Request, Response } from "express";
import { User } from "../models/User";
import { hash, compare } from "../utils/hashManager";
import { generateToken } from "../utils/tokenManager";
import { AppError } from "../middlewares/errorHandler";

export class UserController {
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find().select("-password");

      res.status(200).json({
        status: "success",
        data: users,
      });
    } catch (error) {
      throw new AppError("Erro ao buscar usuários", 500);
    }
  }
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        throw new AppError("Todos os campos são obrigatórios", 400);
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AppError("Usuário já existe", 400);
      }
      const hashedPassword = await hash(password);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "user",
      });
      const token = generateToken(user._id as string);
      res.status(201).json({
        status: "success",
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        },
      });
      res.status(201).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      throw new AppError("Erro ao criar usuário", 500);
    }
  }
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError("Email e senha são obrigatórios", 400);
      }

      const user = await User.findOne({ email });

      if (!user) {
        throw new AppError("Usuário não encontrado", 404);
      }

      const isPasswordValid = await compare(password, user.password);

      if (!isPasswordValid) {
        throw new AppError("Senha incorreta", 401);
      }

      const token = generateToken(user._id as string);

      res.status(200).json({
        status: "success",
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erro ao fazer login", 500);
    }
  }
}
