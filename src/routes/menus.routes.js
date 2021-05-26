import { Router } from 'express';
import * as menuController from '../controllers/menu.controller';

const router = Router();

router.post('/', menuController.createMenu);

router.get('/', menuController.findAllMenus);

router.get('/active', menuController.findAllActiveMenus);

router.get('/:id', menuController.findOneMenu);

router.delete('/:id', menuController.deleteMenu);

router.put('/:id', menuController.updateMenu);

export default router;
