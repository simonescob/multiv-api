import { Router } from 'express'
import * as ingredientController from '../controllers/ingredient.controller'

const router = Router()

router.get('/', ingredientController.findAllIngredients)
router.post('/', ingredientController.uploadImg, ingredientController.createIngredient)
router.get('/active', ingredientController.findAllActiveIngredients)
router.get('/intrash', ingredientController.findAllinTrashIngredients)

router.get('/:id', ingredientController.findOneIngredient)
router.put('/:id', ingredientController.updateIngredient)
router.delete('/:id', ingredientController.deleteIngredient)

export default router
