import { Router } from 'express';
import * as ingredientController from '../controllers/ingredient.controller';

const router = Router();

router.post('/', ingredientController.uploadImg, ingredientController.createIngredient);

router.get('/', ingredientController.findAllIngredients);

router.get('/active', ingredientController.findAllActiveIngredients);

router.get('/intrash', ingredientController.findAllinTrashIngredients);

router.get('/:id', ingredientController.findOneIngredient);

router.delete('/:id', ingredientController.deleteIngredient);

router.put('/:id', ingredientController.updateIngredient);

export default router;
