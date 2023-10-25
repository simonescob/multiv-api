// import passport from 'passport'
import { Router } from 'express'
import * as authController from '../controllers/auth.controller'
// import passport from 'passport'

const router = Router()

router.post('/login', authController.loginUser)
router.post('/refresh', authController.refreshToken)

// router.post(
//     '/login',
//     passport.authenticate('local', { session: false }),
//     authController.handleLogin
// );

// router.get(
//     '/refresh',
//     authController.handleRefreshToken
// );

// router.get(
//     '/logout',
//     authController.handleLogout
// );

export default router
