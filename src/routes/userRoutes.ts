import { Router, RequestHandler } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = new UserController();

router.get('/users', userController.getUsers as RequestHandler);

export default router;