import { Router } from 'express'
import * as orderController from '../controllers/order.controller'

const router = Router()

router.post('/', orderController.createOrder)

router.get('/', orderController.findAllOrders)

router.get('/active', orderController.findAllActiveOrders)

router.get('/:id', orderController.findOneOrder)

router.delete('/:id', orderController.deleteOrder)

router.put('/:id', orderController.updateOrder)

router.put('/trash/:id', orderController.sendToTrashOrder)

export default router
