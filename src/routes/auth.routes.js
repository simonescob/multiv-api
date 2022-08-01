import passport from 'passport'
import { Router } from 'express';
import * as authController from '../controllers/auth.controller'

const router = Router();

router.post(
    '/login',
    passport.authenticate('local', { session: false }),
    authController.handleLogin
);

router.get(
    '/refresh',
    authController.handleRefreshToken
);

router.get(
    '/logout',
    authController.handleLogout
);

export default router;
