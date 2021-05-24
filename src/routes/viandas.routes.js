import { Router } from 'express';
import * as viandaController from '../controllers/vianda.controller';

const router = Router();

router.post('/', viandaController.createVianda);

router.get('/', viandaController.findAllViandas);

router.get('/active', viandaController.findAllActiveViandas);

router.get('/:id', viandaController.findOneVianda);

router.delete('/:id', viandaController.deleteVianda);

router.put('/:id', viandaController.updateVianda);

export default router;
