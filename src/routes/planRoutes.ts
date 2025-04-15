import { Router, RequestHandler } from 'express';
import { PlanController } from '../controllers/PlanController';

const router = Router();
const planController = new PlanController();


router.post("/plans", (req, res) => planController.createPlan(req, res));
router.get("/plans", (req, res) => planController.listPlans(req, res));


export default router;