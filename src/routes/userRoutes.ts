import { Router } from "express";
import { UserController } from "../controllers/userController";
import {
  validateUserData,
  validateSignupData,
  validateLoginData,
  checkUserExists,
} from "../middlewares/userMiddleware";

const router = Router();
const userController = new UserController();

// Rotas de usuário
router.post("/signup", validateSignupData, userController.signup);
router.post("/login", validateLoginData, userController.login);
router.get("/users", userController.getUsers);
router.get("/users/:id", checkUserExists, userController.getUserById);
router.patch("/users/:id", validateUserData, checkUserExists, userController.editUser);

export default router;