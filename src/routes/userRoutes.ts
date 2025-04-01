import { Router, RequestHandler } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = new UserController();

router.get('/users', userController.getUsers as RequestHandler);
router.post('/login', userController.login as RequestHandler);
router.post('/signup', userController.signup as RequestHandler);

export default router;