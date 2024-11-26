import { Router } from 'express';
import { confirmRide, estimateRide, listRide} from '../controllers/ride.controller'; 

const router = Router();

// Rota para confirmar a viagem e caucular a viagem
router.post('/confirm', confirmRide); 
router.post('/estimate', estimateRide);
router.get('/:customer_id/:driver_id?', listRide);

export default router;
