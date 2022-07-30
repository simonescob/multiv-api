import jwt from 'jsonwebtoken'
import passport from 'passport'
import { config } from '../config'
import User from '../models/User'

export const handleLogin = async (req, res, next) => {


    // console.log(req.user)
    // res.json('is ok logueado papi')

    try {
        const user = req.user
        console.log(user)
        const payload = {
            sub: user._id,
            role: user.role
        }

        const accessToken = jwt.sign(
            payload,
            config.accessTokenSecret,
            { expiresIn: '1m' }
        )

        const refreshToken = jwt.sign(
            payload,
            config.refreshTokenSecret,
            { expiresIn: '1d' }
        )

        const userToUpdate = new User.findOne({
            username: user
        })

        console.log(userToUpdate)


        res.json({
            user,
            accessToken
        })
    } catch (err) {
        next(err)
    }

}