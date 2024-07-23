import { Router } from 'express'
import * as ingredientController from '../controllers/ingredient.controller'

const router = Router()

router.get('/', ingredientController.findAllIngredients)
router.post('/', ingredientController.uploadImg, ingredientController.createIngredient)
router.get('/active', ingredientController.findAllActiveIngredients)
// router.get('/intrash', ingredientController.findAllinTrashIngredients)
router.delete('/delete-all', ingredientController.deleteAllIngredients)

router.get('/:id', ingredientController.findOneIngredient)
router.put('/:id', ingredientController.updateIngredient)
router.put('/trash/:id', ingredientController.sendToTrashIngredient)
router.delete('/:id', ingredientController.deleteIngredient)

export default router
