import { Router } from 'express'
import * as kitchenOrderController from '../controllers/kitchen.order.controller'

const router = Router()

router.post('/', kitchenOrderController.createKitchenOrder)
router.get('/', kitchenOrderController.findAllKitchenOrders)
router.get('/active', kitchenOrderController.findAllActiveKitchenOrders)
router.get('/:id', kitchenOrderController.findOneKitchenOrder)
router.delete('/delete-all', kitchenOrderController.deleteAllKitchenOrders)
router.delete('/:id', kitchenOrderController.deleteKitchenOrder)
router.put('/:id', kitchenOrderController.updateKitchenOrder)
router.put('/:id/state', kitchenOrderController.updateOrderState)
router.put('/trash/:id', kitchenOrderController.sendToTrashKitchenOrder)
router.get('/user/:userId', kitchenOrderController.KitchenOrdersByUser)
router.get('/user/:userId/simple', kitchenOrderController.getOrdersAssignedToUserSimpleHandler)
router.get('/user/:userId/simple/:kitchenOrderId', kitchenOrderController.getOrdersAssignedToUserSimpleHandler)

export default router