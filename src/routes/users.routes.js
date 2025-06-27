import { Router } from 'express'
import * as userController from '../controllers/user.controller'
// const passport = rkequire('passport');
// import { checkRoles } from '../middlewares/auth.handler';
import { changePasswordByEmail } from '../controllers/user.controller.js';

const router = Router()

router.post('/', userController.createUser)
router.get('/', userController.findAllUsers)
router.get('/active', userController.findAllActiveUsers)
router.get('/:id', userController.findOneUser)
router.delete('/delete-all', userController.deleteAllUsers)
router.delete('/:id', userController.deleteUser)
router.put('/:id', userController.updateUser)

router.get('/roles', userController.findAllRoles)

// Add this route to handle password changes by email
router.put('/change-password', changePasswordByEmail);

export default router
