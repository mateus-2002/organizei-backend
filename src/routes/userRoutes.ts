import { Router, RequestHandler } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = new UserController();

router.put('/users/:id', userController.editUser as RequestHandler);
router.post('/login', userController.login as RequestHandler);
router.post('/signup', userController.signup as RequestHandler);
router.get('/users/:id', userController.getUserById as RequestHandler);
router.get('/users', userController.getUsers as RequestHandler);

export default router;