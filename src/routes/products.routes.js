import { Router } from 'express'
import * as productController from '../controllers/product.controller'

const router = Router()

router.post('/', productController.createProduct)

router.get('/', productController.findAllProducts)

router.get('/active', productController.findAllActiveProducts)

router.get('/:id', productController.findOneProduct)

router.delete('/delete-all', productController.deleteAllProducts)

router.delete('/:id', productController.deleteProduct)

router.put('/:id', productController.updateProduct)

router.put('/trash/:id', productController.sendToTrashProduct)

export default router
