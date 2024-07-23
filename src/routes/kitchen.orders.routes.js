import { Router } from 'express'
import * as kitchenOrderController from '../controllers/kitchen.order.controller'

const router = Router()

router.post('/', kitchenOrderController.createKitchenOrder)

router.get('/', kitchenOrderController.findAllKitchenOrders)

router.get('/active', kitchenOrderController.findAllActiveKitchenOrders)

router.get('/:id', kitchenOrderController.findOneKitchenOrder)

router.delete('/:id', kitchenOrderController.deleteKitchenOrder)

router.put('/:id', kitchenOrderController.updateKitchenOrder)

router.put('/trash/:id', kitchenOrderController.sendToTrashKitchenOrder)

export default router
