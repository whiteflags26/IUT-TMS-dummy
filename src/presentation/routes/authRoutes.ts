import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { passwordValidator } from '../middlewares/passwordValidator';

const router = Router();
const authController = new AuthController();

router.post('/register', passwordValidator, (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));

export default router;
