import { Router } from 'express';
import * as userController from '../controllers/user.controller';
const passport = require('passport');
import { checkRoles } from '../middlewares/auth.handler';


const router = Router();

router.post('/',
    passport.authenticate('jwt', { session: false }),
    checkRoles('admin'),
    userController.createUser);

router.get('/',
    passport.authenticate('jwt', { session: false }),
    checkRoles('admin'),
    userController.findAllUsers);

router.get('/active', userController.findAllActiveUsers);

router.get('/:id', userController.findOneUser);

router.delete('/:id', userController.deleteUser);

router.put('/:id', userController.updateUser);

export default router;
