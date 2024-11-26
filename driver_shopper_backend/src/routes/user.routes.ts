import { Router } from 'express';
import UserController from '../controllers/user.controller';

const router = Router();

//Rotas para cadastro busca e deletar um usuario 
router.get('/', UserController.getAllUsers);
router.post('/', UserController.createUser);
router.put('/:customer_id', UserController.updateUser);
router.delete('/:customer_id', UserController.deleteUser);

export default router;
