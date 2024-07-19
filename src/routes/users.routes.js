import { Router } from 'express'
import * as userController from '../controllers/user.controller'
// const passport = rkequire('passport');
// import { checkRoles } from '../middlewares/auth.handler';

const router = Router()

router.post('/', userController.createUser)

router.get('/', userController.findAllUsers)

router.get('/active', userController.findAllActiveUsers)

router.get('/:id', userController.findOneUser)

router.delete('/:id', userController.deleteUser)

router.put('/:id', userController.updateUser)

export default router
