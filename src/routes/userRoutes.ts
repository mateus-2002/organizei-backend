import { Router, RequestHandler } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = new UserController();

router.get('/', userController.getUsers as RequestHandler);
router.post('/', userController.create as RequestHandler);

export default router;