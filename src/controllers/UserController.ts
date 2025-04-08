import { Request, Response } from "express";
import { User } from "../models/User";
import { hash, compare } from "../utils/hashManager";
import { generateToken } from "../utils/tokenManager";
import { AppError } from "../middlewares/errorHandler";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
  rememberMe: z.boolean().optional()
});

export class UserController {
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, sort = "name", order = "asc", search = "" } = req.query;
      
      const skip = (Number(page) - 1) * Number(limit);
      const sortOrder = order === "desc" ? -1 : 1;

      const query = search 
        ? { 
            $or: [
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } }
            ]
          }
        : {};

      const [users, total] = await Promise.all([
        User.find(query)
          .select("-password")
          .sort({ [sort as string]: sortOrder })
          .skip(skip)
          .limit(Number(limit)),
        User.countDocuments(query)
      ]);

      res.status(200).json({
        status: "success",
        data: users,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      throw new AppError("Erro ao buscar usuários", 500);
    }
  }

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, confirmPassword } = signupSchema.parse(req.body);

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
        loginAttempts: 0,
        lastLoginAttempt: null
      });

      const token = generateToken(user._id as string);
      
      res.status(201).json({
        status: "success",
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          },
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map(err => err.message).join(", ");
        res.status(400).json({
          status: "error",
          message: errorMessage
        });
        return;
      }
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: "error",
          message: error.message
        });
        return;
      }
      res.status(500).json({
        status: "error",
        message: "Erro ao criar usuário"
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, rememberMe } = loginSchema.parse(req.body);

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new AppError("Usuário não encontrado", 404);
      }

      // Verifica se a conta está bloqueada
      if (user.loginAttempts >= 5 && user.lastLoginAttempt) {
        const timeDiff = Date.now() - user.lastLoginAttempt.getTime();
        const minutesLeft = Math.ceil((30 * 60 * 1000 - timeDiff) / (60 * 1000));
        
        if (timeDiff < 30 * 60 * 1000) { // 30 minutos
          throw new AppError(`Conta bloqueada. Tente novamente em ${minutesLeft} minutos.`, 401);
        } else {
          // Reseta as tentativas após 30 minutos
          user.loginAttempts = 0;
          await user.save();
        }
      }

      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        // Incrementa tentativas de login
        user.loginAttempts += 1;
        user.lastLoginAttempt = new Date();
        await user.save();
        
        throw new AppError("Senha incorreta", 401);
      }

      // Reseta tentativas após login bem sucedido
      user.loginAttempts = 0;
      user.lastLoginAttempt = null;
      await user.save();

      // Gera token com expiração baseada no rememberMe
      const token = generateToken(user._id as string, rememberMe ? "7d" : "24h");

      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      };

      res.status(200).json({
        status: "success",
        data: {
          token,
          user: userResponse
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError(error.errors[0].message, 400);
      }
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erro ao fazer login", 500);
    }
  }
}
