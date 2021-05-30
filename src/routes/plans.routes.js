import { Router } from 'express';
import * as planController from '../controllers/plan.controller';

const router = Router();

router.post('/', planController.createPlan);

router.get('/', planController.findAllPlans);

// router.get('/active', viandaController.findAllActiveViandas);

// router.get('/:id', viandaController.findOneVianda);

// router.delete('/:id', viandaController.deleteVianda);

// router.put('/:id', viandaController.updateVianda);

export default router;
