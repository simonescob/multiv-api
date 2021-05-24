import { Router } from 'express';
import * as ingredientController from '../controllers/ingredient.controller';

const router = Router();

router.post('/', ingredientController.createIngredient);

router.get('/', ingredientController.findAllIngredients);

export default router;
