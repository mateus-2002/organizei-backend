import { Request, Response } from "express";
import { User } from "../models/User";
import { hash, compare } from "../utils/hashManager";
import { generateToken } from "../utils/tokenManager";
import { AppError } from "../middlewares/errorHandler";

export class UserController {
  async editUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, dateOfBirth } = req.body;

      console.log("ID recebido:", id);
      console.log("Dados recebidos para atualização:", req.body);

      if (!name && !dateOfBirth) {
        throw new AppError(
          "Pelo menos um campo deve ser enviado para atualização",
          400
        );
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, dateOfBirth },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        throw new AppError("Usuário não encontrado", 404);
      }

      console.log("Usuário atualizado com sucesso:", updatedUser);

      res.status(200).json({
        status: "success",
        data: {
          id: updatedUser._id,
          name: updatedUser.name,
          dateOfBirth: updatedUser.dateOfBirth,
          email: updatedUser.email,
        },
      });
    } catch (error) {
      console.error("Erro no método editUser:", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erro ao editar usuário", 500);
    }
  }

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { coduser, name, dateOfBirth, email, password } = req.body;
      if (!coduser || !name || !email || !password || !dateOfBirth) {
        throw new AppError("Todos os campos são obrigatórios", 400);
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AppError("Usuário já existe", 400);
      }
      const hashedPassword = await hash(password);
      const user = await User.create({
        coduser,
        name,
        dateOfBirth,
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
            coduser: user.coduser,
            name: user.name,
            dateOfBirth: user.dateOfBirth,
            email: user.email,
          },
        },
      });
    } catch (error) {
      throw new AppError("Erro ao criar usuário", 500);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      console.log("Dados recebidos:", { email, password });

      if (!email || !password) {
        console.log("Campos obrigatórios ausentes");
        throw new AppError("Email e senha são obrigatórios", 400);
      }

      const user = await User.findOne({ email }).select("+password");
      console.log("Usuário encontrado:", user);

      if (!user) {
        console.log("Usuário não encontrado");
        throw new AppError("Usuário não encontrado", 404);
      }

      const isPasswordValid = await compare(password, user.password);

      if (!isPasswordValid) {
        console.log("Senha incorreta");
        throw new AppError("Senha incorreta", 401);
      }

      const token = generateToken(user._id as string);
      console.log("Token gerado:", token);

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
      console.error("Erro no login:", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erro ao fazer login", 500);
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select("-password");

      if (!user) {
        throw new AppError("Usuário não encontrado", 404);
      }

      res.status(200).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      throw new AppError("Erro ao buscar usuário", 500);
    }
  }

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
}
