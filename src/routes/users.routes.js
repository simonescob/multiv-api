import { Router } from 'express';
import * as userController from '../controllers/user.controller';
const passport = require('passport');

const router = Router();

router.post('/',
    passport.authenticate('jwt', { session: false }),
    userController.createUser);

router.get('/', userController.findAllUsers);

router.get('/active', userController.findAllActiveUsers);

router.get('/:id', userController.findOneUser);

router.delete('/:id', userController.deleteUser);

router.put('/:id', userController.updateUser);

export default router;
