import { Request, Response } from "express";
import { AppError } from "../middlewares/errorHandler";
import { Plan } from "../models/Plan";
import { User } from "../models/User";

export class PlanController {
  async createPlan(req: Request, res: Response): Promise<void> {
    console.log("Requisição recebida no método createPlan:", req.body);
    try {
      console.log("Requisição recebida no método createPlan:", req.body);
      const { name, price, features } = req.body;

      if (!name || price === undefined || !features) {
        throw new AppError("Todos os campos são obrigatórios", 400);
      }

      const existingPlan = await Plan.findOne({ name });
      if (existingPlan) {
        throw new AppError("Plano já existe", 400);
      }

      const plan = await Plan.create({ name, price, features });

      res.status(201).json({
        status: "success",
        data: plan,
      });
    } catch (error) {
      console.error("Erro ao criar plano:", error);
      throw new AppError("Erro ao criar plano", 500);
    }
  }

  async listPlans(req: Request, res: Response): Promise<void> {
    try {
      const plans = await Plan.find();

      res.status(200).json({
        status: "success",
        data: plans,
      });
    } catch (error) {
      console.error("Erro ao listar planos:", error);
      throw new AppError("Erro ao listar planos", 500);
    }
  }
  /*
  async updateUserPlan(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { planId } = req.body;

      if (!planId) {
        throw new AppError("O ID do plano é obrigatório", 400);
      }

      const plan = await Plan.findById(planId);
      if (!plan) {
        throw new AppError("Plano não encontrado", 404);
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { plan: planId },
        { new: true }
      ).populate("plan");

      if (!user) {
        throw new AppError("Usuário não encontrado", 404);
      }

      res.status(200).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      console.error("Erro ao atualizar plano do usuário:", error);
      throw new AppError("Erro ao atualizar plano do usuário", 500);
    }
  }*/
}
