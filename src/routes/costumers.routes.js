import { Router } from 'express';
import * as costumerController from '../controllers/costumer.controller';

const router = Router();

router.post('/', costumerController.createCostumer);

router.get('/', costumerController.findAllCostumers);

router.get('/active', costumerController.findAllActiveCostumers);

router.get('/:id', costumerController.findOneCostumer);

router.delete('/:id', costumerController.deleteCostumer);

router.put('/:id', costumerController.updateCostumer);

export default router;
