import { Router } from 'express'
import * as menuController from '../controllers/menu.controller'

const router = Router()

router.get('/', menuController.findAllMenus)

router.post('/', menuController.createMenu)

router.get('/active', menuController.findAllActiveMenus)

router.get('/:id', menuController.findOneMenu)

router.delete('/delete-all', menuController.deleteAllMenus)

router.delete('/:id', menuController.deleteMenu)

router.put('/:id', menuController.updateMenu)

router.put('/trash/:id', menuController.sendToTrashMenu)

export default router
