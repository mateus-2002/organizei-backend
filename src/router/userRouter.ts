import express from "express";
import { UserController } from "../controller/userController";

const router = express.Router();
const userController = new UserController();

router.post("/register", userController.createUser);

export default router;
