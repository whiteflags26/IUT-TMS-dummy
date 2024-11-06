import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { auth, authorize } from '../middlewares/authorizer';
import { passwordValidator } from '../middlewares/passwordValidator';

const router = Router();
const userController = new UserController();

router.get('/', auth, authorize(['ADMIN']), (req, res) => 
    userController.getAllUsers(req, res));

router.get('/:id', auth, authorize(['ADMIN']), (req, res) => 
    userController.getUserById(req, res));

router.post('/', auth, authorize(['ADMIN']), passwordValidator, (req, res) => 
    userController.createUser(req, res));

router.put('/:id', auth, authorize(['ADMIN']), passwordValidator, (req, res) => 
    userController.updateUser(req, res));

router.delete('/:id', auth, authorize(['ADMIN']), (req, res) => 
    userController.deleteUser(req, res));

export default router;