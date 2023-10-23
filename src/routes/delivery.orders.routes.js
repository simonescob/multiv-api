import { Router } from 'express';
import * as deliveryOrderController from '../controllers/delivery.order.controller';

const router = Router();

router.post('/', deliveryOrderController.createDeliveryOrder);

router.get('/', deliveryOrderController.findAllDeliveryOrders);

router.get('/active', deliveryOrderController.findAllActiveDeliveryOrders);

router.get('/:id', deliveryOrderController.findOneDeliveryOrder);

router.delete('/:id', deliveryOrderController.deleteDeliveryOrder);

router.put('/:id', deliveryOrderController.updateDeliveryOrder);

export default router;
