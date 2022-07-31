import jwt from 'jsonwebtoken'
import passport from 'passport'
import { config } from '../config'
import User from '../models/User'

export const handleLogin = async (req, res, next) => {


    // console.log(req.user)
    // res.json('is ok logueado papi')

    try {
        let user = req.user
        // console.log(user)
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

        //guardo en bbdd el refresh token 
        const userUpdated = await User.findByIdAndUpdate(user._id, { refreshToken }).exec()
   
        if (!userUpdated) {
            return res.status(404).json({
                error_message: `The refresh token cant be saved to ${user._id} user.`,
            });
        }

        // console.log(userToUpdate)
        // console.log('hasta aca  ')


        res.json({
            user,
            accessToken
        })
    } catch (err) {
        next(err)
    }

}