import { Router } from 'express';
import * as viandaController from '../controllers/vianda.controller';

const router = Router();

router.post('/', viandaController.createVianda);

router.get('/', viandaController.findAllViandas);

// router.get('/used', vehicleController.findAllUsedVehicles);

// router.get('/:id', vehicleController.findOneVehicle);

// router.delete('/:id', vehicleController.deleteVehicle);

// router.put('/:id', vehicleController.updateVehicle);

export default router;
