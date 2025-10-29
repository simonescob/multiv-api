import { Router } from 'express'
import * as kitchenOrderController from '../controllers/kitchen.order.controller'

const router = Router()

// Specific routes first (before parameterized routes)
router.post('/', kitchenOrderController.createKitchenOrder)
router.get('/', kitchenOrderController.findAllKitchenOrders)
router.get('/search/products', kitchenOrderController.searchKitchenOrdersByProductName)
router.get('/active', kitchenOrderController.findAllActiveKitchenOrders)
router.delete('/delete-all', kitchenOrderController.deleteAllKitchenOrders)

// User-specific routes
router.get('/user/:userId/simple/:kitchenOrderId', kitchenOrderController.getOrdersAssignedToUserSimpleHandler)
router.get('/user/:userId/simple', kitchenOrderController.getOrdersAssignedToUserSimpleHandler)
router.get('/user/:userId', kitchenOrderController.KitchenOrdersByUser)

// Parameterized routes (/:id routes last)
router.put('/:id/state', kitchenOrderController.updateOrderState)
router.put('/trash/:id', kitchenOrderController.sendToTrashKitchenOrder)
router.get('/:id', kitchenOrderController.findOneKitchenOrder)
router.put('/:id', kitchenOrderController.updateKitchenOrder)
router.delete('/:id', kitchenOrderController.deleteKitchenOrder)

export default router