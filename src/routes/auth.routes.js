import passport from 'passport'
import { Router } from 'express';
import * as authController from '../controllers/auth.controller'

const router = Router();

router.post(
    '/login',
    passport.authenticate('local', { session: false }),
    authController.handleLogin
    );

export default router;
