import { Router } from 'express';
import { createMotorista,getAllMotoristas } from '../controllers/motorista.controller'; 

const router = Router();

// Rota para confirmar a viagem e caucular a viagem
router.post('/createMotorista', createMotorista); 
router.get('/getAllMotoristas', getAllMotoristas); 

export default router;
